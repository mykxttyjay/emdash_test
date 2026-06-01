import { s as slugify } from './slugify-Cjh1ssOZ_DsJS_JEc.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { B as BylineRepository } from './byline-CTaWkMh5_BRoEzpjM.mjs';
import { r as resolveAndValidateExternalUrl, S as SsrfError } from './ssrf-MZ-zrG6-_C2NT9OCQ.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { L as wpPluginExecuteBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getSource, r as resolveImportByline } from './import-DG80rC_I_xvWF57jY.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import './request-context_COpWwYmK.mjs';
import 'better-sqlite3';
import './adapt-sandbox-entry_DjK9-r0z.mjs';
import { t as ContentRepository } from './content-C0ooIs-f_Bwo8eX_E.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import 'croner';
import 'image-size';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import { S as SchemaRegistry } from './registry-DqrAQDXH_ByM39WgY.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import '@atcute/client';
import './email-console-CubRll9q_BSEoXBnN.mjs';
import 'mime/lite';

//#region src/astro/routes/api/import/wordpress-plugin/execute.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	if (!emdash?.handleContentCreate) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	try {
		const emdashManifest = await emdash.getManifest();
		const body = await parseBody(request, wpPluginExecuteBody);
		if (isParseError(body)) return body;
		try {
			await resolveAndValidateExternalUrl(body.url);
		} catch (e) {
			return apiError("SSRF_BLOCKED", e instanceof SsrfError ? e.message : "Invalid URL", 400);
		}
		const config = body.config;
		const source = getSource("wordpress-plugin");
		if (!source) return apiError("NOT_CONFIGURED", "WordPress plugin source not available", 500);
		const postTypes = Object.entries(config.postTypeMappings).filter(([_, mapping]) => mapping.enabled).map(([postType]) => postType);
		if (postTypes.length === 0) return apiError("VALIDATION_ERROR", "No post types selected for import", 400);
		console.log("[WP Plugin Import] Starting import for:", body.url);
		console.log("[WP Plugin Import] Post types:", postTypes);
		const result = await importContent(source.fetchContent({
			type: "url",
			url: body.url,
			token: body.token
		}, {
			postTypes,
			includeDrafts: true
		}), config, emdash, emdashManifest);
		console.log("[WP Plugin Import] Import result:", JSON.stringify(result, null, 2));
		return apiSuccess({
			success: true,
			result
		});
	} catch (error) {
		return handleError(error, "Failed to import from WordPress", "WP_PLUGIN_IMPORT_ERROR");
	}
};
/** Fields that should be auto-created if they don't exist */
const IMPORT_FIELDS = [
	{
		slug: "title",
		label: "Title",
		type: "string",
		check: () => true
	},
	{
		slug: "content",
		label: "Content",
		type: "portableText",
		check: () => true
	},
	{
		slug: "excerpt",
		label: "Excerpt",
		type: "text",
		check: (item) => !!item.excerpt
	},
	{
		slug: "featured_image",
		label: "Featured Image",
		type: "image",
		check: (item) => !!item.featuredImage
	}
];
async function importContent(items, config, emdash, manifest) {
	const result = {
		success: true,
		imported: 0,
		skipped: 0,
		errors: [],
		byCollection: {}
	};
	const contentRepo = new ContentRepository(emdash.db);
	const bylineRepo = new BylineRepository(emdash.db);
	const bylineCache = /* @__PURE__ */ new Map();
	const schemaRegistry = new SchemaRegistry(emdash.db);
	const ensuredCollections = /* @__PURE__ */ new Set();
	const translationGroupMap = /* @__PURE__ */ new Map();
	for await (const item of items) {
		console.log("[WP Plugin Import] Processing item:", {
			sourceId: item.sourceId,
			title: item.title,
			postType: item.postType,
			status: item.status,
			contentBlocks: Array.isArray(item.content) ? item.content.length : 0,
			featuredImage: item.featuredImage,
			locale: item.locale,
			translationGroup: item.translationGroup
		});
		const mapping = config.postTypeMappings[item.postType];
		if (!mapping || !mapping.enabled) {
			result.skipped++;
			continue;
		}
		const collection = mapping.collection;
		if (!manifest?.collections[collection]) {
			result.errors.push({
				title: item.title || "Untitled",
				error: `Collection "${collection}" does not exist`
			});
			continue;
		}
		try {
			if (!ensuredCollections.has(collection)) {
				for (const field of IMPORT_FIELDS) if (field.check(item)) {
					if (!await schemaRegistry.getField(collection, field.slug)) {
						console.log(`[WP Plugin Import] Creating missing field "${field.slug}" in collection "${collection}"`);
						try {
							await schemaRegistry.createField(collection, {
								slug: field.slug,
								label: field.label,
								type: field.type,
								required: false
							});
						} catch (e) {
							console.log(`[WP Plugin Import] Field "${field.slug}" creation skipped:`, e instanceof Error ? e.message : e);
						}
					}
				}
				ensuredCollections.add(collection);
			}
			const slug = item.slug || slugify(item.title || `post-${item.sourceId}`);
			if (config.skipExisting) {
				const existing = await contentRepo.findBySlug(collection, slug, item.locale);
				if (existing) {
					if (item.translationGroup) translationGroupMap.set(item.translationGroup, existing.id);
					result.skipped++;
					continue;
				}
			}
			const status = mapStatus(item.status);
			const data = {};
			data.title = item.title || "Untitled";
			data.content = item.content;
			if (item.excerpt) data.excerpt = item.excerpt;
			if (item.featuredImage) {
				data.featured_image = item.featuredImage;
				console.log("[WP Plugin Import] Adding featured_image:", item.featuredImage);
			}
			let authorId;
			if (config.authorMappings && item.author) {
				const mappedUserId = config.authorMappings[item.author];
				if (mappedUserId !== void 0 && mappedUserId !== null) authorId = mappedUserId;
			}
			const bylineId = await resolveImportByline(item.author, item.author, authorId, bylineRepo, bylineCache);
			let translationOf;
			if (item.translationGroup) {
				const existingGroupItem = translationGroupMap.get(item.translationGroup);
				if (existingGroupItem) translationOf = existingGroupItem;
			}
			const itemDateTime = item.date?.getTime();
			const createdAt = itemDateTime !== void 0 && !Number.isNaN(itemDateTime) ? item.date.toISOString() : void 0;
			const publishedAt = status === "published" && createdAt ? createdAt : void 0;
			const createResult = await emdash.handleContentCreate(collection, {
				data,
				slug,
				status,
				authorId,
				bylines: bylineId ? [{ bylineId }] : void 0,
				locale: item.locale,
				translationOf,
				createdAt,
				publishedAt
			});
			if (createResult.success) {
				result.imported++;
				result.byCollection[collection] = (result.byCollection[collection] || 0) + 1;
				if (item.translationGroup && !translationGroupMap.has(item.translationGroup)) {
					const createdData = createResult.data;
					if (createdData?.id) translationGroupMap.set(item.translationGroup, createdData.id);
				}
			} else result.errors.push({
				title: item.title || "Untitled",
				error: typeof createResult.error === "object" && createResult.error !== null ? createResult.error.message || "Unknown error" : String(createResult.error)
			});
		} catch (error) {
			console.error(`Import error for "${item.title || "Untitled"}":`, error);
			result.errors.push({
				title: item.title || "Untitled",
				error: error instanceof Error && error.message ? error.message : "Failed to import item"
			});
		}
	}
	result.success = result.errors.length === 0;
	return result;
}
function mapStatus(wpStatus) {
	switch (wpStatus) {
		case "publish": return "published";
		case "draft": return "draft";
		case "pending": return "draft";
		case "private": return "draft";
		default: return "draft";
	}
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
