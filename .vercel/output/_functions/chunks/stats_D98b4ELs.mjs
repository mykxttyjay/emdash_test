import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { i as getSearchStats } from './search-By-NN3da_BHnv-BlX.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/search/stats.ts
const prerender = false;
/**
* Get search index statistics
*/
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "search:manage");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	try {
		return apiSuccess(await getSearchStats(emdash.db));
	} catch (error) {
		return handleError(error, "Failed to get stats", "STATS_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
