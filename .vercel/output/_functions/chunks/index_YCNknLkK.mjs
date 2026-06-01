import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';
import { c as handleSectionList, d as handleSectionCreate } from './sections-DcBIlOq1_Cyps-PBC.mjs';
import { r as requireDb, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError, p as parseBody } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ag as sectionsListQuery, ah as createSectionBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/sections/index.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "sections:read");
	if (denied) return denied;
	try {
		const query = parseQuery(url, sectionsListQuery);
		if (isParseError(query)) return query;
		return unwrapResult(await handleSectionList(db, query));
	} catch (error) {
		return handleError(error, "Failed to fetch sections", "SECTION_LIST_ERROR");
	}
};
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	const db = emdash.db;
	const denied = requirePerm(user, "sections:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createSectionBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleSectionCreate(db, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create section", "SECTION_CREATE_ERROR");
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
