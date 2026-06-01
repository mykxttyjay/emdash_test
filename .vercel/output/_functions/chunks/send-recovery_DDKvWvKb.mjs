import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { g as getSiteBaseUrl } from './site-url-xkhw1tcz_TABJtqpK.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { s as sendMagicLink } from './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/users/[id]/send-recovery.ts
/**
* Send recovery link endpoint
*
* POST /_emdash/api/admin/users/:id/send-recovery
*
* Admin-initiated account recovery — sends a recovery magic link to the user's email.
*/
const prerender = false;
const POST = async ({ request, params, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const { id } = params;
	if (!id) return apiError("VALIDATION_ERROR", "User ID required", 400);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		const targetUser = await adapter.getUserById(id);
		if (!targetUser) return apiError("NOT_FOUND", "User not found", 404);
		if (!emdash.email?.isAvailable()) return apiError("EMAIL_NOT_CONFIGURED", "Email is not configured. Recovery links require an email provider.", 503);
		const options = new OptionsRepository(emdash.db);
		await sendMagicLink({
			baseUrl: await getSiteBaseUrl(emdash.db, request),
			siteName: await options.get("emdash:site_title") ?? "EmDash",
			email: (message) => emdash.email.send(message, "system")
		}, adapter, targetUser.email, "recovery");
		return apiSuccess({
			success: true,
			message: "Recovery link sent"
		});
	} catch (error) {
		return handleError(error, "Failed to send recovery link", "RECOVERY_SEND_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
