import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { o as handleMenuItemReorder } from './menus-Bjf5R1Qq_BkGIWiJ8.mjs';
import { u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { X as reorderMenuItemsBody, V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/menus/[name]/reorder.ts
const prerender = false;
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const body = await parseBody(request, reorderMenuItemsBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuItemReorder(emdash.db, name, body.items, { locale: localeQ.locale }));
	} catch (error) {
		return handleError(error, "Failed to reorder menu items", "MENU_REORDER_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
