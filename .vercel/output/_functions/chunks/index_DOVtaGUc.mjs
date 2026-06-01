import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { B as BylineRepository } from './byline-CTaWkMh5_BRoEzpjM.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { d as bylineUpdateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { i as invalidateBylineCache } from './bylines-BYHWU3T7_BCHhh3TY.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/admin/bylines/[id]/index.ts
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "bylines:read");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const byline = await new BylineRepository(emdash.db).findById(params.id);
		if (!byline) return apiError("NOT_FOUND", "Byline not found", 404);
		return apiSuccess(byline);
	} catch (error) {
		return handleError(error, "Failed to get byline", "BYLINE_GET_ERROR");
	}
};
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const body = await parseBody(request, bylineUpdateBody);
	if (isParseError(body)) return body;
	try {
		const byline = await new BylineRepository(emdash.db).update(params.id, {
			slug: body.slug,
			displayName: body.displayName,
			bio: body.bio ?? null,
			avatarMediaId: body.avatarMediaId ?? null,
			websiteUrl: body.websiteUrl ?? null,
			userId: body.userId ?? null,
			isGuest: body.isGuest
		});
		if (!byline) return apiError("NOT_FOUND", "Byline not found", 404);
		/* @__PURE__ */ invalidateBylineCache();
		return apiSuccess(byline);
	} catch (error) {
		return handleError(error, "Failed to update byline", "BYLINE_UPDATE_ERROR");
	}
};
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		if (!await new BylineRepository(emdash.db).delete(params.id)) return apiError("NOT_FOUND", "Byline not found", 404);
		/* @__PURE__ */ invalidateBylineCache();
		return apiSuccess({ deleted: true });
	} catch (error) {
		return handleError(error, "Failed to delete byline", "BYLINE_DELETE_ERROR");
	}
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
