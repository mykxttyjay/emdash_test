import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { t as passkeyRenameBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';

//#region src/astro/routes/api/auth/passkey/[id].ts
const prerender = false;
/**
* PATCH - Rename a passkey
*/
const PATCH = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	if (!id) return apiError("MISSING_PARAM", "Passkey ID is required", 400);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const credential = await adapter.getCredentialById(id);
		if (!credential || credential.userId !== user.id) return apiError("NOT_FOUND", "Passkey not found", 404);
		const body = await parseBody(request, passkeyRenameBody);
		if (isParseError(body)) return body;
		const trimmedName = body.name.trim() || null;
		await adapter.updateCredentialName(id, trimmedName);
		return apiSuccess({ passkey: {
			id: credential.id,
			name: trimmedName,
			deviceType: credential.deviceType,
			backedUp: credential.backedUp,
			createdAt: credential.createdAt.toISOString(),
			lastUsedAt: credential.lastUsedAt.toISOString()
		} });
	} catch (error) {
		return handleError(error, "Failed to rename passkey", "PASSKEY_RENAME_ERROR");
	}
};
/**
* DELETE - Remove a passkey
*/
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	if (!id) return apiError("MISSING_PARAM", "Passkey ID is required", 400);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const credential = await adapter.getCredentialById(id);
		if (!credential || credential.userId !== user.id) return apiError("NOT_FOUND", "Passkey not found", 404);
		if (await adapter.countCredentialsByUserId(user.id) <= 1) return apiError("LAST_PASSKEY", "Cannot remove your last passkey", 400);
		await adapter.deleteCredential(id);
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to delete passkey", "PASSKEY_DELETE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	PATCH,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
