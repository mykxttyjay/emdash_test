import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, m as mapErrorStatus, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { D as contentUpdateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { a as requireOwnerPerm, r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as hasPermission } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/content/[collection]/[id].ts
/**
* Single content item endpoints - injected by EmDash integration
*
* GET    /_emdash/api/content/{collection}/{id} - Get content
* PUT    /_emdash/api/content/{collection}/{id} - Update content
* DELETE /_emdash/api/content/{collection}/{id} - Delete content
*/
const prerender = false;
const GET = async ({ params, url, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	const collection = params.collection;
	const id = params.id;
	const locale = url.searchParams.get("locale") || void 0;
	if (!emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const result = await emdash.handleContentGet(collection, id, locale);
	if (result.success && !hasPermission(user, "content:read_drafts")) {
		const data = result.data && typeof result.data === "object" ? result.data : void 0;
		const item = data?.item && typeof data.item === "object" ? data.item : void 0;
		if ((typeof item?.status === "string" ? item.status : null) !== "published") return apiError("NOT_FOUND", `Content item not found: ${id}`, 404);
		if (item) {
			if (item.liveData && typeof item.liveData === "object") item.data = item.liveData;
			delete item.liveData;
			delete item.draftRevisionId;
		}
	}
	return unwrapResult(result);
};
const PUT = async ({ params, request, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	const body = await parseBody(request, contentUpdateBody);
	if (isParseError(body)) return body;
	if (!emdash?.handleContentUpdate || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const existing = await emdash.handleContentGet(collection, id);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const editDenied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:edit_own", "content:edit_any");
	if (editDenied) return editDenied;
	if (body.publishedAt !== void 0 && !hasPermission(user, "content:publish_any")) return apiError("FORBIDDEN", "Writing publishedAt requires content:publish_any permission", 403);
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const updateBody = body.authorId !== void 0 && user && hasPermission(user, "content:edit_any") ? body : {
		...body,
		authorId: void 0
	};
	const result = await emdash.handleContentUpdate(collection, resolvedId, {
		...updateBody,
		_rev: body._rev
	});
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId] });
	return unwrapResult(result);
};
const DELETE = async ({ params, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentDelete || !emdash?.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const existing = await emdash.handleContentGet(collection, id);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const deleteData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const deleteItem = deleteData?.item && typeof deleteData.item === "object" ? deleteData.item : deleteData;
	const deleteDenied = requireOwnerPerm(user, typeof deleteItem?.authorId === "string" ? deleteItem.authorId : "", "content:delete_own", "content:delete_any");
	if (deleteDenied) return deleteDenied;
	const resolvedId = typeof deleteItem?.id === "string" ? deleteItem.id : id;
	const result = await emdash.handleContentDelete(collection, resolvedId);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, resolvedId] });
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
