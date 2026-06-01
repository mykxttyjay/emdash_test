import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { _ as notFoundSummaryQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as handleNotFoundSummary } from './redirects-B-CUZ1Xh_DJfSvl-q.mjs';

//#region src/astro/routes/api/redirects/404s/summary.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "redirects:read");
	if (denied) return denied;
	try {
		const query = parseQuery(url, notFoundSummaryQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleNotFoundSummary(db, query.limit));
	} catch (error) {
		return handleError(error, "Failed to fetch 404 summary", "NOT_FOUND_SUMMARY_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
