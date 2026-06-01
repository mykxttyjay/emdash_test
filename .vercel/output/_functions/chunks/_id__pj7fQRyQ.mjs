import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { c as handleCommentDelete, b as handleCommentGet } from './comments-DxID-rsd_Cr2w6gBY.mjs';

//#region src/astro/routes/api/admin/comments/[id].ts
const prerender = false;
/**
* Get single comment detail (includes moderation_metadata)
*/
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "Comment ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		return unwrapResult(await handleCommentGet(emdash.db, id));
	} catch (error) {
		return handleError(error, "Failed to get comment", "COMMENT_GET_ERROR");
	}
};
/**
* Hard delete a comment (ADMIN only)
*/
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "Comment ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:delete");
	if (denied) return denied;
	try {
		return unwrapResult(await handleCommentDelete(emdash.db, id));
	} catch (error) {
		return handleError(error, "Failed to delete comment", "COMMENT_DELETE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
