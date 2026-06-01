import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { $ as notFoundListQuery, a0 as notFoundPruneBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { a as handleNotFoundClear, b as handleNotFoundList, c as handleNotFoundPrune } from './redirects-B-CUZ1Xh_DJfSvl-q.mjs';

//#region src/astro/routes/api/redirects/404s/index.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:read");
	if (denied) return denied;
	try {
		const query = parseQuery(url, notFoundListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleNotFoundList(db, query));
	} catch (error) {
		return handleError(error, "Failed to fetch 404 log", "NOT_FOUND_LIST_ERROR");
	}
};
const DELETE = async ({ locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:manage");
	if (denied) return denied;
	try {
		return unwrapResult(await handleNotFoundClear(db));
	} catch (error) {
		return handleError(error, "Failed to clear 404 log", "NOT_FOUND_CLEAR_ERROR");
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
		const body = await parseBody(request, notFoundPruneBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleNotFoundPrune(db, body.olderThan));
	} catch (error) {
		return handleError(error, "Failed to prune 404 log", "NOT_FOUND_PRUNE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
