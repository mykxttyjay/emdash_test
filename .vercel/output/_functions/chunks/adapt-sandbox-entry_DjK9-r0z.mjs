import { d as decodeCursor, e as encodeCursor, b as validateJsonFieldName, j as jsonExtractExpr } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { t as ContentRepository } from './content-C0ooIs-f_Bwo8eX_E.mjs';
import { M as MediaRepository } from './media-oqRcNiQf_LipfpTx8.mjs';
import { U as UserRepository } from './user-D3BD5zdT_BXs4wDjl.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { w as withTransaction } from './transaction-NQj4VJ7Z_CWeepMQn.mjs';
import { S as SeoRepository, P as PLUGIN_CAPABILITIES, H as HOOK_NAMES } from './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import { i as invalidateSiteSettingsCache } from './settings-hcubRfkr_CN9G8DMH.mjs';
import { r as resolveAndValidateExternalUrl, S as SsrfError, s as stripCredentialHeaders } from './ssrf-MZ-zrG6-_C2NT9OCQ.mjs';
import { a as CronAccessImpl } from './cron-Bd3b3iuj_BoAH8XnB.mjs';
import { sql } from 'kysely';
import { ulid } from 'ulidx';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { normalizeCapabilities } from '@emdash-cms/plugin-types';
import './setup-Cf_TyOv5_Da69AHYi.mjs';
import { e as extractRequestMeta } from './request-meta-C_Cjii-T_DOD2oc_A.mjs';
import 'croner';
import { AsyncLocalStorage } from 'node:async_hooks';
import * as z from 'zod/v4';

//#region src/plugins/storage-query.ts
/**
* Error thrown when querying non-indexed fields
*/
var StorageQueryError = class extends Error {
	constructor(message, field, suggestion) {
		super(message);
		this.field = field;
		this.suggestion = suggestion;
		this.name = "StorageQueryError";
	}
};
/**
* Check if a value is a range filter
*/
function isRangeFilter(value) {
	if (typeof value !== "object" || value === null) return false;
	return "gt" in value || "gte" in value || "lt" in value || "lte" in value;
}
/**
* Check if a value is an IN filter
*/
function isInFilter(value) {
	if (typeof value !== "object" || value === null) return false;
	return "in" in value && Array.isArray(value.in);
}
/**
* Check if a value is a startsWith filter
*/
function isStartsWithFilter(value) {
	if (typeof value !== "object" || value === null) return false;
	return "startsWith" in value && typeof value.startsWith === "string";
}
/**
* Get the set of indexed fields from index declarations
*/
function getIndexedFields(indexes) {
	const fields = /* @__PURE__ */ new Set();
	for (const index of indexes) if (Array.isArray(index)) for (const field of index) fields.add(field);
	else fields.add(index);
	return fields;
}
/**
* Validate that all fields in a where clause are indexed
*/
function validateWhereClause(where, indexedFields, pluginId, collection) {
	for (const field of Object.keys(where)) if (!indexedFields.has(field)) throw new StorageQueryError(`Cannot query on non-indexed field '${field}'.`, field, `Add '${field}' to storage.${collection}.indexes in plugin '${pluginId}' to enable this query.`);
}
/**
* Validate orderBy fields are indexed
*/
function validateOrderByClause(orderBy, indexedFields, pluginId, collection) {
	for (const field of Object.keys(orderBy)) if (!indexedFields.has(field)) throw new StorageQueryError(`Cannot order by non-indexed field '${field}'.`, field, `Add '${field}' to storage.${collection}.indexes in plugin '${pluginId}' to enable ordering by this field.`);
}
/**
* SQL expression for extracting JSON field.
*
* Validates the field name before interpolation to prevent SQL injection
* via crafted JSON path expressions.
*/
function jsonExtract(db, field) {
	validateJsonFieldName(field, "query field name");
	return jsonExtractExpr(db, "data", field);
}
/**
* Build a WHERE clause condition for a single field
*/
function buildCondition(db, field, value) {
	const extract = jsonExtract(db, field);
	if (value === null) return {
		sql: `${extract} IS NULL`,
		params: []
	};
	if (typeof value === "string" || typeof value === "number") return {
		sql: `${extract} = ?`,
		params: [value]
	};
	if (typeof value === "boolean") return {
		sql: `${extract} = ?`,
		params: [value]
	};
	if (isInFilter(value)) return {
		sql: `${extract} IN (${value.in.map(() => "?").join(", ")})`,
		params: value.in
	};
	if (isStartsWithFilter(value)) return {
		sql: `${extract} LIKE ?`,
		params: [`${value.startsWith}%`]
	};
	if (isRangeFilter(value)) {
		const conditions = [];
		const params = [];
		if (value.gt !== void 0) {
			conditions.push(`${extract} > ?`);
			params.push(value.gt);
		}
		if (value.gte !== void 0) {
			conditions.push(`${extract} >= ?`);
			params.push(value.gte);
		}
		if (value.lt !== void 0) {
			conditions.push(`${extract} < ?`);
			params.push(value.lt);
		}
		if (value.lte !== void 0) {
			conditions.push(`${extract} <= ?`);
			params.push(value.lte);
		}
		return {
			sql: conditions.join(" AND "),
			params
		};
	}
	throw new StorageQueryError(`Unknown filter type for field '${field}'`);
}
/**
* Build a complete WHERE clause from a WhereClause object
*/
function buildWhereClause(db, where) {
	const conditions = [];
	const params = [];
	for (const [field, value] of Object.entries(where)) {
		const condition = buildCondition(db, field, value);
		conditions.push(condition.sql);
		params.push(...condition.params);
	}
	if (conditions.length === 0) return {
		sql: "",
		params: []
	};
	return {
		sql: conditions.join(" AND "),
		params
	};
}

//#endregion
//#region src/database/repositories/plugin-storage.ts
/**
* Plugin Storage Repository
*
* Implements the StorageCollection interface for a specific plugin and collection.
*/
var PluginStorageRepository = class {
	indexedFields;
	constructor(db, pluginId, collection, indexes) {
		this.db = db;
		this.pluginId = pluginId;
		this.collection = collection;
		this.indexedFields = getIndexedFields(indexes);
	}
	/**
	* Get a document by ID
	*/
	async get(id) {
		const row = await this.db.selectFrom("_plugin_storage").select("data").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst();
		if (!row) return null;
		return JSON.parse(row.data);
	}
	/**
	* Store a document
	*/
	async put(id, data) {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const jsonData = JSON.stringify(data);
		await this.db.insertInto("_plugin_storage").values({
			plugin_id: this.pluginId,
			collection: this.collection,
			id,
			data: jsonData,
			created_at: now,
			updated_at: now
		}).onConflict((oc) => oc.columns([
			"plugin_id",
			"collection",
			"id"
		]).doUpdateSet({
			data: jsonData,
			updated_at: now
		})).execute();
	}
	/**
	* Delete a document
	*/
	async delete(id) {
		return ((await this.db.deleteFrom("_plugin_storage").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst()).numDeletedRows ?? 0) > 0;
	}
	/**
	* Check if a document exists
	*/
	async exists(id) {
		return !!await this.db.selectFrom("_plugin_storage").select("id").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "=", id).executeTakeFirst();
	}
	/**
	* Get multiple documents by ID
	*/
	async getMany(ids) {
		if (ids.length === 0) return /* @__PURE__ */ new Map();
		const rows = await this.db.selectFrom("_plugin_storage").select(["id", "data"]).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "in", ids).execute();
		const result = /* @__PURE__ */ new Map();
		for (const row of rows) result.set(row.id, JSON.parse(row.data));
		return result;
	}
	/**
	* Store multiple documents
	*/
	async putMany(items) {
		if (items.length === 0) return;
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await withTransaction(this.db, async (trx) => {
			for (const item of items) {
				const jsonData = JSON.stringify(item.data);
				await trx.insertInto("_plugin_storage").values({
					plugin_id: this.pluginId,
					collection: this.collection,
					id: item.id,
					data: jsonData,
					created_at: now,
					updated_at: now
				}).onConflict((oc) => oc.columns([
					"plugin_id",
					"collection",
					"id"
				]).doUpdateSet({
					data: jsonData,
					updated_at: now
				})).execute();
			}
		});
	}
	/**
	* Delete multiple documents
	*/
	async deleteMany(ids) {
		if (ids.length === 0) return 0;
		const result = await this.db.deleteFrom("_plugin_storage").where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection).where("id", "in", ids).executeTakeFirst();
		return Number(result.numDeletedRows ?? 0);
	}
	/**
	* Query documents with filters
	*/
	async query(options = {}) {
		const { where = {}, orderBy = {}, cursor } = options;
		const limit = Math.min(options.limit ?? 50, 100);
		validateWhereClause(where, this.indexedFields, this.pluginId, this.collection);
		if (Object.keys(orderBy).length > 0) validateOrderByClause(orderBy, this.indexedFields, this.pluginId, this.collection);
		let query = this.db.selectFrom("_plugin_storage").select([
			"id",
			"data",
			"created_at"
		]).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection);
		const whereResult = buildWhereClause(this.db, where);
		if (whereResult.sql) {
			const whereSqlParts = [];
			let paramIndex = 0;
			const sqlParts = whereResult.sql.split("?");
			for (let i = 0; i < sqlParts.length; i++) {
				if (i > 0) whereSqlParts.push(sql`${whereResult.params[paramIndex++]}`);
				if (sqlParts[i]) whereSqlParts.push(sql.raw(sqlParts[i]));
			}
			query = query.where(({ eb }) => eb(sql.join(whereSqlParts, sql.raw("")), "=", sql.raw("1")));
		}
		if (cursor) {
			const decoded = decodeCursor(cursor);
			query = query.where(({ eb }) => eb(sql`(created_at, id)`, ">", sql`(${decoded.orderValue}, ${decoded.id})`));
		}
		if (Object.keys(orderBy).length > 0) for (const [field, direction] of Object.entries(orderBy)) {
			const extract = jsonExtract(this.db, field);
			const orderExpr = direction === "desc" ? sql`${sql.raw(extract)} desc` : sql`${sql.raw(extract)} asc`;
			query = query.orderBy(orderExpr);
		}
		else query = query.orderBy("created_at", "asc").orderBy("id", "asc");
		query = query.limit(limit + 1);
		const rows = await query.execute();
		const hasMore = rows.length > limit;
		const items = rows.slice(0, limit).map((row) => ({
			id: row.id,
			data: JSON.parse(row.data)
		}));
		let nextCursor;
		if (hasMore) {
			const lastItem = rows[limit - 1];
			if (lastItem) nextCursor = encodeCursor(lastItem.created_at, lastItem.id);
		}
		return {
			items,
			cursor: nextCursor,
			hasMore
		};
	}
	/**
	* Count documents matching a filter
	*/
	async count(where) {
		if (where && Object.keys(where).length > 0) validateWhereClause(where, this.indexedFields, this.pluginId, this.collection);
		let query = this.db.selectFrom("_plugin_storage").select(sql`COUNT(*)`.as("count")).where("plugin_id", "=", this.pluginId).where("collection", "=", this.collection);
		if (where && Object.keys(where).length > 0) {
			const whereResult = buildWhereClause(this.db, where);
			if (whereResult.sql) {
				const whereSqlParts = [];
				let paramIndex = 0;
				const sqlParts = whereResult.sql.split("?");
				for (let i = 0; i < sqlParts.length; i++) {
					if (i > 0) whereSqlParts.push(sql`${whereResult.params[paramIndex++]}`);
					if (sqlParts[i]) whereSqlParts.push(sql.raw(sqlParts[i]));
				}
				query = query.where(({ eb }) => eb(sql.join(whereSqlParts, sql.raw("")), "=", sql.raw("1")));
			}
		}
		return (await query.executeTakeFirst())?.count ?? 0;
	}
};

