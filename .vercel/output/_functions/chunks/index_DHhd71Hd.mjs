import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ae as searchQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { c as searchWithDb } from './search-By-NN3da_BHnv-BlX.mjs';
import { h as hasPermission } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/search/index.ts
/**
* Search endpoint - Full-text search across collections
*
* GET /_emdash/api/search?q=query&collections=posts,pages&limit=20
*/
const prerender = false;
/**
* Search content
*
* Query parameters:
* - q: Search query (required)
* - collections: Comma-separated list of collection slugs (optional, defaults to all)
* - status: Filter by status (optional, defaults to 'published')
* - limit: Maximum results (optional, defaults to 20)
*/
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const query = parseQuery(url, searchQuery);
	if (isParseError(query)) return query;
	const collections = query.collections ? query.collections.split(",").map((c) => c.trim()) : void 0;
	const status = query.status && query.status !== "published" && hasPermission(user, "content:read_drafts") ? query.status : "published";
	try {
		await emdash.ensureSearchHealthy?.();
		return apiSuccess(await searchWithDb(emdash.db, query.q, {
			collections,
			status,
			locale: query.locale,
			limit: query.limit
		}));
	} catch (error) {
		return handleError(error, "Search failed", "SEARCH_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
