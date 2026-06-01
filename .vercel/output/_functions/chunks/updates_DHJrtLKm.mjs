import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { J as handleMarketplaceUpdateCheck, K as handleRegistryUpdateCheck } from './api-CLwG_3dh_CQnUFDop.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import { a as apiError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/admin/plugins/updates.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const [marketplace, registry] = await Promise.all([handleMarketplaceUpdateCheck(emdash.db, emdash.config.marketplace).catch((err) => {
		console.warn("[plugins/updates] marketplace check threw:", err);
		return null;
	}), handleRegistryUpdateCheck(emdash.db, emdash.config.experimental?.registry).catch((err) => {
		console.warn("[plugins/updates] registry check threw:", err);
		return null;
	})]);
	if (marketplace && !marketplace.success) console.warn(`[plugins/updates] marketplace check failed: ${marketplace.error.code} ${marketplace.error.message}`);
	if (registry && !registry.success) console.warn(`[plugins/updates] registry check failed: ${registry.error.code} ${registry.error.message}`);
	const items = [];
	if (marketplace?.success) items.push(...marketplace.data.items);
	if (registry?.success) items.push(...registry.data.items);
	return Response.json({ data: { items } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
