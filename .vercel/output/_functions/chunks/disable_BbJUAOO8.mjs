import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { w as withTransaction } from './transaction-NQj4VJ7Z_CWeepMQn.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/users/[id]/disable.ts
/**
* User disable endpoint
*
* POST /_emdash/api/admin/users/:id/disable - Soft-disable a user
*/
const prerender = false;
const POST = async ({ params, locals }) => {
	const { emdash, user: currentUser } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!currentUser || currentUser.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "User ID required", 400);
	if (id === currentUser.id) return apiError("VALIDATION_ERROR", "Cannot disable your own account", 400);
	try {
		const targetUser = await adapter.getUserById(id);
		if (!targetUser) return apiError("NOT_FOUND", "User not found", 404);
		if (await withTransaction(emdash.db, async (trx) => {
			const trxAdapter = createKyselyAdapter(trx);
			if (targetUser.role === Role.ADMIN) {
				if (await trxAdapter.countAdmins() <= 1) return true;
			}
			await trxAdapter.updateUser(id, { disabled: true });
			return false;
		})) return apiError("VALIDATION_ERROR", "Cannot disable the last admin. Promote another user first.", 400);
		await emdash.db.deleteFrom("_emdash_oauth_tokens").where("user_id", "=", id).execute();
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to disable user", "USER_DISABLE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
