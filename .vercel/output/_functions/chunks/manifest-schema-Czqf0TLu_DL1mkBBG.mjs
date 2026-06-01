import { n as chunks, t as SQL_BATCH_SIZE } from './chunks-BkfVdD-3_DFCxAf1E.mjs';
import { sql } from 'kysely';
import { z } from 'zod';

//#region src/database/repositories/seo.ts
/** Default SEO values for content without an explicit SEO row */
const SEO_DEFAULTS = {
	title: null,
	description: null,
	image: null,
	canonical: null,
	noIndex: false
};
/**
* Returns true if the input has at least one explicitly-set SEO field.
* Used to skip no-op upserts when callers pass `{ seo: {} }`.
*/
function hasAnyField(input) {
	return input.title !== void 0 || input.description !== void 0 || input.image !== void 0 || input.canonical !== void 0 || input.noIndex !== void 0;
}
/**
* Repository for SEO metadata stored in `_emdash_seo`.
*
* SEO data lives in a separate table keyed by (collection, content_id).
* Only collections with `has_seo = 1` should use this — callers are
* responsible for checking the flag before reading/writing.
*/
var SeoRepository = class {
	constructor(db) {
		this.db = db;
	}
	/**
	* Check whether a collection has SEO enabled (`has_seo = 1`).
	* Returns `false` if the collection does not exist.
	*/
	async isEnabled(collection) {
		return (await this.db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
	}
	/**
	* Get SEO data for a content item. Returns null defaults if no row exists.
	*/
	async get(collection, contentId) {
		const row = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "=", contentId).executeTakeFirst();
		if (!row) return { ...SEO_DEFAULTS };
		return {
			title: row.seo_title ?? null,
			description: row.seo_description ?? null,
			image: row.seo_image ?? null,
			canonical: row.seo_canonical ?? null,
			noIndex: row.seo_no_index === 1
		};
	}
	/**
	* Get SEO data for multiple content items.
	* Returns a Map keyed by content_id. Items without SEO rows get defaults.
	*
	* Chunks the `content_id IN (…)` clause so the total bound-parameter count
	* per statement (ids + the `collection = ?` filter) stays within Cloudflare
	* D1's 100-variable limit regardless of how many content items are passed.
	*/
	async getMany(collection, contentIds) {
		const result = /* @__PURE__ */ new Map();
		if (contentIds.length === 0) return result;
		for (const id of contentIds) result.set(id, { ...SEO_DEFAULTS });
		const uniqueContentIds = [...new Set(contentIds)];
		for (const chunk of chunks(uniqueContentIds, SQL_BATCH_SIZE)) {
			const rows = await this.db.selectFrom("_emdash_seo").selectAll().where("collection", "=", collection).where("content_id", "in", chunk).execute();
			for (const row of rows) result.set(row.content_id, {
				title: row.seo_title ?? null,
				description: row.seo_description ?? null,
				image: row.seo_image ?? null,
				canonical: row.seo_canonical ?? null,
				noIndex: row.seo_no_index === 1
			});
		}
		return result;
	}
	/**
	* Upsert SEO data for a content item using INSERT ON CONFLICT DO UPDATE
	* for atomicity. Skips no-op writes when input has no fields set.
	*/
	async upsert(collection, contentId, input) {
		if (!hasAnyField(input)) return this.get(collection, contentId);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		await sql`
			INSERT INTO _emdash_seo (
				collection, content_id,
				seo_title, seo_description, seo_image, seo_canonical, seo_no_index,
				created_at, updated_at
			) VALUES (
				${collection}, ${contentId},
				${input.title ?? null}, ${input.description ?? null},
				${input.image ?? null}, ${input.canonical ?? null},
				${input.noIndex ? 1 : 0},
				${now}, ${now}
			)
			ON CONFLICT (collection, content_id) DO UPDATE SET
				seo_title = ${input.title !== void 0 ? sql`${input.title}` : sql`_emdash_seo.seo_title`},
				seo_description = ${input.description !== void 0 ? sql`${input.description}` : sql`_emdash_seo.seo_description`},
				seo_image = ${input.image !== void 0 ? sql`${input.image}` : sql`_emdash_seo.seo_image`},
				seo_canonical = ${input.canonical !== void 0 ? sql`${input.canonical}` : sql`_emdash_seo.seo_canonical`},
				seo_no_index = ${input.noIndex !== void 0 ? sql`${input.noIndex ? 1 : 0}` : sql`_emdash_seo.seo_no_index`},
				updated_at = ${now}
		`.execute(this.db);
		return this.get(collection, contentId);
	}
	/**
	* Delete SEO data for a content item.
	*/
	async delete(collection, contentId) {
		await this.db.deleteFrom("_emdash_seo").where("collection", "=", collection).where("content_id", "=", contentId).execute();
	}
	/**
	* Copy SEO data from one content item to another.
	* Used by duplicate. Clears canonical (it pointed to the original).
	*/
	async copyForDuplicate(collection, sourceId, targetId) {
		const source = await this.get(collection, sourceId);
		if (source.title !== null || source.description !== null || source.image !== null || source.noIndex) await this.upsert(collection, targetId, {
			title: source.title,
			description: source.description,
			image: source.image,
			canonical: null,
			noIndex: source.noIndex
		});
	}
};

