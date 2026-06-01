import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { B as BylineRepository } from './byline-CTaWkMh5_BRoEzpjM.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { c as bylineTranslationCreateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { i as invalidateBylineCache } from './bylines-BYHWU3T7_BCHhh3TY.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as handleBylineTranslations, a as handleBylineCreate } from './bylines-H0Xh5TMy_qWP1nXv6.mjs';

//#region src/astro/routes/api/admin/bylines/[id]/translations.ts
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const id = params.id;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "bylines:read");
	if (denied) return denied;
	try {
		return unwrapResult(await handleBylineTranslations(emdash.db, id));
	} catch (error) {
		return handleError(error, "Failed to fetch byline translations", "BYLINE_TRANSLATIONS_ERROR");
	}
};
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const id = params.id;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "bylines:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, bylineTranslationCreateBody);
		if (isParseError(body)) return body;
		const source = await new BylineRepository(emdash.db).findById(id);
		if (!source) return new Response(JSON.stringify({ error: {
			code: "NOT_FOUND",
			message: "Byline not found"
		} }), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
		const result = await handleBylineCreate(emdash.db, {
			slug: body.slug ?? source.slug,
			displayName: body.displayName ?? source.displayName,
			bio: body.bio ?? null,
			avatarMediaId: body.avatarMediaId ?? source.avatarMediaId,
			websiteUrl: body.websiteUrl ?? source.websiteUrl,
			userId: null,
			isGuest: source.isGuest,
			locale: body.locale,
			translationOf: id
		});
		if (result.success) /* @__PURE__ */ invalidateBylineCache();
		return unwrapResult(result, 201);
	} catch (error) {
		return handleError(error, "Failed to create byline translation", "BYLINE_TRANSLATION_CREATE_ERROR");
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
