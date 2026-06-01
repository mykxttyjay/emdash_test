import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as hasPermission } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/content/[collection]/[id]/translations.ts
/**
* Content translations endpoint
*
* GET /_emdash/api/content/{collection}/{id}/translations
*
* Returns all locale variants linked to the same translation group.
*/
const prerender = false;
function isPublished(t) {
	return typeof t === "object" && t !== null && "status" in t && t.status === "published";
}
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	const collection = params.collection;
	const id = params.id;
	if (!emdash?.handleContentTranslations) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const result = await emdash.handleContentTranslations(collection, id);
	if (result.success && !hasPermission(user, "content:read_drafts")) {
		const data = result.data && typeof result.data === "object" ? result.data : void 0;
		const filtered = (Array.isArray(data?.translations) ? data.translations : []).filter(isPublished);
		return unwrapResult({
			success: true,
			data: {
				...data,
				translations: filtered
			}
		});
	}
	return unwrapResult(result);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
