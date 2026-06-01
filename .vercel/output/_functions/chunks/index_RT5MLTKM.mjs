import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, m as mapErrorStatus } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { E as contentListQuery, F as contentCreateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm, a as requireOwnerPerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as hasPermission } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/content/[collection]/index.ts
/**
* Content list and create endpoints - injected by EmDash integration
*
* GET  /_emdash/api/content/{collection} - List content
* POST /_emdash/api/content/{collection} - Create content
*/
const prerender = false;
const GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	const collection = params.collection;
	const query = parseQuery(url, contentListQuery);
	if (isParseError(query)) return query;
	if (!emdash?.handleContentList) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const params_ = hasPermission(user, "content:read_drafts") ? query : {
		...query,
		status: "published"
	};
	return unwrapResult(await emdash.handleContentList(collection, params_));
};
const POST = async ({ params, request, locals, cache }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "content:create");
	if (denied) return denied;
	const collection = params.collection;
	const body = await parseBody(request, contentCreateBody);
	if (isParseError(body)) return body;
	if (!emdash?.handleContentCreate || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (body.translationOf) {
		const source = await emdash.handleContentGet(collection, body.translationOf);
		if (!source.success) return apiError(source.error?.code ?? "NOT_FOUND", source.error?.message ?? "Translation source not found", mapErrorStatus(source.error?.code));
		const translationDenied = requireOwnerPerm(user, source.data.item.authorId ?? "", "content:edit_own", "content:edit_any");
		if (translationDenied) return translationDenied;
	}
	if ((body.publishedAt !== void 0 || body.createdAt !== void 0) && !hasPermission(user, "content:publish_any")) return apiError("FORBIDDEN", "Writing publishedAt or createdAt requires content:publish_any permission", 403);
	const result = await emdash.handleContentCreate(collection, {
		...body,
		authorId: user?.id,
		locale: body.locale,
		translationOf: body.translationOf
	});
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection] });
	return unwrapResult(result, 201);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
