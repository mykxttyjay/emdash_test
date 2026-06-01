import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';
import { h as handleSectionDelete, a as handleSectionGet, b as handleSectionUpdate } from './sections-DcBIlOq1_Cyps-PBC.mjs';
import { r as requireDb, a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { af as updateSectionBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/sections/[slug].ts
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { slug } = params;
	const denied = requirePerm(user, "sections:read");
	if (denied) return denied;
	if (!slug) return apiError("VALIDATION_ERROR", "slug is required", 400);
	try {
		return unwrapResult(await handleSectionGet(db, slug));
	} catch (error) {
		return handleError(error, "Failed to fetch section", "SECTION_GET_ERROR");
	}
};
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { slug } = params;
	const denied = requirePerm(user, "sections:manage");
	if (denied) return denied;
	if (!slug) return apiError("VALIDATION_ERROR", "slug is required", 400);
	try {
		const body = await parseBody(request, updateSectionBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleSectionUpdate(db, slug, body));
	} catch (error) {
		return handleError(error, "Failed to update section", "SECTION_UPDATE_ERROR");
	}
};
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const { slug } = params;
	const denied = requirePerm(user, "sections:manage");
	if (denied) return denied;
	if (!slug) return apiError("VALIDATION_ERROR", "slug is required", 400);
	try {
		return unwrapResult(await handleSectionDelete(db, slug));
	} catch (error) {
		return handleError(error, "Failed to delete section", "SECTION_DELETE_ERROR");
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
