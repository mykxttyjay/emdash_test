import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { aj as setupAdminVerifyBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { v as validateAllowedOrigins, g as getConfiguredAllowedOrigins } from './allowed-origins-D0fFk9a6_Cpa6be_D.mjs';
import { a as createChallengeStore } from './challenge-store-Dng1SxKT_CKFbcTAW.mjs';
import { g as getPasskeyConfig } from './passkey-config-BloQOT3y_DqzT6Txe.mjs';
import { S as SETUP_NONCE_COOKIE } from './setup-nonce-DXuriHsg_Zu_f653A.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { s as secureCompare, v as verifyRegistrationResponse, r as registerPasskey } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/setup/admin-verify.ts
const prerender = false;
const POST = async ({ cookies, request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const options = new OptionsRepository(emdash.db);
		const setupComplete = await options.get("emdash:setup_complete");
		if (setupComplete === true || setupComplete === "true") return apiError("SETUP_COMPLETE", "Setup already complete", 400);
		const adapter = createKyselyAdapter(emdash.db);
		if (await adapter.countUsers() > 0) return apiError("ADMIN_EXISTS", "Admin user already exists", 400);
		const setupState = await options.get("emdash:setup_state");
		if (!setupState || setupState.step !== "admin") return apiError("INVALID_STATE", "Invalid setup state. Please restart setup.", 400);
		const cookieNonce = cookies.get(SETUP_NONCE_COOKIE)?.value;
		if (!setupState.nonce || !cookieNonce || !secureCompare(cookieNonce, setupState.nonce)) return apiError("INVALID_STATE", "Setup session expired or tampered with. Please restart the admin step.", 400);
		if (!setupState.email) return apiError("INVALID_STATE", "Invalid setup state. Please restart setup.", 400);
		const body = await parseBody(request, setupAdminVerifyBody);
		if (isParseError(body)) return body;
		const url = new URL(request.url);
		const siteName = await options.get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl, validateAllowedOrigins(siteUrl, getConfiguredAllowedOrigins(emdash?.config)));
		const challengeStore = createChallengeStore(emdash.db);
		const verified = await verifyRegistrationResponse(passkeyConfig, body.credential, challengeStore);
		const user = await adapter.createUser({
			email: setupState.email,
			name: setupState.name ?? null,
			role: Role.ADMIN,
			emailVerified: false
		});
		await registerPasskey(adapter, user.id, verified, "Setup passkey");
		await options.set("emdash:setup_complete", true);
		await options.delete("emdash:setup_state");
		cookies.delete(SETUP_NONCE_COOKIE, { path: "/_emdash/" });
		return apiSuccess({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role
			}
		});
	} catch (error) {
		return handleError(error, "Failed to verify admin setup", "SETUP_VERIFY_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
