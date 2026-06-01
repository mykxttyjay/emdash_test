import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { s as passkeyVerifyBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { v as validateAllowedOrigins, g as getConfiguredAllowedOrigins } from './allowed-origins-D0fFk9a6_Cpa6be_D.mjs';
import { a as createChallengeStore } from './challenge-store-Dng1SxKT_CKFbcTAW.mjs';
import { g as getPasskeyConfig } from './passkey-config-BloQOT3y_DqzT6Txe.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { f as authenticateWithPasskey, P as PasskeyAuthenticationError } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/auth/passkey/verify.ts
const prerender = false;
const POST = async ({ request, locals, session }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, passkeyVerifyBody);
		if (isParseError(body)) return body;
		const url = new URL(request.url);
		const siteName = await new OptionsRepository(emdash.db).get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl, validateAllowedOrigins(siteUrl, getConfiguredAllowedOrigins(emdash?.config)));
		const adapter = createKyselyAdapter(emdash.db);
		const challengeStore = createChallengeStore(emdash.db);
		const user = await authenticateWithPasskey(passkeyConfig, adapter, body.credential, challengeStore);
		if (session) session.set("user", { id: user.id });
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
		if (error instanceof PasskeyAuthenticationError) return apiError("UNAUTHORIZED", "Authentication failed", 401);
		return handleError(error, "Authentication failed", "PASSKEY_VERIFY_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
