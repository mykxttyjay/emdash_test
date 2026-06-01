import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/content/[collection]/[id]/compare.ts
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "content:read_drafts");
	if (denied) return denied;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentCompare) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	return unwrapResult(await emdash.handleContentCompare(collection, id));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
