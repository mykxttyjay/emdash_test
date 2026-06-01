import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { I as handleRegistryInstall } from './api-CLwG_3dh_CQnUFDop.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { z } from 'zod';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/admin/plugins/registry/install.ts
const prerender = false;
const installBodySchema = z.object({
	did: z.string().min(1).max(2048).regex(/^did:[a-z]+:/, "Invalid DID"),
	slug: z.string().min(1).max(64).regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, "Invalid slug"),
	version: z.string().min(1).max(64).optional(),
	acknowledgedDeclaredAccess: z.unknown().optional()
});
const POST = async ({ request, locals }) => {
	try {
		const { emdash, user } = locals;
		if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
		const denied = requirePerm(user, "plugins:manage");
		if (denied) return denied;
		const body = await parseBody(request, installBodySchema);
		if (isParseError(body)) return body;
		const reservedPluginIds = new Set([...emdash.configuredPlugins.map((p) => p.id), ...(emdash.config.sandboxed ?? []).map((p) => p.id)]);
		const result = await handleRegistryInstall(emdash.db, emdash.storage, emdash.getSandboxRunner(), emdash.config.experimental?.registry, {
			did: body.did,
			slug: body.slug,
			version: body.version,
			acknowledgedDeclaredAccess: body.acknowledgedDeclaredAccess
		}, { configuredPluginIds: reservedPluginIds });
		if (!result.success) return unwrapResult(result);
		await emdash.syncRegistryPlugins();
		return unwrapResult(result, 201);
	} catch (error) {
		console.error("[registry-install] Unhandled error:", error);
		return handleError(error, "Failed to install plugin from registry", "INSTALL_FAILED");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
