import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as resolveAndValidateExternalUrl, S as SsrfError } from './ssrf-MZ-zrG6-_C2NT9OCQ.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { K as wpPluginAnalyzeBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getSource } from './import-DG80rC_I_xvWF57jY.mjs';
import 'mime/lite';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import './request-context_COpWwYmK.mjs';
import 'better-sqlite3';
import './adapt-sandbox-entry_DjK9-r0z.mjs';
import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import 'croner';
import 'image-size';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import { S as SchemaRegistry } from './registry-DqrAQDXH_ByM39WgY.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import '@atcute/client';
import './email-console-CubRll9q_BSEoXBnN.mjs';

//#region src/astro/routes/api/import/wordpress-plugin/analyze.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	try {
		const body = await parseBody(request, wpPluginAnalyzeBody);
		if (isParseError(body)) return body;
		try {
			await resolveAndValidateExternalUrl(body.url);
		} catch (e) {
			return apiError("SSRF_BLOCKED", e instanceof SsrfError ? e.message : "Invalid URL", 400);
		}
		const source = getSource("wordpress-plugin");
		if (!source) return apiError("NOT_CONFIGURED", "WordPress plugin source not available", 500);
		const existingCollections = await fetchExistingCollections(emdash?.db);
		return apiSuccess({
			success: true,
			analysis: await source.analyze({
				type: "url",
				url: body.url,
				token: body.token
			}, {
				db: emdash?.db,
				getExistingCollections: async () => existingCollections
			})
		});
	} catch (error) {
		return handleError(error, "Failed to analyze WordPress site", "WP_PLUGIN_ANALYZE_ERROR");
	}
};
/** Fetch collections and their fields from schema registry */
async function fetchExistingCollections(db) {
	const result = /* @__PURE__ */ new Map();
	if (!db) return result;
	try {
		const registry = new SchemaRegistry(db);
		const collections = await registry.listCollections();
		for (const collection of collections) {
			const fields = await registry.listFields(collection.id);
			const fieldMap = /* @__PURE__ */ new Map();
			for (const field of fields) fieldMap.set(field.slug, { type: field.type });
			result.set(collection.slug, {
				slug: collection.slug,
				fields: fieldMap
			});
		}
	} catch (error) {
		console.warn("Could not fetch schema registry:", error);
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
