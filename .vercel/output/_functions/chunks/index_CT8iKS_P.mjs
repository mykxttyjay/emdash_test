import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { T as handleThemeSearch } from './api-CLwG_3dh_CQnUFDop.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import { a as apiError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/admin/themes/marketplace/index.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const query = url.searchParams.get("q") ?? void 0;
	const keyword = url.searchParams.get("keyword") ?? void 0;
	const sortParam = url.searchParams.get("sort");
	const validSorts = new Set([
		"name",
		"created",
		"updated"
	]);
	let sort;
	if (sortParam && validSorts.has(sortParam)) sort = sortParam;
	const cursor = url.searchParams.get("cursor") ?? void 0;
	const limitParam = url.searchParams.get("limit");
	const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10) || 50), 100) : void 0;
	return unwrapResult(await handleThemeSearch(emdash.config.marketplace, query, {
		keyword,
		sort,
		cursor,
		limit
	}));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
