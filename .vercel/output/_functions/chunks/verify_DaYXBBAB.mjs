import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { r as passkeyRegisterVerifyBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { v as validateAllowedOrigins, g as getConfiguredAllowedOrigins } from './allowed-origins-D0fFk9a6_Cpa6be_D.mjs';
import { a as createChallengeStore } from './challenge-store-Dng1SxKT_CKFbcTAW.mjs';
import { g as getPasskeyConfig } from './passkey-config-BloQOT3y_DqzT6Txe.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { v as verifyRegistrationResponse, r as registerPasskey } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/auth/passkey/register/verify.ts
const prerender = false;
const MAX_PASSKEYS = 10;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		if (await adapter.countCredentialsByUserId(user.id) >= MAX_PASSKEYS) return apiError("PASSKEY_LIMIT", `Maximum of ${MAX_PASSKEYS} passkeys allowed`, 400);
		const body = await parseBody(request, passkeyRegisterVerifyBody);
		if (isParseError(body)) return body;
		const url = new URL(request.url);
		const optionsRepo = new OptionsRepository(emdash.db);
		const siteName = await optionsRepo.get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl, validateAllowedOrigins(siteUrl, getConfiguredAllowedOrigins(emdash?.config)));
		const challengeStore = createChallengeStore(emdash.db);
		const verified = await verifyRegistrationResponse(passkeyConfig, body.credential, challengeStore);
		let passKeyName = body.name ?? void 0;
		if (!passKeyName) {
			const pending = await optionsRepo.get(`emdash:passkey_pending:${user.id}`);
			if (pending?.name) passKeyName = pending.name;
		}
		await optionsRepo.delete(`emdash:passkey_pending:${user.id}`);
		const credential = await registerPasskey(adapter, user.id, verified, passKeyName);
		return apiSuccess({ passkey: {
			id: credential.id,
			name: credential.name,
			deviceType: credential.deviceType,
			backedUp: credential.backedUp,
			createdAt: credential.createdAt.toISOString(),
			lastUsedAt: credential.lastUsedAt.toISOString()
		} });
	} catch (error) {
		console.error("Passkey registration verify error:", error);
		const message = error instanceof Error ? error.message : "";
		if (message.includes("credential_exists") || message.includes("already")) return apiError("CREDENTIAL_EXISTS", "This passkey is already registered", 400);
		if (message.includes("challenge") || message.includes("expired")) return apiError("CHALLENGE_EXPIRED", "Registration expired. Please try again.", 400);
		return apiError("PASSKEY_REGISTER_ERROR", "Registration failed", 500);
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
