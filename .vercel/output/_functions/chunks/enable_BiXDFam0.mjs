import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/users/[id]/enable.ts
/**
* User enable endpoint
*
* POST /_emdash/api/admin/users/:id/enable - Re-enable a disabled user
*/
const prerender = false;
const POST = async ({ params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "User ID required", 400);
	try {
		if (!await adapter.getUserById(id)) return apiError("NOT_FOUND", "User not found", 404);
		await adapter.updateUser(id, { disabled: false });
		return apiSuccess({ success: true });
	} catch (error) {
		return handleError(error, "Failed to enable user", "USER_ENABLE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
