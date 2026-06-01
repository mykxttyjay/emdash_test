import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { y as contentTrashQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/content/[collection]/trash.ts
const prerender = false;
const GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const denied = requirePerm(user, "content:read_drafts");
	if (denied) return denied;
	if (!emdash?.handleContentListTrashed) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const query = parseQuery(url, contentTrashQuery);
	if (isParseError(query)) return query;
	return unwrapResult(await emdash.handleContentListTrashed(collection, query));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
