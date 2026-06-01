import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { n as handleMenuDelete, r as handleMenuGet, u as handleMenuUpdate } from './menus-Bjf5R1Qq_BkGIWiJ8.mjs';
import { u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { Y as updateMenuBody, V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/menus/[name].ts
const prerender = false;
const GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleMenuGet(emdash.db, name, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to fetch menu", "MENU_GET_ERROR");
	}
};
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		const body = await parseBody(request, updateMenuBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuUpdate(emdash.db, name, {
			...body,
			locale: query.locale
		}));
	} catch (error) {
		return handleError(error, "Failed to update menu", "MENU_UPDATE_ERROR");
	}
};
const DELETE = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleMenuDelete(emdash.db, name, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to delete menu", "MENU_DELETE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	GET,
	PUT,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
