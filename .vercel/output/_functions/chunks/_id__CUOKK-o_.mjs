import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as handleMenuItemDelete, s as handleMenuItemUpdate } from './menus-Bjf5R1Qq_BkGIWiJ8.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { U as updateMenuItemBody, V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/menus/[name]/items/[id].ts
const prerender = false;
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const itemId = params.id;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	if (!itemId) return apiError("VALIDATION_ERROR", "id is required", 400);
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const body = await parseBody(request, updateMenuItemBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuItemUpdate(emdash.db, name, itemId, body, { locale: localeQ.locale }));
	} catch (error) {
		return handleError(error, "Failed to update menu item", "MENU_ITEM_UPDATE_ERROR");
	}
};
const DELETE = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const itemId = params.id;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	if (!itemId) return apiError("VALIDATION_ERROR", "id is required", 400);
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		return unwrapResult(await handleMenuItemDelete(emdash.db, name, itemId, { locale: localeQ.locale }));
	} catch (error) {
		return handleError(error, "Failed to delete menu item", "MENU_ITEM_DELETE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	PUT,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
