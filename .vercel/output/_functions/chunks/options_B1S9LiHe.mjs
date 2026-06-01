import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { b as parseOptionalBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { q as passkeyRegisterOptionsBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { a as createChallengeStore } from './challenge-store-Dng1SxKT_CKFbcTAW.mjs';
import { g as getPasskeyConfig } from './passkey-config-BloQOT3y_DqzT6Txe.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { d as generateRegistrationOptions } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/auth/passkey/register/options.ts
const prerender = false;
const MAX_PASSKEYS = 10;
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	try {
		const adapter = createKyselyAdapter(emdash.db);
		if (await adapter.countCredentialsByUserId(user.id) >= MAX_PASSKEYS) return apiError("PASSKEY_LIMIT", `Maximum of ${MAX_PASSKEYS} passkeys allowed`, 400);
		const body = await parseOptionalBody(request, passkeyRegisterOptionsBody, {});
		if (isParseError(body)) return body;
		const existingCredentials = await adapter.getCredentialsByUserId(user.id);
		const url = new URL(request.url);
		const optionsRepo = new OptionsRepository(emdash.db);
		const passkeyConfig = getPasskeyConfig(url, await optionsRepo.get("emdash:site_title") ?? void 0, getPublicOrigin(url, emdash?.config));
		const challengeStore = createChallengeStore(emdash.db);
		const registrationOptions = await generateRegistrationOptions(passkeyConfig, {
			id: user.id,
			email: user.email,
			name: user.name
		}, existingCredentials, challengeStore);
		if (body.name) await optionsRepo.set(`emdash:passkey_pending:${user.id}`, { name: body.name });
		return apiSuccess({ options: registrationOptions });
	} catch (error) {
		return handleError(error, "Failed to generate registration options", "PASSKEY_REGISTER_OPTIONS_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
