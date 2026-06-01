import { v as validateIdentifier } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { n as normalizeMediaValue } from './normalize-CN5kRSMC_CU3uucGH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { J as wpRewriteUrlsBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { sql } from 'kysely';

//#region src/astro/routes/api/import/wordpress/rewrite-url-helpers.ts
const REGEX_SPECIAL_CHARS = /[.*+?^${}()|[\]\\]/g;
const WORDPRESS_IMAGE_SIZE_SUFFIX = /-\d+x\d+(?=\.[^./?#]+$)/;
const BASE_URL_EXTENSION = /^(.+)(\.[^./?#]+)$/;
/**
* Strip query parameters from a URL for base matching
*/
function getBaseUrl(url) {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return url.split("?")[0] || url;
	}
}
/**
* Build a map of base URLs to new URLs for flexible matching
*/
function buildBaseUrlMap(urlMap) {
	const baseMap = /* @__PURE__ */ new Map();
	for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
		const baseUrl = getBaseUrl(oldUrl);
		baseMap.set(baseUrl, newUrl);
	}
	return baseMap;
}
/**
* Find matching new URL for a given URL, checking exact, base, and WordPress image-size matches
*/
function findMatchingUrl(url, exactMap, baseMap) {
	if (exactMap[url]) return exactMap[url];
	const baseUrl = getBaseUrl(url);
	const baseMatch = baseMap.get(baseUrl);
	if (baseMatch) return baseMatch;
	const wordPressImageMatch = baseMap.get(stripWordPressImageSizeSuffix(baseUrl));
	if (wordPressImageMatch) return wordPressImageMatch;
	return null;
}
/**
* Rewrite URLs in a Portable Text array, returning whether any changes were made
*/
function rewritePortableTextUrls(blocks, exactMap, baseMap) {
	let changed = false;
	let urlsRewritten = 0;
	for (const block of blocks) {
		if (block._type === "image" && block.asset?.url) {
			const newUrl = findMatchingUrl(block.asset.url, exactMap, baseMap);
			if (newUrl) {
				block.asset.url = newUrl;
				block.asset._ref = newUrl;
				changed = true;
				urlsRewritten++;
			}
		}
		if (block._type === "image" && block.link) {
			const newUrl = findMatchingUrl(block.link, exactMap, baseMap);
			if (newUrl) {
				block.link = newUrl;
				changed = true;
				urlsRewritten++;
			}
		}
		if (block._type === "gallery" && Array.isArray(block.images)) {
			const result = rewritePortableTextUrls(block.images, exactMap, baseMap);
			if (result.changed) {
				changed = true;
				urlsRewritten += result.urlsRewritten;
			}
		}
		if (block._type === "columns" && Array.isArray(block.columns)) {
			for (const column of block.columns) if (Array.isArray(column.content)) {
				const result = rewritePortableTextUrls(column.content, exactMap, baseMap);
				if (result.changed) {
					changed = true;
					urlsRewritten += result.urlsRewritten;
				}
			}
		}
	}
	return {
		changed,
		urlsRewritten
	};
}
/**
* Rewrite URLs in a string field using simple string replacement
*/
function rewriteStringUrls(value, exactMap, baseMap) {
	let newValue = value;
	let changed = false;
	let urlsRewritten = 0;
	for (const [oldUrl, newUrl] of Object.entries(exactMap)) if (newValue.includes(oldUrl)) {
		newValue = newValue.split(oldUrl).join(newUrl);
		changed = true;
		urlsRewritten++;
	}
	for (const [baseUrl, newUrl] of baseMap.entries()) {
		const regex = buildBaseUrlMatchRegex(baseUrl);
		const matches = newValue.match(regex);
		if (matches) {
			for (const match of matches) if (!exactMap[match]) {
				newValue = newValue.split(match).join(newUrl);
				changed = true;
				urlsRewritten++;
			}
		}
	}
	return {
		newValue,
		changed,
		urlsRewritten
	};
}
/**
* Escape special regex characters in a string
*/
function escapeRegExp(string) {
	return string.replace(REGEX_SPECIAL_CHARS, "\\$&");
}
function stripWordPressImageSizeSuffix(url) {
	return url.replace(WORDPRESS_IMAGE_SIZE_SUFFIX, "");
}
function buildBaseUrlMatchRegex(baseUrl) {
	const extensionMatch = BASE_URL_EXTENSION.exec(baseUrl);
	const basePattern = extensionMatch ? `${escapeRegExp(extensionMatch[1])}(?:-\\d+x\\d+)?${escapeRegExp(extensionMatch[2])}` : escapeRegExp(baseUrl);
	return new RegExp(`${basePattern}(\\?[^"'\\s]*)?(?=$|["'\\s<>)\\],;:!?]|\\.(?=$|["'\\s<>)\\]]))`, "g");
}

//#region src/astro/routes/api/import/wordpress/rewrite-urls.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NO_DB", "Database not initialized", 500);
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	try {
		const body = await parseBody(request, wpRewriteUrlsBody);
		if (isParseError(body)) return body;
		if (Object.entries(body.urlMap).length === 0) return apiSuccess({
			updated: 0,
			byCollection: {},
			urlsRewritten: 0,
			errors: []
		});
		const getProvider = (id) => emdash.getMediaProvider(id);
		return apiSuccess(await rewriteUrls(emdash.db, body.urlMap, getProvider, body.collections));
	} catch (error) {
		return handleError(error, "Failed to rewrite URLs", "REWRITE_ERROR");
	}
};
async function rewriteUrls(db, urlMap, getProvider, collections) {
	const { SchemaRegistry } = await import('./registry-DqrAQDXH_ByM39WgY.mjs').then(n => n.r).then((n) => n.r);
	const registry = new SchemaRegistry(db);
	const result = {
		updated: 0,
		byCollection: {},
		urlsRewritten: 0,
		errors: []
	};
	const baseMap = buildBaseUrlMap(urlMap);
	const allCollections = await registry.listCollections();
	const targetCollections = collections?.length ? allCollections.filter((c) => collections.includes(c.slug)) : allCollections;
	for (const collection of targetCollections) {
		const fields = await registry.listFields(collection.id);
		const portableTextFields = fields.filter((f) => f.type === "portableText");
		const stringFields = fields.filter((f) => ["text", "string"].includes(f.type));
		const mediaFields = fields.filter((f) => ["image", "file"].includes(f.type));
		if (portableTextFields.length === 0 && stringFields.length === 0 && mediaFields.length === 0) continue;
		validateIdentifier(collection.slug, "collection slug");
		const tableName = `ec_${collection.slug}`;
		try {
			const rows = await sql`
				SELECT * FROM ${sql.ref(tableName)}
				WHERE deleted_at IS NULL
			`.execute(db);
			for (const row of rows.rows) {
				let rowUpdated = false;
				const updates = {};
				let rowUrlsRewritten = 0;
				for (const field of portableTextFields) {
					const value = row[field.slug];
					if (!value || typeof value !== "string") continue;
					try {
						const blocks = JSON.parse(value);
						if (!Array.isArray(blocks)) continue;
						const rewriteResult = rewritePortableTextUrls(blocks, urlMap, baseMap);
						if (rewriteResult.changed) {
							updates[field.slug] = JSON.stringify(blocks);
							rowUpdated = true;
							rowUrlsRewritten += rewriteResult.urlsRewritten;
						}
					} catch {
						const stringResult = rewriteStringUrls(value, urlMap, baseMap);
						if (stringResult.changed) {
							updates[field.slug] = stringResult.newValue;
							rowUpdated = true;
							rowUrlsRewritten += stringResult.urlsRewritten;
						}
					}
				}
				for (const field of stringFields) {
					const value = row[field.slug];
					if (!value || typeof value !== "string") continue;
					const stringResult = rewriteStringUrls(value, urlMap, baseMap);
					if (stringResult.changed) {
						updates[field.slug] = stringResult.newValue;
						rowUpdated = true;
						rowUrlsRewritten += stringResult.urlsRewritten;
					}
				}
				for (const field of mediaFields) {
					const value = row[field.slug];
					if (!value || typeof value !== "string") continue;
					const newUrl = findMatchingUrl(value, urlMap, baseMap);
					if (newUrl) {
						try {
							const normalized = await normalizeMediaValue(newUrl, getProvider);
							updates[field.slug] = normalized ? JSON.stringify(normalized) : newUrl;
						} catch {
							updates[field.slug] = newUrl;
						}
						rowUpdated = true;
						rowUrlsRewritten++;
					}
				}
				if (rowUpdated) try {
					let query = db.updateTable(tableName).where("id", "=", row.id);
					for (const [key, value] of Object.entries(updates)) query = query.set({ [key]: value });
					await query.execute();
					result.updated++;
					result.urlsRewritten += rowUrlsRewritten;
					result.byCollection[collection.slug] = (result.byCollection[collection.slug] || 0) + 1;
				} catch (updateError) {
					result.errors.push({
						collection: collection.slug,
						id: row.id,
						error: updateError instanceof Error ? updateError.message : "Update failed"
					});
				}
			}
		} catch (queryError) {
			result.errors.push({
				collection: collection.slug,
				id: "*",
				error: queryError instanceof Error ? queryError.message : "Query failed for collection"
			});
		}
	}
	return result;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
