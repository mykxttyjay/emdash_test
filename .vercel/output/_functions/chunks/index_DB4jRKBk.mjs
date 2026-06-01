import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { n as handleTaxonomyList, t as handleTaxonomyCreate } from './taxonomies-CLs9HPE2_BQA_DL6v.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ao as createTaxonomyDefBody, V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/taxonomies/index.ts
const prerender = false;
/**
* List taxonomy definitions
*/
const GET = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		return unwrapResult(await handleTaxonomyList(emdash.db, { locale: query.locale }));
	} catch (error) {
		return handleError(error, "Failed to list taxonomies", "TAXONOMY_LIST_ERROR");
	}
};
/**
* Create a custom taxonomy definition
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createTaxonomyDefBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTaxonomyCreate(emdash.db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create taxonomy", "TAXONOMY_CREATE_ERROR");
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
