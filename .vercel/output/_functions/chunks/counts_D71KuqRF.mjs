import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { a as handleCommentCounts } from './comments-DxID-rsd_Cr2w6gBY.mjs';

//#region src/astro/routes/api/admin/comments/counts.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		return unwrapResult(await handleCommentCounts(emdash.db));
	} catch (error) {
		return handleError(error, "Failed to get comment counts", "COMMENT_COUNTS_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
