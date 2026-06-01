import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ad as searchSuggestQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { a as getSuggestions } from './search-By-NN3da_BHnv-BlX.mjs';

//#region src/astro/routes/api/search/suggest.ts
const prerender = false;
/**
* Get search suggestions for autocomplete
*
* Query parameters:
* - q: Partial search query (required)
* - collections: Comma-separated list of collection slugs (optional)
* - limit: Maximum suggestions (optional, defaults to 5)
*/
const GET = async ({ url, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const query = parseQuery(url, searchSuggestQuery);
	if (isParseError(query)) return query;
	const collections = query.collections ? query.collections.split(",").map((c) => c.trim()) : void 0;
	try {
		await emdash.ensureSearchHealthy?.();
		return apiSuccess({ items: await getSuggestions(emdash.db, query.q, {
			collections,
			locale: query.locale,
			limit: query.limit
		}) });
	} catch (error) {
		return handleError(error, "Failed to get suggestions", "SUGGESTION_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
