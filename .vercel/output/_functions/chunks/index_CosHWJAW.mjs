import { g as getI18nConfig } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { B as BylineRepository } from './byline-CTaWkMh5_BRoEzpjM.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { a as apiError, b as apiSuccess, h as handleError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { e as bylinesListQuery, f as bylineCreateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { i as invalidateBylineCache } from './bylines-BYHWU3T7_BCHhh3TY.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { a as handleBylineCreate } from './bylines-H0Xh5TMy_qWP1nXv6.mjs';

//#region src/astro/routes/api/admin/bylines/index.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "bylines:read");
	if (denied) return denied;
	const query = parseQuery(url, bylinesListQuery);
	if (isParseError(query)) return query;
	const i18n = getI18nConfig();
	if (query.locale && i18n && !i18n.locales.includes(query.locale)) return apiError("VALIDATION_ERROR", `Locale "${query.locale}" is not configured for this site`, 400);
	try {
		return apiSuccess(await new BylineRepository(emdash.db).findMany({
			search: query.search,
			isGuest: query.isGuest,
			userId: query.userId,
			locale: query.locale,
			cursor: query.cursor,
			limit: query.limit
		}));
	} catch (error) {
		return handleError(error, "Failed to list bylines", "BYLINE_LIST_ERROR");
	}
};
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	const body = await parseBody(request, bylineCreateBody);
	if (isParseError(body)) return body;
	try {
		const result = await handleBylineCreate(emdash.db, {
			slug: body.slug,
			displayName: body.displayName,
			bio: body.bio ?? null,
			avatarMediaId: body.avatarMediaId ?? null,
			websiteUrl: body.websiteUrl ?? null,
			userId: body.userId ?? null,
			isGuest: body.isGuest,
			locale: body.locale,
			translationOf: body.translationOf
		});
		if (result.success) /* @__PURE__ */ invalidateBylineCache();
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to create byline", "BYLINE_CREATE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
