import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { g as commentBulkBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as handleCommentBulk } from './comments-DxID-rsd_Cr2w6gBY.mjs';

//#region src/astro/routes/api/admin/comments/bulk.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		const body = await parseBody(request, commentBulkBody);
		if (isParseError(body)) return body;
		if (body.action === "delete") {
			const denied = requirePerm(user, "comments:delete");
			if (denied) return denied;
		} else {
			const denied = requirePerm(user, "comments:moderate");
			if (denied) return denied;
		}
		return unwrapResult(await handleCommentBulk(emdash.db, body.ids, body.action));
	} catch (error) {
		return handleError(error, "Failed to perform bulk operation", "COMMENT_BULK_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
