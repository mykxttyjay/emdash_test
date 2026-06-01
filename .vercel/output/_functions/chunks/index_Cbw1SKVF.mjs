import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { i as commentListQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { d as handleCommentInbox } from './comments-DxID-rsd_Cr2w6gBY.mjs';

//#region src/astro/routes/api/admin/comments/index.ts
const prerender = false;
/**
* List comments for moderation inbox
*/
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "comments:moderate");
	if (denied) return denied;
	try {
		const query = parseQuery(url, commentListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleCommentInbox(emdash.db, {
			status: query.status,
			collection: query.collection,
			search: query.search,
			limit: query.limit,
			cursor: query.cursor
		}));
	} catch (error) {
		return handleError(error, "Failed to list comments", "COMMENT_INBOX_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
