import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ak as setupAdminBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { a as createChallengeStore } from './challenge-store-Dng1SxKT_CKFbcTAW.mjs';
import { g as getPasskeyConfig } from './passkey-config-BloQOT3y_DqzT6Txe.mjs';
import { S as SETUP_NONCE_COOKIE, a as SETUP_NONCE_MAX_AGE_SECONDS } from './setup-nonce-DXuriHsg_Zu_f653A.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { j as generateToken, d as generateRegistrationOptions } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/setup/admin.ts
const prerender = false;
const POST = async ({ cookies, request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const options = new OptionsRepository(emdash.db);
		const setupComplete = await options.get("emdash:setup_complete");
		if (setupComplete === true || setupComplete === "true") return apiError("SETUP_COMPLETE", "Setup already complete", 400);
		if (await createKyselyAdapter(emdash.db).countUsers() > 0) return apiError("ADMIN_EXISTS", "Admin user already exists", 400);
		const body = await parseBody(request, setupAdminBody);
		if (isParseError(body)) return body;
		const existingState = await options.get("emdash:setup_state");
		const nonce = generateToken();
		const url = new URL(request.url);
		const siteName = await options.get("emdash:site_title") ?? void 0;
		const siteUrl = getPublicOrigin(url, emdash?.config);
		const passkeyConfig = getPasskeyConfig(url, siteName, siteUrl);
		const challengeStore = createChallengeStore(emdash.db);
		const tempUser = {
			id: `setup-${Date.now()}`,
			email: body.email.toLowerCase(),
			name: body.name || null
		};
		const registrationOptions = await generateRegistrationOptions(passkeyConfig, tempUser, [], challengeStore);
		await options.set("emdash:setup_state", {
			...existingState,
			step: "admin",
			email: body.email.toLowerCase(),
			name: body.name || null,
			tempUserId: tempUser.id,
			nonce
		});
		const publicOrigin = new URL(siteUrl);
		cookies.set(SETUP_NONCE_COOKIE, nonce, {
			path: "/_emdash/",
			httpOnly: true,
			sameSite: "strict",
			secure: publicOrigin.protocol === "https:",
			maxAge: SETUP_NONCE_MAX_AGE_SECONDS
		});
		return apiSuccess({
			success: true,
			options: registrationOptions
		});
	} catch (error) {
		return handleError(error, "Failed to create admin", "SETUP_ADMIN_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
