import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import './index_CZ_O-7V7.mjs';
import { b as handleApiTokenList, c as handleApiTokenCreate } from './api-tokens-ucpcNXDt_DNhUyfCd.mjs';
import { z } from 'zod';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';
import { V as VALID_SCOPES } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/admin/api-tokens/index.ts
/**
* API token management endpoints
*
* GET  /_emdash/api/admin/api-tokens — List tokens for current user
* POST /_emdash/api/admin/api-tokens — Create a new token
*/
const prerender = false;
const createTokenSchema = z.object({
	name: z.string().min(1).max(100),
	scopes: z.array(z.enum(VALID_SCOPES)).min(1),
	expiresAt: z.string().datetime().optional()
});
/**
* List API tokens for the current user.
* Admins can list all tokens (future: add ?userId= filter).
*/
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	return unwrapResult(await handleApiTokenList(emdash.db, user.id));
};
/**
* Create a new API token.
* Returns the raw token once — it cannot be retrieved again.
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	try {
		const body = await parseBody(request, createTokenSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleApiTokenCreate(emdash.db, user.id, body), 201);
	} catch (error) {
		return handleError(error, "Failed to create API token", "TOKEN_CREATE_ERROR");
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