//#endregion
//#region src/plugins/context.ts
/**
* Create KV accessor for a plugin
* All keys are automatically prefixed with the plugin ID
*/
function createKVAccess(optionsRepo, pluginId) {
	const prefix = `plugin:${pluginId}:`;
	return {
		async get(key) {
			return optionsRepo.get(`${prefix}${key}`);
		},
		async set(key, value) {
			await optionsRepo.set(`${prefix}${key}`, value);
		},
		async delete(key) {
			return optionsRepo.delete(`${prefix}${key}`);
		},
		async list(keyPrefix) {
			const fullPrefix = `${prefix}${keyPrefix ?? ""}`;
			const entriesMap = await optionsRepo.getByPrefix(fullPrefix);
			const result = [];
			for (const [fullKey, value] of entriesMap) result.push({
				key: fullKey.slice(prefix.length),
				value
			});
			return result;
		}
	};
}
/**
* Create storage collection accessor for a plugin
* Wraps PluginStorageRepository with the v2 interface (no async iterators)
*/
function createStorageCollection(db, pluginId, collectionName, indexes) {
	const repo = new PluginStorageRepository(db, pluginId, collectionName, indexes);
	return {
		get: (id) => repo.get(id),
		put: (id, data) => repo.put(id, data),
		delete: (id) => repo.delete(id),
		exists: (id) => repo.exists(id),
		getMany: (ids) => repo.getMany(ids),
		putMany: (items) => repo.putMany(items),
		deleteMany: (ids) => repo.deleteMany(ids),
		count: (where) => repo.count(where),
		async query(options) {
			const result = await repo.query({
				where: options?.where,
				orderBy: options?.orderBy,
				limit: options?.limit,
				cursor: options?.cursor
			});
			return {
				items: result.items,
				cursor: result.cursor,
				hasMore: result.hasMore
			};
		}
	};
}
/**
* Create storage accessor with all declared collections
*/
function createStorageAccess(db, pluginId, storageConfig) {
	const storage = {};
	for (const [collectionName, config] of Object.entries(storageConfig)) storage[collectionName] = createStorageCollection(db, pluginId, collectionName, [...config.indexes, ...config.uniqueIndexes ?? []]);
	return storage;
}
/**
* Extract `seo` from a plugin-supplied content write input and return both
* parts. Mutates nothing — returns a new field map without the `seo` key.
*/
function splitSeoFromInput(input) {
	const { seo, ...fields } = input;
	if (seo !== void 0 && (seo === null || typeof seo !== "object" || Array.isArray(seo))) throw new Error("content.seo must be an object");
	return {
		fields,
		seo
	};
}
/**
* Reject writing SEO to a collection that does not have it enabled.
* Matches the REST API behavior (VALIDATION_ERROR).
*/
async function assertSeoEnabled(seoRepo, collection, seo) {
	const hasSeo = await seoRepo.isEnabled(collection);
	if (seo !== void 0 && !hasSeo) throw new Error(`Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`);
	return hasSeo;
}
/**
* Create read-only content access
*/
function createContentAccess(db) {
	const contentRepo = new ContentRepository(db);
	const seoRepo = new SeoRepository(db);
	return {
		async get(collection, id) {
			const item = await contentRepo.findById(collection, id);
			if (!item) return null;
			const result = {
				id: item.id,
				type: item.type,
				slug: item.slug,
				status: item.status,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
				locale: item.locale,
				publishedAt: item.publishedAt
			};
			if (await seoRepo.isEnabled(collection)) result.seo = await seoRepo.get(collection, item.id);
			return result;
		},
		async list(collection, options) {
			let orderBy;
			if (options?.orderBy) {
				const first = Object.entries(options.orderBy)[0];
				if (first) orderBy = {
					field: first[0],
					direction: first[1]
				};
			}
			const result = await contentRepo.findMany(collection, {
				limit: options?.limit ?? 50,
				cursor: options?.cursor,
				orderBy,
				where: options?.where
			});
			const items = result.items.map((item) => ({
				id: item.id,
				type: item.type,
				slug: item.slug,
				status: item.status,
				data: item.data,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
				locale: item.locale,
				publishedAt: item.publishedAt
			}));
			if (items.length > 0 && await seoRepo.isEnabled(collection)) {
				const seoMap = await seoRepo.getMany(collection, items.map((i) => i.id));
				for (const item of items) {
					const seo = seoMap.get(item.id);
					if (seo) item.seo = seo;
				}
			}
			return {
				items,
				cursor: result.nextCursor,
				hasMore: !!result.nextCursor
			};
		}
	};
}
/**
* Create full content access with write operations.
*
* `create` and `update` accept a reserved `seo` key in their `data`
* argument. When present, it is routed to the core SEO panel
* (`_emdash_seo`) via `SeoRepository.upsert`, in the same transaction as
* the content write. The returned `ContentItem.seo` reflects the resulting
* SEO state for SEO-enabled collections.
*/
function createContentAccessWithWrite(db) {
	return {
		...createContentAccess(db),
		async create(collection, data) {
			const { fields, seo } = splitSeoFromInput(data);
			return withTransaction(db, async (trx) => {
				const trxContentRepo = new ContentRepository(trx);
				const trxSeoRepo = new SeoRepository(trx);
				const hasSeo = await assertSeoEnabled(trxSeoRepo, collection, seo);
				const item = await trxContentRepo.create({
					type: collection,
					data: fields
				});
				const result = {
					id: item.id,
					type: item.type,
					slug: item.slug,
					status: item.status,
					data: item.data,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
					locale: item.locale,
					publishedAt: item.publishedAt
				};
				if (hasSeo) result.seo = seo !== void 0 ? await trxSeoRepo.upsert(collection, item.id, seo) : await trxSeoRepo.get(collection, item.id);
				return result;
			});
		},
		async update(collection, id, data) {
			const { fields, seo } = splitSeoFromInput(data);
			return withTransaction(db, async (trx) => {
				const trxContentRepo = new ContentRepository(trx);
				const trxSeoRepo = new SeoRepository(trx);
				const hasSeo = await assertSeoEnabled(trxSeoRepo, collection, seo);
				const item = Object.keys(fields).length > 0 ? await trxContentRepo.update(collection, id, { data: fields }) : await (async () => {
					const existing = await trxContentRepo.findById(collection, id);
					if (!existing) throw new Error("Content not found");
					return existing;
				})();
				const result = {
					id: item.id,
					type: item.type,
					slug: item.slug,
					status: item.status,
					data: item.data,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
					locale: item.locale,
					publishedAt: item.publishedAt
				};
				if (hasSeo) result.seo = seo !== void 0 ? await trxSeoRepo.upsert(collection, item.id, seo) : await trxSeoRepo.get(collection, item.id);
				return result;
			});
		},
		async delete(collection, id) {
			return new ContentRepository(db).delete(collection, id);
		}
	};
}
/**
* Create read-only media access
*/
function createMediaAccess(db) {
	const mediaRepo = new MediaRepository(db);
	return {
		async get(id) {
			const item = await mediaRepo.findById(id);
			if (!item) return null;
			return {
				id: item.id,
				filename: item.filename,
				mimeType: item.mimeType,
				size: item.size,
				url: `/media/${item.id}/${item.filename}`,
				createdAt: item.createdAt
			};
		},
		async list(options) {
			const result = await mediaRepo.findMany({
				limit: options?.limit ?? 50,
				cursor: options?.cursor,
				mimeType: options?.mimeType
			});
			return {
				items: result.items.map((item) => ({
					id: item.id,
					filename: item.filename,
					mimeType: item.mimeType,
					size: item.size,
					url: `/media/${item.id}/${item.filename}`,
					createdAt: item.createdAt
				})),
				cursor: result.nextCursor,
				hasMore: !!result.nextCursor
			};
		}
	};
}
/**
* Create full media access with write operations.
* If storage is not provided, upload() will throw at call time.
*/
function createMediaAccessWithWrite(db, getUploadUrlFn, storage) {
	const mediaRepo = new MediaRepository(db);
	return {
		...createMediaAccess(db),
		getUploadUrl: getUploadUrlFn,
		async upload(filename, contentType, bytes) {
			if (!storage) throw new Error("Media upload() requires a storage backend. Configure storage in PluginContextFactoryOptions.");
			const keyPrefix = ulid();
			const basename = filename.split("/").pop() ?? filename;
			const dotIdx = basename.lastIndexOf(".");
			const storageKey = `${keyPrefix}${dotIdx > 0 ? basename.slice(dotIdx).toLowerCase() : ""}`;
			await storage.upload({
				key: storageKey,
				body: new Uint8Array(bytes),
				contentType
			});
			let media;
			try {
				media = await mediaRepo.create({
					filename: basename,
					mimeType: contentType,
					size: bytes.byteLength,
					storageKey,
					status: "ready"
				});
			} catch (error) {
				try {
					await storage.delete(storageKey);
				} catch {}
				throw error;
			}
			return {
				mediaId: media.id,
				storageKey,
				url: `/_emdash/api/media/file/${storageKey}`
			};
		},
		async delete(id) {
			const deleted = await mediaRepo.delete(id);
			if (deleted) invalidateSiteSettingsCache();
			return deleted;
		}
	};
}
/** Maximum number of redirects to follow in plugin HTTP access */
const MAX_PLUGIN_REDIRECTS = 5;
/**
* Check if a hostname matches any pattern in the allowed list.
* Patterns: "*" matches all, "*.example.com" matches subdomains AND bare "example.com",
* "api.example.com" matches exactly.
*/
function isHostAllowed(host, allowedHosts) {
	return allowedHosts.some((pattern) => {
		if (pattern === "*") return true;
		if (pattern.startsWith("*.")) {
			const suffix = pattern.slice(1);
			return host.endsWith(suffix) || host === pattern.slice(2);
		}
		return host === pattern;
	});
}
/**
* Create HTTP access with host validation.
*
* Uses redirect: "manual" to re-validate each redirect target against
* the allowedHosts list, preventing redirects to unauthorized hosts.
*/
function createHttpAccess(pluginId, allowedHosts) {
	return { async fetch(url, init) {
		if (allowedHosts.length === 0) throw new Error(`Plugin "${pluginId}" has no allowed hosts configured. Add hosts to the plugin's allowedHosts array to enable HTTP requests.`);
		let currentUrl = url;
		let currentInit = init;
		for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
			const hostname = new URL(currentUrl).hostname;
			if (!isHostAllowed(hostname, allowedHosts)) throw new Error(`Plugin "${pluginId}" is not allowed to fetch from host "${hostname}". Allowed hosts: ${allowedHosts.join(", ")}`);
			const response = await globalThis.fetch(currentUrl, {
				...currentInit,
				redirect: "manual"
			});
			if (response.status < 300 || response.status >= 400) return response;
			const location = response.headers.get("Location");
			if (!location) return response;
			const previousOrigin = new URL(currentUrl).origin;
			currentUrl = new URL(location, currentUrl).href;
			if (previousOrigin !== new URL(currentUrl).origin && currentInit) currentInit = stripCredentialHeaders(currentInit);
		}
		throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
	} };
}
/**
* Create unrestricted HTTP access (for plugins with network:fetch:any capability).
* No host validation, but applies SSRF protection on redirect targets to
* prevent plugins from being tricked into reaching internal services.
*/
function createUnrestrictedHttpAccess(pluginId) {
	return { async fetch(url, init) {
		let currentUrl = url;
		let currentInit = init;
		for (let i = 0; i <= MAX_PLUGIN_REDIRECTS; i++) {
			try {
				await resolveAndValidateExternalUrl(currentUrl);
			} catch (e) {
				const msg = e instanceof SsrfError ? e.message : "SSRF validation failed";
				throw new Error(`Plugin "${pluginId}": blocked fetch to "${new URL(currentUrl).hostname}": ${msg}`, { cause: e });
			}
			const response = await globalThis.fetch(currentUrl, {
				...currentInit,
				redirect: "manual"
			});
			if (response.status < 300 || response.status >= 400) return response;
			const location = response.headers.get("Location");
			if (!location) return response;
			const previousOrigin = new URL(currentUrl).origin;
			currentUrl = new URL(location, currentUrl).href;
			if (previousOrigin !== new URL(currentUrl).origin && currentInit) currentInit = stripCredentialHeaders(currentInit);
		}
		throw new Error(`Plugin "${pluginId}": too many redirects (max ${MAX_PLUGIN_REDIRECTS})`);
	} };
}
/**
* Create logger for a plugin
*/
function createLogAccess(pluginId) {
	const prefix = `[plugin:${pluginId}]`;
	return {
		debug(message, data) {
			if (data !== void 0) console.debug(prefix, message, data);
			else console.debug(prefix, message);
		},
		info(message, data) {
			if (data !== void 0) console.info(prefix, message, data);
			else console.info(prefix, message);
		},
		warn(message, data) {
			if (data !== void 0) console.warn(prefix, message, data);
			else console.warn(prefix, message);
		},
		error(message, data) {
			if (data !== void 0) console.error(prefix, message, data);
			else console.error(prefix, message);
		}
	};
}
const TRAILING_SLASH_RE = /\/$/;
/**
* Create site info from config and settings.
*
* Resolution order for URL:
* 1. options table (emdash:site_url)
* 2. Astro `site` config
* 3. fallback to empty string
*/
function createSiteInfo(options) {
	return {
		name: options.siteName ?? "",
		url: (options.siteUrl ?? "").replace(TRAILING_SLASH_RE, ""),
		locale: options.locale ?? "en"
	};
}
/**
* Create a URL helper that generates absolute URLs from relative paths.
* Validates that path starts with "/" and rejects protocol-relative paths ("//").
*/
function createUrlHelper(siteUrl) {
	const base = siteUrl.replace(TRAILING_SLASH_RE, "");
	return (path) => {
		if (!path.startsWith("/")) throw new Error(`URL path must start with "/", got: "${path}"`);
		if (path.startsWith("//")) throw new Error(`URL path must not be protocol-relative, got: "${path}"`);
		return `${base}${path}`;
	};
}
/**
* Convert a UserRepository user to the plugin-facing UserInfo shape.
* Strips sensitive fields (avatarUrl, emailVerified, data).
*/
function toUserInfo(user) {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		createdAt: user.createdAt
	};
}
/**
* Create read-only user access for plugins.
* Excludes sensitive fields (password hashes, sessions, passkeys, avatar URL, data).
*/
function createUserAccess(db) {
	const userRepo = new UserRepository(db);
	return {
		async get(id) {
			const user = await userRepo.findById(id);
			if (!user) return null;
			return toUserInfo(user);
		},
		async getByEmail(email) {
			const user = await userRepo.findByEmail(email);
			if (!user) return null;
			return toUserInfo(user);
		},
		async list(opts) {
			const result = await userRepo.findMany({
				role: opts?.role,
				cursor: opts?.cursor,
				limit: opts?.limit
			});
			return {
				items: result.items.map(toUserInfo),
				nextCursor: result.nextCursor
			};
		}
	};
}
/**
* Factory for creating plugin contexts
*/
var PluginContextFactory = class {
	optionsRepo;
	db;
	storage;
	getUploadUrl;
	site;
	urlHelper;
	cronReschedule;
	emailPipeline;
	constructor(options) {
		this.db = options.db;
		this.optionsRepo = new OptionsRepository(options.db);
		this.storage = options.storage;
		this.getUploadUrl = options.getUploadUrl;
		this.site = createSiteInfo(options.siteInfo ?? {});
		this.urlHelper = createUrlHelper(this.site.url);
		this.cronReschedule = options.cronReschedule;
		this.emailPipeline = options.emailPipeline;
	}
	/**
	* Create the unified plugin context
	*/
	createContext(plugin) {
		const capabilities = new Set(plugin.capabilities);
		const kv = createKVAccess(this.optionsRepo, plugin.id);
		const log = createLogAccess(plugin.id);
		const storage = createStorageAccess(this.db, plugin.id, plugin.storage);
		let content;
		if (capabilities.has("content:write")) content = createContentAccessWithWrite(this.db);
		else if (capabilities.has("content:read")) content = createContentAccess(this.db);
		let media;
		if (capabilities.has("media:write") && this.getUploadUrl) media = createMediaAccessWithWrite(this.db, this.getUploadUrl, this.storage);
		else if (capabilities.has("media:read")) media = createMediaAccess(this.db);
		let http;
		if (capabilities.has("network:request:unrestricted")) http = createUnrestrictedHttpAccess(plugin.id);
		else if (capabilities.has("network:request")) http = createHttpAccess(plugin.id, plugin.allowedHosts);
		let users;
		if (capabilities.has("users:read")) users = createUserAccess(this.db);
		let cron;
		if (this.cronReschedule) cron = new CronAccessImpl(this.db, plugin.id, this.cronReschedule);
		let email;
		if (capabilities.has("email:send") && this.emailPipeline?.isAvailable()) {
			const pipeline = this.emailPipeline;
			const pluginId = plugin.id;
			email = { send: (message) => pipeline.send(message, pluginId) };
		}
		return {
			plugin: {
				id: plugin.id,
				version: plugin.version
			},
			storage,
			kv,
			content,
			media,
			http,
			log,
			site: this.site,
			url: this.urlHelper,
			users,
			cron,
			email
		};
	}
};

