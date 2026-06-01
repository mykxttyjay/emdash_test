import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { c as handleMenuList, t as handleMenuCreate } from './menus-Bjf5R1Qq_BkGIWiJ8.mjs';
import { u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { Z as createMenuBody, V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/menus/index.ts
const prerender = false;
const GET = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "menus:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleMenuList(emdash.db, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to fetch menus", "MENU_LIST_ERROR");
	}
};
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createMenuBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleMenuCreate(emdash.db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create menu", "MENU_CREATE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
