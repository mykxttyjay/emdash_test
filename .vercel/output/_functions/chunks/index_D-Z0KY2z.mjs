import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/revisions/[revisionId]/index.ts
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const revisionId = params.revisionId;
	const denied = requirePerm(user, "content:read_drafts");
	if (denied) return denied;
	if (!emdash?.handleRevisionGet) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	return unwrapResult(await emdash.handleRevisionGet(revisionId));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
