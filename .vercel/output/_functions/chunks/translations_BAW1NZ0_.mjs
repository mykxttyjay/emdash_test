import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { a as handleTermGet, s as handleTermTranslations, r as handleTermCreate } from './taxonomies-CLs9HPE2_BQA_DL6v.mjs';
import { a as apiError, r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/taxonomies/[name]/terms/[slug]/translations.ts
const prerender = false;
const createTermTranslationBody = z.object({
	locale: z.string().min(1),
	label: z.string().min(1).optional(),
	slug: z.string().min(1).optional()
}).meta({ id: "CreateTermTranslationBody" });
const GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name, slug } = params;
	if (!name || !slug) return apiError("VALIDATION_ERROR", "Taxonomy name and slug required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:read");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		const anchor = await handleTermGet(emdash.db, name, slug, { locale: query.locale });
		if (!anchor.success) return unwrapResult(anchor);
		return unwrapResult(await handleTermTranslations(emdash.db, anchor.data.term.id));
	} catch (error) {
		return handleError(error, "Failed to list term translations", "TERM_TRANSLATIONS_ERROR");
	}
};
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { name, slug } = params;
	if (!name || !slug) return apiError("VALIDATION_ERROR", "Taxonomy name and slug required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "taxonomies:manage");
	if (denied) return denied;
	const query = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(query)) return query;
	try {
		const body = await parseBody(request, createTermTranslationBody);
		if (isParseError(body)) return body;
		const source = await handleTermGet(emdash.db, name, slug, { locale: query.locale });
		if (!source.success) return unwrapResult(source);
		return unwrapResult(await handleTermCreate(emdash.db, name, {
			slug: body.slug ?? source.data.term.slug,
			label: body.label ?? source.data.term.label,
			parentId: source.data.term.parentId,
			description: source.data.term.description,
			locale: body.locale,
			translationOf: source.data.term.id
		}), 201);
	} catch (error) {
		return handleError(error, "Failed to create term translation", "TERM_TRANSLATION_CREATE_ERROR");
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