//#region src/fields/image.ts
z.object({
	id: z.string(),
	src: z.string(),
	alt: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional()
});

//#endregion
//#region src/fields/portable-text.ts
/**
* Portable Text block schema
*/
z.object({
	_type: z.string(),
	_key: z.string()
}).passthrough();

//#endregion
//#region src/after.ts
const waitUntilReady = (async () => {
	try {
		return (await import('./wait-until_C0sBMZKz.mjs')).waitUntil ?? null;
	} catch {
		return null;
	}
})();
waitUntilReady.catch(() => {});
/**
* Schedule `fn` to run without blocking the response.
*
* Errors are caught and logged — a deferred task should never surface
* as an unhandled rejection because the response is long gone. Callers
* that care about errors should handle them inside `fn`.
*/
function after(fn) {
	const promise = Promise.resolve().then(fn).catch((error) => {
		console.error("[emdash] deferred task failed:", error);
	});
	waitUntilReady.then((waitUntil) => {
		if (waitUntil) waitUntil(promise);
		return null;
	});
}

//#endregion
//#region src/plugins/define-plugin.ts
/**
* definePlugin() Helper
*
* Native plugin authoring entry. Returns a fully-resolved
* `ResolvedPlugin` ready for the host integration to mount.
*
* Sandboxed plugins do NOT use this function. They default-export
* a bare `{ hooks?, routes? }` object with a `satisfies SandboxedPlugin`
* annotation from `emdash/plugin`. See the `emdash` changeset for the
* authoring shape.
*/
const SIMPLE_ID = /^[a-z0-9-]+$/;
const SCOPED_ID = /^@[a-z0-9-]+\/[a-z0-9-]+$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+/;
/**
* Define a native EmDash plugin.
*
* Native plugins ship as regular npm modules, get installed via
* `pnpm add` + an `astro.config.mjs` edit, and run in the host
* process. They have full access to the runtime — capabilities are
* still enforced by `PluginContextFactory`, but there is no isolation
* boundary.
*
* @example
* ```typescript
* import { definePlugin } from "emdash";
*
* export default definePlugin({
*   id: "my-plugin",
*   version: "1.0.0",
*   capabilities: ["content:read"],
*   hooks: {
*     "content:beforeSave": async (event, ctx) => {
*       ctx.log.info("Saving content", { collection: event.collection });
*       return event.content;
*     }
*   },
*   routes: {
*     "sync": {
*       handler: async (ctx) => {
*         return { status: "ok" };
*       }
*     }
*   }
* });
* ```
*
* Sandboxed-format plugins do not use `definePlugin`. They
* default-export a bare `{ hooks?, routes? }` object with a
* `satisfies SandboxedPlugin` annotation from `emdash/plugin`. Calling
* `definePlugin` with an object that has no `id` throws at runtime
* (the type system already rejects it at compile time — this check is
* for callers that bypass typechecking).
*/
function definePlugin(definition) {
	if (typeof definition.id !== "string" || definition.id.length === 0) throw new Error(`definePlugin() requires \`id\` (got ${typeof definition.id}). For native plugins, make sure your definition has both \`id\` and \`version\`. For sandboxed plugins, drop \`definePlugin()\` entirely and \`export default { hooks, routes } satisfies SandboxedPlugin\` from "emdash/plugin" — identity comes from \`emdash-plugin.jsonc\`.`);
	return defineNativePlugin(definition);
}
/**
* Internal: define a native-format plugin with full validation and normalization.
*/
function defineNativePlugin(definition) {
	const { id, version, capabilities = [], allowedHosts = [], hooks = {}, routes = {}, admin = {} } = definition;
	const storage = definition.storage ?? {};
	if (!SIMPLE_ID.test(id) && !SCOPED_ID.test(id)) throw new Error(`Invalid plugin id "${id}". Must be lowercase alphanumeric with dashes (e.g., "my-plugin" or "@scope/my-plugin").`);
	if (!SEMVER_PATTERN.test(version)) throw new Error(`Invalid plugin version "${version}". Must be semver format (e.g., "1.0.0").`);
	const validCapabilities = new Set([
		"network:request",
		"network:request:unrestricted",
		"content:read",
		"content:write",
		"media:read",
		"media:write",
		"users:read",
		"email:send",
		"hooks.email-transport:register",
		"hooks.email-events:register",
		"hooks.page-fragments:register",
		"network:fetch",
		"network:fetch:any",
		"read:content",
		"write:content",
		"read:media",
		"write:media",
		"read:users",
		"email:provide",
		"email:intercept",
		"page:inject"
	]);
	for (const cap of capabilities) if (!validCapabilities.has(cap)) throw new Error(`Invalid capability "${cap}" in plugin "${id}".`);
	const canonical = normalizeCapabilities(capabilities);
	const normalizedCapabilities = [...canonical];
	if (canonical.includes("content:write") && !canonical.includes("content:read")) normalizedCapabilities.push("content:read");
	if (canonical.includes("media:write") && !canonical.includes("media:read")) normalizedCapabilities.push("media:read");
	if (canonical.includes("network:request:unrestricted") && !canonical.includes("network:request")) normalizedCapabilities.push("network:request");
	return {
		id,
		version,
		capabilities: normalizedCapabilities,
		allowedHosts,
		storage,
		hooks: resolveHooks(hooks, id),
		routes,
		admin
	};
}
/**
* Resolve hooks to normalized format with defaults.
*
* PluginHooks and ResolvedPluginHooks share the same keys — each input value is
* `HookConfig<H> | H` and the output is `ResolvedHook<H>`.  TS can't narrow
* the handler type through a dynamic key, so we assert at the loop boundary.
*/
function resolveHooks(hooks, pluginId) {
	const resolved = {};
	for (const key of Object.keys(hooks)) {
		const hook = hooks[key];
		if (hook) resolved[key] = resolveHook(hook, pluginId);
	}
	return resolved;
}
/**
* Check if a hook value is a config object (has a `handler` property)
*/
function isHookConfig$1(hook) {
	return typeof hook === "object" && hook !== null && "handler" in hook;
}
/**
* Resolve a single hook to normalized format
*/
function resolveHook(hook, pluginId) {
	if (isHookConfig$1(hook)) {
		if (hook.exclusive !== void 0 && typeof hook.exclusive !== "boolean") throw new Error(`Invalid "exclusive" value in hook config for plugin "${pluginId}". Must be boolean.`);
		return {
			priority: hook.priority ?? 100,
			timeout: hook.timeout ?? 5e3,
			dependencies: hook.dependencies ?? [],
			errorPolicy: hook.errorPolicy ?? "abort",
			exclusive: hook.exclusive ?? false,
			handler: hook.handler,
			pluginId
		};
	}
	return {
		priority: 100,
		timeout: 5e3,
		dependencies: [],
		errorPolicy: "abort",
		exclusive: false,
		handler: hook,
		pluginId
	};
}

