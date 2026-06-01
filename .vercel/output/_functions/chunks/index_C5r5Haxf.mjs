import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { w as withTransaction } from './transaction-NQj4VJ7Z_CWeepMQn.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { u as userUpdateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/users/[id]/index.ts
/**
* User management detail endpoint
*
* GET /_emdash/api/admin/users/:id - Get user details
* PUT /_emdash/api/admin/users/:id - Update user
*/
const prerender = false;
const GET = async ({ params, locals }) => {
	const { emdash, user: currentUser } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!currentUser || currentUser.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("MISSING_PARAM", "User ID required", 400);
	try {
		const result = await adapter.getUserWithDetails(id);
		if (!result) return apiError("NOT_FOUND", "User not found", 404);
		return apiSuccess({ item: {
			id: result.user.id,
			email: result.user.email,
			name: result.user.name,
			avatarUrl: result.user.avatarUrl,
			role: result.user.role,
			emailVerified: result.user.emailVerified,
			disabled: result.user.disabled,
			createdAt: result.user.createdAt.toISOString(),
			updatedAt: result.user.updatedAt.toISOString(),
			lastLogin: result.lastLogin?.toISOString() ?? null,
			credentials: result.credentials.map((c) => ({
				id: c.id,
				name: c.name,
				deviceType: c.deviceType,
				createdAt: c.createdAt.toISOString(),
				lastUsedAt: c.lastUsedAt.toISOString()
			})),
			oauthAccounts: result.oauthAccounts.map((a) => ({
				provider: a.provider,
				createdAt: a.createdAt.toISOString()
			}))
		} });
	} catch (error) {
		return handleError(error, "Failed to get user details", "USER_DETAIL_ERROR");
	}
};
const PUT = async ({ params, request, locals }) => {
	const { emdash, user: currentUser } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!currentUser || currentUser.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("MISSING_PARAM", "User ID required", 400);
	try {
		const targetUser = await adapter.getUserById(id);
		if (!targetUser) return apiError("NOT_FOUND", "User not found", 404);
		const body = await parseBody(request, userUpdateBody);
		if (isParseError(body)) return body;
		const role = body.role;
		if (role !== void 0 && id === currentUser.id) return apiError("SELF_ROLE_CHANGE", "Cannot change your own role", 400);
		if (body.email && body.email !== targetUser.email) {
			if (await adapter.getUserByEmail(body.email)) return apiError("EMAIL_IN_USE", "Email already in use", 409);
		}
		const isDemotingAdmin = role !== void 0 && role < Role.ADMIN && targetUser.role === Role.ADMIN;
		if (await withTransaction(emdash.db, async (trx) => {
			const trxAdapter = createKyselyAdapter(trx);
			if (isDemotingAdmin) {
				if (await trxAdapter.countAdmins() <= 1) return true;
			}
			await trxAdapter.updateUser(id, {
				name: body.name,
				email: body.email,
				role
			});
			return false;
		})) return apiError("LAST_ADMIN", "Cannot demote the last admin. Promote another user first.", 400);
		const updated = await adapter.getUserById(id);
		return apiSuccess({ item: {
			id: updated.id,
			email: updated.email,
			name: updated.name,
			avatarUrl: updated.avatarUrl,
			role: updated.role,
			emailVerified: updated.emailVerified,
			disabled: updated.disabled,
			createdAt: updated.createdAt.toISOString(),
			updatedAt: updated.updatedAt.toISOString()
		} });
	} catch (error) {
		return handleError(error, "Failed to update user", "USER_UPDATE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	PUT,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
