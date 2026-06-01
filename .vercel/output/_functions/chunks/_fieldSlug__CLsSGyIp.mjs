import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { V as handleSchemaFieldDelete, W as handleSchemaFieldGet, X as handleSchemaFieldUpdate } from './api-CLwG_3dh_CQnUFDop.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import { r as requireDb, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { a5 as updateFieldBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/schema/collections/[slug]/fields/[fieldSlug].ts
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const collectionSlug = params.slug;
	const fieldSlug = params.fieldSlug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:read");
	if (denied) return denied;
	return unwrapResult(await handleSchemaFieldGet(emdash.db, collectionSlug, fieldSlug));
};
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const collectionSlug = params.slug;
	const fieldSlug = params.fieldSlug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	const body = await parseBody(request, updateFieldBody);
	if (isParseError(body)) return body;
	return unwrapResult(await handleSchemaFieldUpdate(emdash.db, collectionSlug, fieldSlug, body));
};
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const collectionSlug = params.slug;
	const fieldSlug = params.fieldSlug;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "schema:manage");
	if (denied) return denied;
	return unwrapResult(await handleSchemaFieldDelete(emdash.db, collectionSlug, fieldSlug));
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
