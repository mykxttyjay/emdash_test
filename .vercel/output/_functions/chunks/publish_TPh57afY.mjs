import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, m as mapErrorStatus, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { b as parseOptionalBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { A as contentPublishBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { a as requireOwnerPerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as hasPermission } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/content/[collection]/[id]/publish.ts
/**
* Publish content - promotes draft to live
*
* POST /_emdash/api/content/{collection}/{id}/publish
*
* Optional JSON body: { publishedAt?: string }
*   publishedAt — ISO 8601 datetime to backdate the publish (e.g. when
*   migrating content). Writing publishedAt requires content:publish_any.
*   Without it, the existing published_at is preserved on re-publish and
*   falls back to the current time on first publish.
*/
const prerender = false;
const POST = async ({ params, request, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentPublish || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const body = await parseOptionalBody(request, contentPublishBody, {});
	if (isParseError(body)) return body;
	const existing = await emdash.handleContentGet(collection, id);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const denied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:publish_own", "content:publish_any");
	if (denied) return denied;
	const publishedAt = body?.publishedAt;
	if (publishedAt !== void 0 && !hasPermission(user, "content:publish_any")) return apiError("FORBIDDEN", "Setting publishedAt requires content:publish_any permission", 403);
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const result = await emdash.handleContentPublish(collection, resolvedId, { publishedAt });
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId] });
	return unwrapResult(result);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
