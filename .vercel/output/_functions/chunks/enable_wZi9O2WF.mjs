import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { t as FTSManager } from './fts-manager-Mnrtn-r2_V9gjL7bx.mjs';
import './request-context_COpWwYmK.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ab as searchEnableBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/search/enable.ts
const prerender = false;
/**
* Enable or disable search for a collection
*
* Body:
* - collection: Collection slug (required)
* - enabled: boolean (required)
* - weights: Optional field weights for ranking
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const denied = requirePerm(user, "search:manage");
	if (denied) return denied;
	const body = await parseBody(request, searchEnableBody);
	if (isParseError(body)) return body;
	const ftsManager = new FTSManager(emdash.db);
	try {
		if (body.enabled) {
			await ftsManager.enableSearch(body.collection, { weights: body.weights });
			const stats = await ftsManager.getIndexStats(body.collection);
			return apiSuccess({
				collection: body.collection,
				enabled: true,
				indexed: stats?.indexed ?? 0
			});
		} else {
			await ftsManager.disableSearch(body.collection);
			return apiSuccess({
				collection: body.collection,
				enabled: false
			});
		}
	} catch (error) {
		return handleError(error, "Failed to update search config", "SEARCH_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
