import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/content/[collection]/[id]/permanent.ts
const prerender = false;
const DELETE = async ({ params, locals, cache }) => {
	const { emdash, user } = locals;
	const collection = params.collection;
	const id = params.id;
	const denied = requirePerm(user, "content:delete_permanent");
	if (denied) return denied;
	if (!emdash?.handleContentPermanentDelete) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const result = await emdash.handleContentPermanentDelete(collection, id);
	if (!result.success) return unwrapResult(result);
	if (cache?.enabled) await cache.invalidate({ tags: [collection, id] });
	return unwrapResult(result);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
