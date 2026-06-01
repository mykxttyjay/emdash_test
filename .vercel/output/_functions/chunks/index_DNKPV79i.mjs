import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { m as inviteCreateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getSiteBaseUrl } from './site-url-xkhw1tcz_TABJtqpK.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { b as createInvite, I as InviteError } from './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/auth/invite/index.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const body = await parseBody(request, inviteCreateBody);
		if (isParseError(body)) return body;
		const role = body.role ?? Role.AUTHOR;
		const siteName = await new OptionsRepository(emdash.db).get("emdash:site_title") || "EmDash";
		const baseUrl = await getSiteBaseUrl(emdash.db, request);
		const emailSend = emdash.email?.isAvailable() ? (message) => emdash.email.send(message, "system") : void 0;
		const result = await createInvite({
			baseUrl,
			siteName,
			email: emailSend
		}, adapter, body.email, role, user.id);
		if (emailSend) return apiSuccess({
			success: true,
			message: `Invite sent to ${body.email}`
		});
		return apiSuccess({
			success: true,
			message: "Invite created. No email provider configured — share the link manually.",
			inviteUrl: result.url
		}, 200);
	} catch (error) {
		if (error instanceof InviteError) return apiError(error.code.toUpperCase(), error.message, {
			user_exists: 409,
			invalid_token: 400,
			token_expired: 400
		}[error.code] ?? 400);
		return handleError(error, "Failed to create invite", "INVITE_CREATE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
