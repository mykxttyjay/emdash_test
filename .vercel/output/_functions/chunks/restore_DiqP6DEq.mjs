import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, m as mapErrorStatus, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as requireOwnerPerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/content/[collection]/[id]/restore.ts
const prerender = false;
const POST = async ({ params, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentRestore || !emdash?.handleContentGetIncludingTrashed) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const existing = await emdash.handleContentGetIncludingTrashed(collection, id);
	if (!existing.success) return apiError(existing.error?.code ?? "UNKNOWN_ERROR", existing.error?.message ?? "Unknown error", mapErrorStatus(existing.error?.code));
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const denied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:edit_own", "content:edit_any");
	if (denied) return denied;
	const resolvedId = typeof existingItem?.id === "string" ? existingItem.id : id;
	const result = await emdash.handleContentRestore(collection, resolvedId);
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
