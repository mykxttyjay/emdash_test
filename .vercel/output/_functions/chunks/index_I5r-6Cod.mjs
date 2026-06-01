import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { o as handleTermList, r as handleTermCreate } from './taxonomies-CLs9HPE2_BQA_DL6v.mjs';
import { a as apiError, r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { an as createTermBody, V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/taxonomies/[name]/terms/index.ts
const prerender = false;
/**
* List all terms for a taxonomy
*/
const GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name } = params;
	if (!name) return apiError("VALIDATION_ERROR", "Taxonomy name required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleTermList(emdash.db, name, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to list terms", "TERM_LIST_ERROR");
	}
};
/**
* Create a new term
*/
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name } = params;
	if (!name) return apiError("VALIDATION_ERROR", "Taxonomy name required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createTermBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTermCreate(emdash.db, name, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create term", "TERM_CREATE_ERROR");
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
