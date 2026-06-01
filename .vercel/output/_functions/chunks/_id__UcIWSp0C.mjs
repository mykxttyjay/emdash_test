import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import './index_CZ_O-7V7.mjs';
import { h as handleApiTokenRevoke } from './api-tokens-ucpcNXDt_DNhUyfCd.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/api-tokens/[id].ts
/**
* Single API token endpoint
*
* DELETE /_emdash/api/admin/api-tokens/:id — Revoke a token
*/
const prerender = false;
/**
* Revoke (delete) an API token.
*/
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const tokenId = params.id;
	if (!tokenId) return apiError("VALIDATION_ERROR", "Token ID is required", 400);
	try {
		return unwrapResult(await handleApiTokenRevoke(emdash.db, tokenId, user.id));
	} catch (error) {
		return handleError(error, "Failed to revoke API token", "TOKEN_REVOKE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
