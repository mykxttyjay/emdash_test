import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as handleMenuGet, l as handleMenuTranslations, t as handleMenuCreate } from './menus-Bjf5R1Qq_BkGIWiJ8.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { V as localeFilterQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/menus/[name]/translations.ts
const prerender = false;
const createTranslationBody = z.object({
	locale: z.string().min(1),
	label: z.string().min(1).optional()
}).meta({ id: "CreateMenuTranslationBody" });
const GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "menus:read");
	if (denied) return denied;
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const anchor = await handleMenuGet(emdash.db, name, { locale: localeQ.locale });
		if (!anchor.success) return unwrapResult(anchor);
		return unwrapResult(await handleMenuTranslations(emdash.db, anchor.data.id));
	} catch (error) {
		return handleError(error, "Failed to fetch menu translations", "MENU_TRANSLATIONS_ERROR");
	}
};
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const name = params.name;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const denied = requirePerm(user, "menus:manage");
	if (denied) return denied;
	const localeQ = parseQuery(new URL(request.url), localeFilterQuery);
	if (isParseError(localeQ)) return localeQ;
	try {
		const body = await parseBody(request, createTranslationBody);
		if (isParseError(body)) return body;
		const source = await handleMenuGet(emdash.db, name, { locale: localeQ.locale });
		if (!source.success) return unwrapResult(source);
		return unwrapResult(await handleMenuCreate(emdash.db, {
			name,
			label: body.label ?? source.data.label,
			locale: body.locale,
			translationOf: source.data.id
		}), 201);
	} catch (error) {
		return handleError(error, "Failed to create menu translation", "MENU_TRANSLATION_CREATE_ERROR");
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
