import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { h as handleOAuthClientDelete, a as handleOAuthClientGet, b as handleOAuthClientUpdate } from './oauth-clients-eJCbkVSG_DJG3TwI7.mjs';
import { z } from 'zod';
import './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/oauth-clients/[id].ts
/**
* Single OAuth client endpoints
*
* GET    /_emdash/api/admin/oauth-clients/:id — Get a client
* PUT    /_emdash/api/admin/oauth-clients/:id — Update a client
* DELETE /_emdash/api/admin/oauth-clients/:id — Delete a client
*/
const prerender = false;
const updateClientSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	redirectUris: z.array(z.string().url("Each redirect URI must be a valid URL")).min(1, "At least one redirect URI is required").optional(),
	scopes: z.array(z.string()).nullable().optional()
});
/**
* Get a single OAuth client.
*/
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const clientId = params.id;
	if (!clientId) return apiError("VALIDATION_ERROR", "Client ID is required", 400);
	return unwrapResult(await handleOAuthClientGet(emdash.db, clientId));
};
/**
* Update an OAuth client.
*/
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const clientId = params.id;
	if (!clientId) return apiError("VALIDATION_ERROR", "Client ID is required", 400);
	try {
		const body = await parseBody(request, updateClientSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleOAuthClientUpdate(emdash.db, clientId, body));
	} catch (error) {
		return handleError(error, "Failed to update OAuth client", "CLIENT_UPDATE_ERROR");
	}
};
/**
* Delete an OAuth client.
*/
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const clientId = params.id;
	if (!clientId) return apiError("VALIDATION_ERROR", "Client ID is required", 400);
	try {
		return unwrapResult(await handleOAuthClientDelete(emdash.db, clientId));
	} catch (error) {
		return handleError(error, "Failed to delete OAuth client", "CLIENT_DELETE_ERROR");
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