//#region src/plugins/manifest-schema.ts
/**
* Zod schema for PluginManifest validation
*
* Used to validate manifest.json from plugin bundles at every parse site:
* - Client-side download (marketplace.ts extractBundle)
* - R2 load (api/handlers/marketplace.ts loadBundleFromR2)
* - CLI publish preview (cli/commands/publish.ts readManifestFromTarball)
* - Marketplace ingest extends this with publishing-specific fields
*/
/**
* Current capability names — the ones authors should use going forward.
* See `PluginCapability` in `types.ts` for documentation of each.
*/
const CURRENT_PLUGIN_CAPABILITIES = [
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
	"hooks.page-fragments:register"
];
/**
* Legacy capability names accepted during the deprecation window.
* Normalized to current names via `normalizeCapability()` in types.ts
* before reaching the runtime. Plugin authors are warned at bundle/validate
* and hard-failed at publish.
*/
const DEPRECATED_PLUGIN_CAPABILITIES = [
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
];
/**
* Full set of accepted capability strings — current + deprecated.
*
* The manifest schema accepts both during the transition. The runtime only
* ever sees current names because `normalizeCapability()` rewrites legacy
* names at every external boundary (definePlugin, adaptSandboxEntry).
*/
const PLUGIN_CAPABILITIES = [...CURRENT_PLUGIN_CAPABILITIES, ...DEPRECATED_PLUGIN_CAPABILITIES];
/** Must stay in sync with FieldType in schema/types.ts */
const FIELD_TYPES = [
	"string",
	"text",
	"number",
	"integer",
	"boolean",
	"datetime",
	"select",
	"multiSelect",
	"portableText",
	"image",
	"file",
	"reference",
	"json",
	"slug",
	"repeater"
];
const HOOK_NAMES = [
	"plugin:install",
	"plugin:activate",
	"plugin:deactivate",
	"plugin:uninstall",
	"content:beforeSave",
	"content:afterSave",
	"content:beforeDelete",
	"content:afterDelete",
	"content:afterPublish",
	"content:afterUnpublish",
	"media:beforeUpload",
	"media:afterUpload",
	"cron",
	"email:beforeSend",
	"email:deliver",
	"email:afterSend",
	"comment:beforeCreate",
	"comment:moderate",
	"comment:afterCreate",
	"comment:afterModerate",
	"page:metadata",
	"page:fragments"
];
/**
* Structured hook entry for manifest — name plus optional metadata.
* During a transition period, both plain strings and objects are accepted.
*/
const manifestHookEntrySchema = z.object({
	name: z.enum(HOOK_NAMES),
	exclusive: z.boolean().optional(),
	priority: z.number().int().optional(),
	timeout: z.number().int().positive().optional()
});
/**
* Structured route entry for manifest — name plus optional metadata.
* Both plain strings and objects are accepted; strings are normalized
* to `{ name }` objects via `normalizeManifestRoute()`.
*/
/** Route names must be safe path segments — alphanumeric, hyphens, underscores, forward slashes */
const routeNamePattern = /^[a-zA-Z0-9][a-zA-Z0-9_\-/]*$/;
const manifestRouteEntrySchema = z.object({
	name: z.string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"),
	public: z.boolean().optional()
});
/** Index field names must be valid identifiers to prevent SQL injection via JSON path expressions */
const indexFieldName = z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);
const storageCollectionSchema = z.object({
	indexes: z.array(z.union([indexFieldName, z.array(indexFieldName)])),
	uniqueIndexes: z.array(z.union([indexFieldName, z.array(indexFieldName)])).optional()
});
const baseSettingFields = {
	label: z.string(),
	description: z.string().optional()
};
const settingFieldSchema = z.discriminatedUnion("type", [
	z.object({
		...baseSettingFields,
		type: z.literal("string"),
		default: z.string().optional(),
		multiline: z.boolean().optional()
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("number"),
		default: z.number().optional(),
		min: z.number().optional(),
		max: z.number().optional()
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("boolean"),
		default: z.boolean().optional()
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("select"),
		options: z.array(z.object({
			value: z.string(),
			label: z.string()
		})),
		default: z.string().optional()
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("secret")
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("url"),
		default: z.string().optional(),
		placeholder: z.string().optional()
	}),
	z.object({
		...baseSettingFields,
		type: z.literal("email"),
		default: z.string().optional(),
		placeholder: z.string().optional()
	})
]);
const adminPageSchema = z.object({
	path: z.string(),
	label: z.string(),
	icon: z.string().optional()
});
const dashboardWidgetSchema = z.object({
	id: z.string(),
	size: z.enum([
		"full",
		"half",
		"third"
	]).optional(),
	title: z.string().optional()
});
const pluginAdminConfigSchema = z.object({
	entry: z.string().optional(),
	settingsSchema: z.record(z.string(), settingFieldSchema).optional(),
	pages: z.array(adminPageSchema).optional(),
	widgets: z.array(dashboardWidgetSchema).optional(),
	fieldWidgets: z.array(z.object({
		name: z.string().min(1),
		label: z.string().min(1),
		fieldTypes: z.array(z.enum(FIELD_TYPES)),
		elements: z.array(z.object({
			type: z.string(),
			action_id: z.string(),
			label: z.string().optional()
		}).passthrough()).optional()
	})).optional()
});
/**
* Zod schema matching the PluginManifest interface from types.ts.
*
* Every JSON.parse of a manifest.json should validate through this.
*/
const pluginManifestSchema = z.object({
	id: z.string().min(1),
	version: z.string().min(1),
	capabilities: z.array(z.enum(PLUGIN_CAPABILITIES)),
	allowedHosts: z.array(z.string()),
	storage: z.record(z.string(), storageCollectionSchema),
	hooks: z.array(z.union([z.enum(HOOK_NAMES), manifestHookEntrySchema])),
	routes: z.array(z.union([z.string().min(1).regex(routeNamePattern, "Route name must be a safe path segment"), manifestRouteEntrySchema])),
	admin: pluginAdminConfigSchema
});
/**
* Normalize a manifest route entry — plain strings become `{ name }` objects.
*/
function normalizeManifestRoute(entry) {
	if (typeof entry === "string") return { name: entry };
	return entry;
}

export { HOOK_NAMES as H, PLUGIN_CAPABILITIES as P, SeoRepository as S, normalizeManifestRoute as n, pluginManifestSchema as p };