//#endregion
//#region src/plugins/hooks.ts
/**
* Plugin Hooks System v2
*
* Uses the unified PluginContext for all hooks.
* Manages lifecycle hooks with:
* - Deterministic ordering via priority + dependencies
* - Timeout enforcement
* - Error isolation
* - Observability
*
*/
/**
* Hook pipeline for executing hooks in order
*/
var HookPipeline = class HookPipeline {
	hooks = /* @__PURE__ */ new Map();
	pluginMap = /* @__PURE__ */ new Map();
	contextFactory = null;
	/** Stored so setContextFactory can merge incrementally. */
	contextFactoryOptions = {};
	/** Hook names where at least one handler declared exclusive: true */
	exclusiveHookNames = /* @__PURE__ */ new Set();
	/**
	* Selected provider plugin ID for each exclusive hook.
	* Set by the PluginManager after resolution.
	*/
	exclusiveSelections = /* @__PURE__ */ new Map();
	constructor(plugins, factoryOptions) {
		if (factoryOptions) {
			this.contextFactory = new PluginContextFactory(factoryOptions);
			this.contextFactoryOptions = { ...factoryOptions };
		}
		for (const plugin of plugins) this.pluginMap.set(plugin.id, plugin);
		this.registerPlugins(plugins);
	}
	/**
	* Set or update the context factory options.
	*
	* When called on a pipeline that already has a factory, the new options
	* are merged on top of the existing ones so that callers don't need to
	* repeat every field (e.g. adding `cronReschedule` without losing
	* `storage` / `getUploadUrl`).
	*/
	setContextFactory(options) {
		const merged = {
			...this.contextFactoryOptions,
			...options
		};
		this.contextFactory = new PluginContextFactory(merged);
		this.contextFactoryOptions = merged;
	}
	/**
	* Get context for a plugin
	*/
	getContext(pluginId) {
		const plugin = this.pluginMap.get(pluginId);
		if (!plugin) throw new Error(`Plugin "${pluginId}" not found`);
		if (!this.contextFactory) throw new Error("Context factory not initialized - call setContextFactory first");
		return this.contextFactory.createContext(plugin);
	}
	/**
	* Get typed hooks for a specific hook name.
	* The internal map stores ResolvedHook<unknown>, but we know each name
	* maps to a specific handler type via HookHandlerMap.
	*
	* Exclusive hooks that have a selected provider are filtered out — they
	* should only run via invokeExclusiveHook(), not in the regular pipeline.
	*/
	getTypedHooks(name) {
		const all = this.hooks.get(name) ?? [];
		if (this.exclusiveSelections.has(name)) return all.filter((h) => !h.exclusive);
		return all;
	}
	/**
	* Register all hooks from plugins.
	*
	* Registers each hook name individually to preserve type safety. The
	* internal map stores ResolvedHook<unknown> since it's keyed by string,
	* but getTypedHooks() restores the correct handler type on retrieval.
	*/
	registerPlugins(plugins) {
		for (const plugin of plugins) {
			this.registerPluginHook(plugin, "plugin:install");
			this.registerPluginHook(plugin, "plugin:activate");
			this.registerPluginHook(plugin, "plugin:deactivate");
			this.registerPluginHook(plugin, "plugin:uninstall");
			this.registerPluginHook(plugin, "content:beforeSave");
			this.registerPluginHook(plugin, "content:afterSave");
			this.registerPluginHook(plugin, "content:beforeDelete");
			this.registerPluginHook(plugin, "content:afterDelete");
			this.registerPluginHook(plugin, "content:afterPublish");
			this.registerPluginHook(plugin, "content:afterUnpublish");
			this.registerPluginHook(plugin, "media:beforeUpload");
			this.registerPluginHook(plugin, "media:afterUpload");
			this.registerPluginHook(plugin, "cron");
			this.registerPluginHook(plugin, "email:beforeSend");
			this.registerPluginHook(plugin, "email:deliver");
			this.registerPluginHook(plugin, "email:afterSend");
			this.registerPluginHook(plugin, "comment:beforeCreate");
			this.registerPluginHook(plugin, "comment:moderate");
			this.registerPluginHook(plugin, "comment:afterCreate");
			this.registerPluginHook(plugin, "comment:afterModerate");
			this.registerPluginHook(plugin, "page:metadata");
			this.registerPluginHook(plugin, "page:fragments");
		}
		for (const [hookName, hooks] of this.hooks) this.hooks.set(hookName, this.sortHooks(hooks));
	}
	/**
	* Maps hook names to the capability required to register them.
	*
	* Hooks not listed here have no capability requirement (e.g. lifecycle
	* hooks, cron). Any plugin declaring a listed hook without the required
	* capability will have that hook silently skipped at registration time.
	*/
	static HOOK_REQUIRED_CAPABILITY = new Map([
		["email:beforeSend", "hooks.email-events:register"],
		["email:afterSend", "hooks.email-events:register"],
		["email:deliver", "hooks.email-transport:register"],
		["content:beforeSave", "content:write"],
		["content:afterSave", "content:read"],
		["content:beforeDelete", "content:read"],
		["content:afterDelete", "content:read"],
		["content:afterPublish", "content:read"],
		["content:afterUnpublish", "content:read"],
		["media:beforeUpload", "media:write"],
		["media:afterUpload", "media:read"],
		["comment:beforeCreate", "users:read"],
		["comment:moderate", "users:read"],
		["comment:afterCreate", "users:read"],
		["comment:afterModerate", "users:read"],
		["page:fragments", "hooks.page-fragments:register"]
	]);
	/**
	* Register a single plugin's hook by name
	*/
	registerPluginHook(plugin, name) {
		const hook = plugin.hooks[name];
		if (!hook) return;
		const requiredCapability = HookPipeline.HOOK_REQUIRED_CAPABILITY.get(name);
		if (requiredCapability && !plugin.capabilities.includes(requiredCapability)) {
			console.warn(`[hooks] Plugin "${plugin.id}" declares ${name} hook without ${requiredCapability} capability — skipping`);
			return;
		}
		if (hook.exclusive) this.exclusiveHookNames.add(name);
		this.registerHook(name, hook);
	}
	/**
	* Register a single hook
	*/
	registerHook(name, hook) {
		const existing = this.hooks.get(name) || [];
		existing.push(hook);
		this.hooks.set(name, existing);
	}
	/**
	* Sort hooks by priority and dependencies
	*/
	sortHooks(hooks) {
		const sorted = [];
		const remaining = [...hooks];
		while (remaining.length > 0) {
			const ready = remaining.filter((hook) => hook.dependencies.every((dep) => sorted.some((s) => s.pluginId === dep)));
			if (ready.length === 0) {
				const pluginIds = remaining.map((h) => h.pluginId).join(", ");
				console.warn(`[hooks] Hook dependency cycle or missing dependency detected among plugins: ${pluginIds}. Falling back to priority order.`);
				remaining.sort((a, b) => a.priority - b.priority);
				sorted.push(...remaining);
				break;
			}
			ready.sort((a, b) => a.priority - b.priority);
			const next = ready[0];
			sorted.push(next);
			remaining.splice(remaining.indexOf(next), 1);
		}
		return sorted;
	}
	/**
	* Execute a hook with timeout
	*/
	async executeWithTimeout(fn, timeout) {
		let timer;
		const timeoutPromise = new Promise((_, reject) => timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`Hook timeout after ${timeout}ms`)), timeout));
		try {
			return await Promise.race([fn(), timeoutPromise]);
		} finally {
			clearTimeout(timer);
		}
	}
	/**
	* Run plugin:install hooks
	*/
	async runPluginInstall(pluginId) {
		return this.runLifecycleHook("plugin:install", pluginId);
	}
	/**
	* Run plugin:activate hooks
	*/
	async runPluginActivate(pluginId) {
		return this.runLifecycleHook("plugin:activate", pluginId);
	}
	/**
	* Run plugin:deactivate hooks
	*/
	async runPluginDeactivate(pluginId) {
		return this.runLifecycleHook("plugin:deactivate", pluginId);
	}
	/**
	* Run plugin:uninstall hooks
	*/
	async runPluginUninstall(pluginId, deleteData) {
		const hooks = this.getTypedHooks("plugin:uninstall");
		const results = [];
		const hook = hooks.find((h) => h.pluginId === pluginId);
		if (!hook) return results;
		const { handler } = hook;
		const event = { deleteData };
		const ctx = this.getContext(pluginId);
		const start = Date.now();
		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			results.push({
				success: true,
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		} catch (error) {
			results.push({
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		}
		return results;
	}
	async runLifecycleHook(hookName, pluginId) {
		const hooks = this.getTypedHooks(hookName);
		const results = [];
		const hook = hooks.find((h) => h.pluginId === pluginId);
		if (!hook) return results;
		const { handler } = hook;
		const event = {};
		const ctx = this.getContext(pluginId);
		const start = Date.now();
		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			results.push({
				success: true,
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		} catch (error) {
			results.push({
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId: hook.pluginId,
				duration: Date.now() - start
			});
		}
		return results;
	}
	/**
	* Run content:beforeSave hooks
	* Returns modified content from the pipeline
	*/
	async runContentBeforeSave(content, collection, isNew) {
		const hooks = this.getTypedHooks("content:beforeSave");
		const results = [];
		let currentContent = content;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content: currentContent,
				collection,
				isNew
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result !== void 0) currentContent = result;
				results.push({
					success: true,
					value: currentContent,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			content: currentContent,
			results
		};
	}
	/**
	* Run content:afterSave hooks
	*/
	async runContentAfterSave(content, collection, isNew) {
		const hooks = this.getTypedHooks("content:afterSave");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content,
				collection,
				isNew
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run content:beforeDelete hooks
	* Returns whether deletion is allowed
	*/
	async runContentBeforeDelete(id, collection) {
		const hooks = this.getTypedHooks("content:beforeDelete");
		const results = [];
		let allowed = true;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				id,
				collection,
				permanent: false
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result === false) allowed = false;
				results.push({
					success: true,
					value: result !== false,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			allowed,
			results
		};
	}
	/**
	* Run content:afterDelete hooks
	*/
	async runContentAfterDelete(id, collection, permanent) {
		const hooks = this.getTypedHooks("content:afterDelete");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				id,
				collection,
				permanent
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run content:afterPublish hooks (fire-and-forget).
	*/
	async runContentAfterPublish(content, collection) {
		const hooks = this.getTypedHooks("content:afterPublish");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content,
				collection
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run content:afterUnpublish hooks (fire-and-forget).
	*/
	async runContentAfterUnpublish(content, collection) {
		const hooks = this.getTypedHooks("content:afterUnpublish");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				content,
				collection
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Run media:beforeUpload hooks
	*/
	async runMediaBeforeUpload(file) {
		const hooks = this.getTypedHooks("media:beforeUpload");
		const results = [];
		let currentFile = file;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = { file: currentFile };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result !== void 0) currentFile = result;
				results.push({
					success: true,
					value: currentFile,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			file: currentFile,
			results
		};
	}
	/**
	* Run media:afterUpload hooks
	*/
	async runMediaAfterUpload(media) {
		const hooks = this.getTypedHooks("media:afterUpload");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = { media };
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return results;
	}
	/**
	* Invoke the cron hook for a specific plugin.
	*
	* Unlike other hooks which broadcast to all plugins, the cron hook is
	* dispatched only to the target plugin — the one that owns the task.
	*/
	async invokeCronHook(pluginId, event) {
		const hook = this.getTypedHooks("cron").find((h) => h.pluginId === pluginId);
		if (!hook) return {
			success: false,
			error: /* @__PURE__ */ new Error(`Plugin "${pluginId}" has no cron hook registered`),
			pluginId,
			duration: 0
		};
		const { handler } = hook;
		const ctx = this.getContext(pluginId);
		const start = Date.now();
		try {
			await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			return {
				success: true,
				pluginId,
				duration: Date.now() - start
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error : new Error(String(error)),
				pluginId,
				duration: Date.now() - start
			};
		}
	}
	/**
	* Run email:beforeSend hooks (middleware pipeline).
	*
	* Each handler receives the message and returns a modified message or
	* `false` to cancel delivery. The pipeline chains message transformations —
	* each handler receives the output of the previous one.
	*/
	async runEmailBeforeSend(message, source) {
		const hooks = this.getTypedHooks("email:beforeSend");
		const results = [];
		let currentMessage = message;
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				message: { ...currentMessage },
				source
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				if (result === false) {
					results.push({
						success: true,
						value: false,
						pluginId: hook.pluginId,
						duration: Date.now() - start
					});
					return {
						message: false,
						results
					};
				}
				if (result && typeof result === "object") currentMessage = result;
				results.push({
					success: true,
					value: currentMessage,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return {
			message: currentMessage,
			results
		};
	}
	/**
	* Run email:afterSend hooks (fire-and-forget).
	*
	* Errors are logged but don't propagate — they don't affect the caller.
	*/
	async runEmailAfterSend(message, source) {
		const hooks = this.getTypedHooks("email:afterSend");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const event = {
				message,
				source
			};
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
				results.push({
					success: true,
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			} catch (error) {
				console.error(`[email:afterSend] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
				results.push({
					success: false,
					error: error instanceof Error ? error : new Error(String(error)),
					pluginId: hook.pluginId,
					duration: Date.now() - start
				});
			}
		}
		return results;
	}
	/**
	* Run comment:beforeCreate hooks (middleware pipeline).
	*
	* Each handler receives the event and returns a modified event or
	* `false` to reject the comment. The pipeline chains transformations —
	* each handler receives the output of the previous one.
	*/
	async runCommentBeforeCreate(event) {
		const hooks = this.getTypedHooks("comment:beforeCreate");
		let currentEvent = event;
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			const start = Date.now();
			try {
				const result = await this.executeWithTimeout(() => handler({ ...currentEvent }, ctx), hook.timeout);
				if (result === false) return false;
				if (result && typeof result === "object") currentEvent = result;
			} catch (error) {
				console.error(`[comment:beforeCreate] Plugin "${hook.pluginId}" error (${Date.now() - start}ms):`, error instanceof Error ? error.message : error);
				if (hook.errorPolicy === "abort") throw error;
			}
		}
		return currentEvent;
	}
	/**
	* Run comment:afterCreate hooks (fire-and-forget).
	*
	* Errors are logged but don't propagate — they don't affect the caller.
	*/
	async runCommentAfterCreate(event) {
		const hooks = this.getTypedHooks("comment:afterCreate");
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			} catch (error) {
				console.error(`[comment:afterCreate] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
	}
	/**
	* Run comment:afterModerate hooks (fire-and-forget).
	*
	* Errors are logged but don't propagate — they don't affect the caller.
	*/
	async runCommentAfterModerate(event) {
		const hooks = this.getTypedHooks("comment:afterModerate");
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				await this.executeWithTimeout(() => handler(event, ctx), hook.timeout);
			} catch (error) {
				console.error(`[comment:afterModerate] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
	}
	/**
	* Run page:metadata hooks. Each handler returns contributions that are
	* merged by the metadata collector. Errors are logged but don't propagate.
	*/
	async runPageMetadata(event) {
		const hooks = this.getTypedHooks("page:metadata");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				const result = await this.executeWithTimeout(() => Promise.resolve(handler(event, ctx)), hook.timeout);
				if (result != null) {
					const contributions = Array.isArray(result) ? result : [result];
					results.push({
						pluginId: hook.pluginId,
						contributions
					});
				}
			} catch (error) {
				console.error(`[page:metadata] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
		return results;
	}
	/**
	* Run page:fragments hooks. Only trusted plugins should be registered
	* for this hook. Errors are logged but don't propagate.
	*/
	async runPageFragments(event) {
		const hooks = this.getTypedHooks("page:fragments");
		const results = [];
		for (const hook of hooks) {
			const { handler } = hook;
			const ctx = this.getContext(hook.pluginId);
			try {
				const result = await this.executeWithTimeout(() => Promise.resolve(handler(event, ctx)), hook.timeout);
				if (result != null) {
					const contributions = Array.isArray(result) ? result : [result];
					results.push({
						pluginId: hook.pluginId,
						contributions
					});
				}
			} catch (error) {
				console.error(`[page:fragments] Plugin "${hook.pluginId}" error:`, error instanceof Error ? error.message : error);
			}
		}
		return results;
	}
	/**
	* Check if any hooks are registered for a given name
	*/
	hasHooks(name) {
		const hooks = this.hooks.get(name);
		return hooks !== void 0 && hooks.length > 0;
	}
	/**
	* Get hook count for debugging
	*/
	getHookCount(name) {
		return this.hooks.get(name)?.length || 0;
	}
	/**
	* Get all registered hook names
	*/
	getRegisteredHooks() {
		return [...this.hooks.keys()];
	}
	/**
	* Returns hook names where at least one handler declared exclusive: true
	*/
	getRegisteredExclusiveHooks() {
		return [...this.exclusiveHookNames];
	}
	/**
	* Check if a hook is exclusive
	*/
	isExclusiveHook(name) {
		return this.exclusiveHookNames.has(name);
	}
	/**
	* Set the selected provider for an exclusive hook.
	* Called by PluginManager after resolution.
	*/
	setExclusiveSelection(hookName, pluginId) {
		this.exclusiveSelections.set(hookName, pluginId);
	}
	/**
	* Clear the selected provider for an exclusive hook.
	*/
	clearExclusiveSelection(hookName) {
		this.exclusiveSelections.delete(hookName);
	}
	/**
	* Get the selected provider for an exclusive hook (if any).
	*/
	getExclusiveSelection(hookName) {
		return this.exclusiveSelections.get(hookName);
	}
	/**
	* Get all plugins that registered a handler for a given exclusive hook.
	*/
	getExclusiveHookProviders(hookName) {
		return (this.hooks.get(hookName) ?? []).filter((h) => h.exclusive).map((h) => ({ pluginId: h.pluginId }));
	}
	/**
	* Get all plugins that registered a non-exclusive handler for a given
	* hook (e.g. `email:beforeSend`, `email:afterSend`), preserving priority
	* order. Partitions with `getExclusiveHookProviders()`, which returns
	* plugins whose registration is marked `exclusive: true`.
	*/
	getHookProviders(hookName) {
		return (this.hooks.get(hookName) ?? []).filter((h) => !h.exclusive).map((h) => ({ pluginId: h.pluginId }));
	}
	/**
	* Invoke an exclusive hook — dispatch only to the selected provider.
	* Returns null if no provider is selected or if the selected hook
	* is not found in the pipeline.
	*
	* This is a generic dispatch used by the email pipeline and other
	* exclusive hook consumers. The handler type is unknown — callers
	* must know the expected signature.
	*
	* Errors are isolated: a failing handler returns an error result
	* instead of propagating the exception to the caller.
	*/
	async invokeExclusiveHook(hookName, event) {
		const selectedPluginId = this.exclusiveSelections.get(hookName);
		if (!selectedPluginId) return null;
		const hook = (this.hooks.get(hookName) ?? []).find((h) => h.pluginId === selectedPluginId && h.exclusive);
		if (!hook) return null;
		const start = Date.now();
		try {
			const ctx = this.getContext(selectedPluginId);
			const handler = hook.handler;
			return {
				result: await this.executeWithTimeout(() => handler(event, ctx), hook.timeout),
				pluginId: selectedPluginId,
				duration: Date.now() - start
			};
		} catch (error) {
			return {
				result: void 0,
				pluginId: selectedPluginId,
				error: error instanceof Error ? error : new Error(String(error)),
				duration: Date.now() - start
			};
		}
	}
};
/**
* Create a hook pipeline from plugins
*/
function createHookPipeline(plugins, factoryOptions) {
	return new HookPipeline(plugins, factoryOptions);
}
/** Options table key prefix for exclusive hook selections */
const EXCLUSIVE_HOOK_KEY_PREFIX$1 = "emdash:exclusive_hook:";
/**
* Resolve exclusive hook selections.
*
* Shared algorithm used by both PluginManager and EmDashRuntime:
* 1. If a DB selection exists and that plugin is active → keep it.
* 2. If DB selection is stale (plugin inactive/gone) → clear it.
* 3. If no selection and only one active provider → auto-select it.
* 4. If preferred hints match an active provider → first match wins.
* 5. If multiple providers and no hint → leave unselected (admin must choose).
*/
async function resolveExclusiveHooks(opts) {
	const { pipeline, isActive, getOption, setOption, deleteOption, preferredHints } = opts;
	const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
	for (const hookName of exclusiveHookNames) {
		const providers = pipeline.getExclusiveHookProviders(hookName);
		const activeProviderIds = new Set(providers.map((p) => p.pluginId).filter((id) => isActive(id)));
		const key = `${EXCLUSIVE_HOOK_KEY_PREFIX$1}${hookName}`;
		let currentSelection = null;
		try {
			currentSelection = await getOption(key);
		} catch {
			continue;
		}
		if (currentSelection && activeProviderIds.has(currentSelection)) {
			pipeline.setExclusiveSelection(hookName, currentSelection);
			continue;
		}
		if (currentSelection) try {
			await deleteOption(key);
		} catch {}
		if (activeProviderIds.size === 1) {
			const [onlyProvider] = activeProviderIds;
			try {
				await setOption(key, onlyProvider);
			} catch {}
			pipeline.setExclusiveSelection(hookName, onlyProvider);
			continue;
		}
		if (preferredHints) {
			let found = false;
			for (const [pluginId, hooks] of preferredHints) if (hooks.includes(hookName) && activeProviderIds.has(pluginId)) {
				try {
					await setOption(key, pluginId);
				} catch {}
				pipeline.setExclusiveSelection(hookName, pluginId);
				found = true;
				break;
			}
			if (found) continue;
		}
		pipeline.clearExclusiveSelection(hookName);
	}
}

//#endregion
//#region src/plugins/email.ts
/**
* Email Pipeline
*
* Orchestrates the three-stage email pipeline:
* 1. email:beforeSend hooks (middleware — transform, validate, cancel)
* 2. email:deliver hook (exclusive — exactly one provider delivers)
* 3. email:afterSend hooks (logging, analytics, fire-and-forget)
*
* Security features:
* - Recursion guard prevents re-entrant sends (e.g. plugin calling ctx.email.send from a hook)
* - System emails (source="system") bypass email:beforeSend and email:afterSend hooks entirely
*   to protect auth tokens from exfiltration by plugin hooks
*
*/
/** Hook name for the exclusive email delivery hook */
const EMAIL_DELIVER_HOOK = "email:deliver";
/** Source value used for auth emails (magic links, invites, password resets) */
const SYSTEM_SOURCE = "system";
/**
* Error thrown when ctx.email.send() is called but no provider is configured.
*/
var EmailNotConfiguredError = class extends Error {
	constructor() {
		super("No email provider is configured. Install and activate an email provider plugin, then select it in Settings > Email.");
		this.name = "EmailNotConfiguredError";
	}
};
/**
* Error thrown when a recursive email send is detected.
*/
var EmailRecursionError = class extends Error {
	constructor() {
		super("Recursive email send detected. A plugin hook attempted to send an email from within the email pipeline, which would cause infinite recursion.");
		this.name = "EmailRecursionError";
	}
};
/**
* Recursion guard using AsyncLocalStorage.
*
* EmailPipeline is a singleton (worker-lifetime cached via EmDashRuntime).
* Instance state like `sendDepth` would false-positive under concurrent
* requests because two unrelated sends would increment the same counter.
* ALS scopes the guard to the current async execution context, so concurrent
* requests each get their own independent recursion tracking.
*/
const emailSendALS = new AsyncLocalStorage();
/**
* EmailPipeline orchestrates email delivery through the plugin hook system.
*
* The pipeline runs in three stages:
* 1. email:beforeSend — middleware hooks that can transform or cancel messages
* 2. email:deliver — exclusive hook dispatching to the selected provider
* 3. email:afterSend — fire-and-forget hooks for logging/analytics
*/
var EmailPipeline = class {
	pipeline;
	constructor(pipeline) {
		this.pipeline = pipeline;
	}
	/**
	* Replace the underlying hook pipeline.
	*
	* Called by the runtime when rebuilding the hook pipeline after a
	* plugin is enabled or disabled, so the email pipeline dispatches
	* to the current set of active hooks.
	*/
	setPipeline(pipeline) {
		this.pipeline = pipeline;
	}
	/**
	* Send an email through the full pipeline.
	*
	* @param message - The email to send
	* @param source - Where the email originated ("system" for auth, plugin ID for plugins)
	* @throws EmailNotConfiguredError if no provider is selected
	* @throws EmailRecursionError if called re-entrantly from within a hook
	* @throws Error if the provider handler throws
	*/
	async send(message, source) {
		const store = emailSendALS.getStore();
		if (store && store.depth > 0) throw new EmailRecursionError();
		const run = () => this.sendInner(message, source);
		if (store) {
			store.depth++;
			try {
				await run();
			} finally {
				store.depth--;
			}
		} else await emailSendALS.run({ depth: 1 }, run);
	}
	/**
	* Inner send implementation, separated from the recursion guard.
	*/
	async sendInner(message, source) {
		if (!message || typeof message !== "object") throw new Error("Invalid email message: message must be an object");
		if (!message.to || typeof message.to !== "string") throw new Error("Invalid email message: 'to' is required and must be a string");
		if (!message.subject || typeof message.subject !== "string") throw new Error("Invalid email message: 'subject' is required and must be a string");
		if (!message.text || typeof message.text !== "string") throw new Error("Invalid email message: 'text' is required and must be a string");
		const isSystemEmail = source === SYSTEM_SOURCE;
		let finalMessage;
		if (isSystemEmail) finalMessage = message;
		else {
			const beforeResult = await this.pipeline.runEmailBeforeSend(message, source);
			if (beforeResult.message === false) {
				const cancelledBy = beforeResult.results.find((r) => r.value === false)?.pluginId ?? "unknown";
				console.info(`[email] Email to "${message.to}" cancelled by plugin "${cancelledBy}"`);
				return;
			}
			finalMessage = beforeResult.message;
		}
		const deliverEvent = {
			message: finalMessage,
			source
		};
		const deliverResult = await this.pipeline.invokeExclusiveHook(EMAIL_DELIVER_HOOK, deliverEvent);
		if (!deliverResult) throw new EmailNotConfiguredError();
		if (deliverResult.error) throw deliverResult.error;
		if (!isSystemEmail) this.pipeline.runEmailAfterSend(finalMessage, source).catch((err) => console.error("[email] afterSend pipeline error:", err instanceof Error ? err.message : err));
	}
	/**
	* Check if an email provider is configured and available.
	*
	* Returns true if an email:deliver provider is selected in the exclusive
	* hook system. Plugins and auth code use this to decide whether to show
	* "send invite" vs "copy invite link" UI.
	*/
	isAvailable() {
		return this.pipeline.getExclusiveSelection(EMAIL_DELIVER_HOOK) !== void 0;
	}
};

//#endregion
//#region src/plugins/routes.ts
/**
* Plugin Routes v2
*
* Handles plugin API route invocation with:
* - Input validation via Zod schemas
* - Route context creation
* - Error handling
*
*/
/**
* Route handler for a plugin
*/
var PluginRouteHandler = class {
	contextFactory;
	plugin;
	trustedProxyHeaders;
	constructor(plugin, factoryOptions) {
		this.plugin = plugin;
		this.contextFactory = new PluginContextFactory(factoryOptions);
		this.trustedProxyHeaders = factoryOptions.trustedProxyHeaders ?? [];
	}
	/**
	* Invoke a route by name
	*/
	async invoke(routeName, options) {
		const route = this.plugin.routes[routeName];
		if (!route) return {
			success: false,
			error: {
				code: "ROUTE_NOT_FOUND",
				message: `Route "${routeName}" not found in plugin "${this.plugin.id}"`
			},
			status: 404
		};
		let validatedInput;
		if (route.input) {
			const parseResult = route.input.safeParse(options.body);
			if (!parseResult.success) return {
				success: false,
				error: {
					code: "VALIDATION_ERROR",
					message: "Invalid request body",
					details: parseResult.error.format()
				},
				status: 400
			};
			validatedInput = parseResult.data;
		} else validatedInput = options.body;
		const routeContext = {
			...this.contextFactory.createContext(this.plugin),
			input: validatedInput,
			request: options.request,
			requestMeta: extractRequestMeta(options.request, this.trustedProxyHeaders)
		};
		try {
			return {
				success: true,
				data: await route.handler(routeContext),
				status: 200
			};
		} catch (error) {
			if (error instanceof PluginRouteError) return {
				success: false,
				error: {
					code: error.code,
					message: error.message,
					details: error.details
				},
				status: error.status
			};
			console.error(`[plugin:${this.plugin.id}] Route handler failed:`, error);
			return {
				success: false,
				error: {
					code: "INTERNAL_ERROR",
					message: "An internal error occurred"
				},
				status: 500
			};
		}
	}
	/**
	* Get all route names
	*/
	getRouteNames() {
		return Object.keys(this.plugin.routes);
	}
	/**
	* Check if a route exists
	*/
	hasRoute(name) {
		return name in this.plugin.routes;
	}
	/**
	* Get route metadata without invoking the handler.
	* Returns null if the route doesn't exist.
	*/
	getRouteMeta(name) {
		const route = this.plugin.routes[name];
		if (!route) return null;
		return { public: route.public === true };
	}
};
/**
* Error class for plugin routes
* Allows plugins to return structured errors with specific HTTP status codes
*/
var PluginRouteError = class PluginRouteError extends Error {
	constructor(code, message, status = 400, details) {
		super(message);
		this.code = code;
		this.status = status;
		this.details = details;
		this.name = "PluginRouteError";
	}
	/**
	* Create a bad request error (400)
	*/
	static badRequest(message, details) {
		return new PluginRouteError("BAD_REQUEST", message, 400, details);
	}
	/**
	* Create an unauthorized error (401)
	*/
	static unauthorized(message = "Unauthorized") {
		return new PluginRouteError("UNAUTHORIZED", message, 401);
	}
	/**
	* Create a forbidden error (403)
	*/
	static forbidden(message = "Forbidden") {
		return new PluginRouteError("FORBIDDEN", message, 403);
	}
	/**
	* Create a not found error (404)
	*/
	static notFound(message = "Not found") {
		return new PluginRouteError("NOT_FOUND", message, 404);
	}
	/**
	* Create a conflict error (409)
	*/
	static conflict(message, details) {
		return new PluginRouteError("CONFLICT", message, 409, details);
	}
	/**
	* Create an internal error (500)
	*/
	static internal(message = "Internal error") {
		return new PluginRouteError("INTERNAL_ERROR", message, 500);
	}
};
/**
* Registry for all plugin route handlers
*/
var PluginRouteRegistry = class {
	handlers = /* @__PURE__ */ new Map();
	constructor(factoryOptions) {
		this.factoryOptions = factoryOptions;
	}
	/**
	* Register a plugin's routes
	*/
	register(plugin) {
		const handler = new PluginRouteHandler(plugin, this.factoryOptions);
		this.handlers.set(plugin.id, handler);
	}
	/**
	* Unregister a plugin's routes
	*/
	unregister(pluginId) {
		this.handlers.delete(pluginId);
	}
	/**
	* Invoke a plugin route
	*/
	async invoke(pluginId, routeName, options) {
		const handler = this.handlers.get(pluginId);
		if (!handler) return {
			success: false,
			error: {
				code: "PLUGIN_NOT_FOUND",
				message: `Plugin "${pluginId}" not found`
			},
			status: 404
		};
		return handler.invoke(routeName, options);
	}
	/**
	* Get all registered plugin IDs
	*/
	getPluginIds() {
		return [...this.handlers.keys()];
	}
	/**
	* Get routes for a plugin
	*/
	getRoutes(pluginId) {
		return this.handlers.get(pluginId)?.getRouteNames() ?? [];
	}
	/**
	* Get route metadata for a specific plugin route.
	* Returns null if the plugin or route doesn't exist.
	*/
	getRouteMeta(pluginId, routeName) {
		const handler = this.handlers.get(pluginId);
		if (!handler) return null;
		return handler.getRouteMeta(routeName);
	}
};

//#endregion
//#region src/plugins/sandbox/noop.ts
/**
* Error thrown when attempting to use sandboxing on an unsupported platform.
*/
var SandboxNotAvailableError = class extends Error {
	constructor() {
		super("Plugin sandboxing is not available. Configure a sandbox runner: use @emdash-cms/cloudflare/sandbox on Cloudflare, or @emdash-cms/sandbox-workerd/sandbox on Node.js (requires workerd). Without sandboxing, use trusted plugins (from config) instead.");
		this.name = "SandboxNotAvailableError";
	}
};
/**
* No-op sandbox runner for platforms without isolation support.
*
* - `isAvailable()` returns false
* - `load()` throws SandboxNotAvailableError
* - `terminateAll()` is a no-op
*
* This is the default runner when no platform adapter is configured.
*/
var NoopSandboxRunner = class {
	/**
	* Always returns false - sandboxing is not available.
	*/
	isAvailable() {
		return false;
	}
	/**
	* Always returns false - no sandbox runtime to be healthy.
	*/
	isHealthy() {
		return false;
	}
	/**
	* Always throws - can't load sandboxed plugins without isolation.
	*/
	async load(_manifest, _code) {
		throw new SandboxNotAvailableError();
	}
	/**
	* No-op - sandboxing not available, email callback is irrelevant.
	*/
	setEmailSend() {}
	/**
	* No-op - nothing to terminate.
	*/
	async terminateAll() {}
};
/**
* Create a no-op sandbox runner.
* This is used as the default when no platform adapter is configured.
*/
function createNoopSandboxRunner(_options) {
	return new NoopSandboxRunner();
}

//#region src/plugins/adapt-sandbox-entry.ts
/**
* Default hook configuration values
*/
const DEFAULT_PRIORITY = 100;
const DEFAULT_TIMEOUT = 5e3;
const DEFAULT_ERROR_POLICY = "abort";
/**
* Check if a hook entry is the config form (has a `handler` property).
*/
function isHookConfig(entry) {
	return typeof entry === "object" && entry !== null && "handler" in entry;
}
/**
* Resolve a single hook entry to a ResolvedHook.
*
* Sandboxed-format hooks use the standard two-arg convention:
*   handler(event, ctx)
*
* The HookPipeline dispatch methods also call handlers with (event, ctx),
* so the handler is compatible as-is — we just normalise the
* surrounding config (priority, timeout, etc.) to its defaults.
*/
function resolveSandboxedHook(entry, pluginId) {
	if (isHookConfig(entry)) return {
		priority: entry.priority ?? DEFAULT_PRIORITY,
		timeout: entry.timeout ?? DEFAULT_TIMEOUT,
		dependencies: entry.dependencies ?? [],
		errorPolicy: entry.errorPolicy ?? DEFAULT_ERROR_POLICY,
		exclusive: entry.exclusive ?? false,
		handler: entry.handler,
		pluginId
	};
	return {
		priority: DEFAULT_PRIORITY,
		timeout: DEFAULT_TIMEOUT,
		dependencies: [],
		errorPolicy: DEFAULT_ERROR_POLICY,
		exclusive: false,
		handler: entry,
		pluginId
	};
}
/**
* Normalise a `RouteEntry` (bare handler or `{ handler, public?, input? }`
* config) to the config form. The `input` schema is intentionally typed
* `unknown` in `RouteEntry` — sandboxed plugins describe it loosely
* because the strict `z.ZodType<TInput>` constraint of the runtime's
* `PluginRoute` only narrows once the route is wired into the router.
* The wider type flows through to the runtime which validates at
* invocation time.
*/
function normalizeRouteEntry(entry) {
	if (typeof entry === "function") return { handler: entry };
	return {
		handler: entry.handler,
		public: entry.public,
		input: entry.input
	};
}
const VALID_CAPABILITIES_SET = new Set(PLUGIN_CAPABILITIES);
const VALID_HOOK_NAMES_SET = new Set(HOOK_NAMES);
/**
* Adapt a sandboxed plugin's default export into a ResolvedPlugin.
*
* This is the in-process side of sandboxed-format plugins: it takes
* the `{ hooks, routes }` default export of a sandboxed plugin and
* produces a `ResolvedPlugin` that enters the HookPipeline alongside
* native plugins. The descriptor supplies identity (id, version) and
* the trust contract (capabilities, allowedHosts, storage); the
* definition supplies behaviour.
*
* @param definition - The plugin's default export (matching `SandboxedPlugin` from `emdash/plugin`).
* @param descriptor - The plugin descriptor with id, version, capabilities, etc.
* @returns A ResolvedPlugin compatible with HookPipeline.
*/
function adaptSandboxEntry(definition, descriptor) {
	const pluginId = descriptor.id;
	const version = descriptor.version;
	if (typeof definition !== "object" || definition === null || Array.isArray(definition)) throw new Error(`Plugin "${pluginId}" default export must be an object with \`hooks\` and/or \`routes\` (got ${Array.isArray(definition) ? "array" : typeof definition}). Did you forget \`export default {...} satisfies SandboxedPlugin\`?`);
	const resolvedHooks = {};
	if (definition.hooks) {
		const hookMap = definition.hooks;
		for (const [hookName, entry] of Object.entries(hookMap)) {
			if (!VALID_HOOK_NAMES_SET.has(hookName)) throw new Error(`Plugin "${pluginId}" declares unknown hook "${hookName}". Valid hooks: ${[...VALID_HOOK_NAMES_SET].join(", ")}`);
			resolvedHooks[hookName] = resolveSandboxedHook(entry, pluginId);
		}
	}
	const resolvedRoutes = {};
	if (definition.routes) for (const [routeName, rawEntry] of Object.entries(definition.routes)) {
		const { handler, public: publicFlag, input: inputSchema } = normalizeRouteEntry(rawEntry);
		resolvedRoutes[routeName] = {
			input: inputSchema,
			public: publicFlag,
			handler: async (ctx) => {
				const headers = {};
				ctx.request.headers.forEach((value, name) => {
					headers[name] = value;
				});
				const requestShape = {
					url: ctx.request.url,
					method: ctx.request.method,
					headers
				};
				const routeCtx = {
					input: ctx.input,
					request: requestShape,
					requestMeta: ctx.requestMeta
				};
				const { input: _, request: __, requestMeta: ___, ...pluginCtx } = ctx;
				return handler(routeCtx, pluginCtx);
			}
		};
	}
	const rawCapabilities = descriptor.capabilities ?? [];
	for (const cap of rawCapabilities) if (!VALID_CAPABILITIES_SET.has(cap)) throw new Error(`Invalid capability "${cap}" in plugin "${pluginId}". Valid capabilities: ${[...VALID_CAPABILITIES_SET].join(", ")}`);
	const capabilities = normalizeCapabilities(rawCapabilities);
	const allowedHosts = descriptor.allowedHosts ?? [];
	if (capabilities.includes("content:write") && !capabilities.includes("content:read")) capabilities.push("content:read");
	if (capabilities.includes("media:write") && !capabilities.includes("media:read")) capabilities.push("media:read");
	if (capabilities.includes("network:request:unrestricted") && !capabilities.includes("network:request")) capabilities.push("network:request");
	const rawStorage = descriptor.storage ?? {};
	const storage = {};
	for (const [name, config] of Object.entries(rawStorage)) storage[name] = {
		indexes: config.indexes ?? [],
		uniqueIndexes: config.uniqueIndexes
	};
	const admin = {};
	if (descriptor.adminPages) admin.pages = descriptor.adminPages;
	if (descriptor.adminWidgets) admin.widgets = descriptor.adminWidgets;
	return {
		id: pluginId,
		version,
		capabilities,
		allowedHosts,
		storage,
		hooks: resolvedHooks,
		routes: resolvedRoutes,
		admin
	};
}

const adaptSandboxEntry$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	adaptSandboxEntry
}, Symbol.toStringTag, { value: 'Module' }));

export { EmailPipeline as E, PluginRouteRegistry as P, createHookPipeline as a, after as b, createNoopSandboxRunner as c, definePlugin as d, adaptSandboxEntry$1 as e, resolveExclusiveHooks as r };
