import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as invalidateRedirectCache } from './cache-CNk1jIxp_DFeVYLPD.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { a2 as redirectsListQuery, a3 as createRedirectBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { g as handleRedirectList, i as handleRedirectCreate } from './redirects-B-CUZ1Xh_DJfSvl-q.mjs';

//#region src/astro/routes/api/redirects/index.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:read");
	if (denied) return denied;
	try {
		const query = parseQuery(url, redirectsListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleRedirectList(db, query));
	} catch (error) {
		return handleError(error, "Failed to fetch redirects", "REDIRECT_LIST_ERROR");
	}
};
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createRedirectBody);
		if (isParseError(body)) return body;
		const result = await handleRedirectCreate(db, body);
		invalidateRedirectCache();
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to create redirect", "REDIRECT_CREATE_ERROR");
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
