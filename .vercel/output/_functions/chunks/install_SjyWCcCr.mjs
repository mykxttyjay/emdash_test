import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { F as handleMarketplaceInstall } from './api-CLwG_3dh_CQnUFDop.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { z } from 'zod';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { b as parseOptionalBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/admin/plugins/marketplace/[id]/install.ts
const prerender = false;
const installBodySchema = z.object({ version: z.string().min(1).optional() });
const POST = async ({ params, request, locals }) => {
	try {
		const { emdash, user } = locals;
		const { id } = params;
		if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
		const denied = requirePerm(user, "plugins:manage");
		if (denied) return denied;
		if (!id) return apiError("INVALID_REQUEST", "Plugin ID required", 400);
		const body = await parseOptionalBody(request, installBodySchema, {});
		if (isParseError(body)) return body;
		const configuredPluginIds = new Set(emdash.configuredPlugins.map((p) => p.id));
		const siteOrigin = new URL(request.url).origin;
		const result = await handleMarketplaceInstall(emdash.db, emdash.storage, emdash.getSandboxRunner(), emdash.config.marketplace, id, {
			version: body.version,
			configuredPluginIds,
			siteOrigin,
			sandboxBypassed: emdash.isSandboxBypassed()
		});
		if (!result.success) return unwrapResult(result);
		await emdash.syncMarketplacePlugins();
		return unwrapResult(result, 201);
	} catch (error) {
		console.error("[marketplace-install] Unhandled error:", error);
		return handleError(error, "Failed to install plugin from marketplace", "INSTALL_FAILED");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
