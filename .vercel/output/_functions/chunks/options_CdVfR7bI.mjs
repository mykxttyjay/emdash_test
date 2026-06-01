import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { b as parseOptionalBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { p as passkeyOptionsBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getTrustedProxyHeaders } from './trusted-proxy-97pajC2f_jQH5p4aV.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { c as cleanupExpiredChallenges, a as createChallengeStore } from './challenge-store-Dng1SxKT_CKFbcTAW.mjs';
import { g as getPasskeyConfig } from './passkey-config-BloQOT3y_DqzT6Txe.mjs';
import { g as getClientIp, c as checkRateLimit, r as rateLimitResponse } from './rate-limit-D_-gAeJ0_BFjvf0uK.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { e as generateAuthenticationOptions } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/auth/passkey/options.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		cleanupExpiredChallenges(emdash.db).catch(() => {});
		const body = await parseOptionalBody(request, passkeyOptionsBody, {});
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "passkey/options", 10, 60)).allowed) return rateLimitResponse(60);
		const adapter = createKyselyAdapter(emdash.db);
		let credentials = [];
		if (body.email) {
			const user = await adapter.getUserByEmail(body.email);
			if (user) credentials = await adapter.getCredentialsByUserId(user.id);
		}
		const url = new URL(request.url);
		const passkeyConfig = getPasskeyConfig(url, await new OptionsRepository(emdash.db).get("emdash:site_title") ?? void 0, getPublicOrigin(url, emdash?.config));
		const challengeStore = createChallengeStore(emdash.db);
		return apiSuccess({
			success: true,
			options: await generateAuthenticationOptions(passkeyConfig, credentials, challengeStore)
		});
	} catch (error) {
		return handleError(error, "Failed to generate passkey options", "PASSKEY_OPTIONS_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
