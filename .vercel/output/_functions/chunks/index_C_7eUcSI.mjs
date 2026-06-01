import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { _ as handleSchemaCollectionDelete, $ as handleSchemaCollectionGet, a0 as handleSchemaCollectionUpdate } from './api-CLwG_3dh_CQnUFDop.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import { r as requireDb, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { a7 as collectionGetQuery, a8 as updateCollectionBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/schema/collections/[slug]/index.ts
const prerender = false;
const GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const slug = params.slug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:read");
	if (denied) return denied;
	const query = parseQuery(url, collectionGetQuery);
	if (isParseError(query)) return query;
	return unwrapResult(await handleSchemaCollectionGet(emdash.db, slug, { includeFields: query.includeFields ?? false }));
};
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const slug = params.slug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const body = await parseBody(request, updateCollectionBody);
	if (isParseError(body)) return body;
	const result = await handleSchemaCollectionUpdate(emdash.db, slug, body);
	emdash.invalidateUrlPatternCache();
	return unwrapResult(result);
};
const DELETE = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const slug = params.slug;
	const force = url.searchParams.get("force") === "true";
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const result = await handleSchemaCollectionDelete(emdash.db, slug, { force });
	emdash.invalidateUrlPatternCache();
	return unwrapResult(result);
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
