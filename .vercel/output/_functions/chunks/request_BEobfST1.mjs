import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { w as signupRequestBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getTrustedProxyHeaders } from './trusted-proxy-97pajC2f_jQH5p4aV.mjs';
import { g as getSiteBaseUrl } from './site-url-xkhw1tcz_TABJtqpK.mjs';
import { g as getClientIp, c as checkRateLimit } from './rate-limit-D_-gAeJ0_BFjvf0uK.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { r as requestSignup } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/auth/signup/request.ts
const prerender = false;
const GENERIC_SUCCESS = {
	success: true,
	message: "If your email domain is allowed, you'll receive a verification email."
};
const POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!emdash.email?.isAvailable()) return apiError("EMAIL_NOT_CONFIGURED", "Email not configured. Self-signup is unavailable.", 503);
	try {
		const body = await parseBody(request, signupRequestBody);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "signup/request", 3, 300)).allowed) return apiSuccess(GENERIC_SUCCESS);
		const adapter = createKyselyAdapter(emdash.db);
		const siteName = await new OptionsRepository(emdash.db).get("emdash:site_title") || "EmDash";
		await requestSignup({
			baseUrl: await getSiteBaseUrl(emdash.db, request),
			siteName,
			email: (message) => emdash.email.send(message, "system")
		}, adapter, body.email.toLowerCase().trim());
		return apiSuccess(GENERIC_SUCCESS);
	} catch (error) {
		console.error("Signup request error:", error);
		return apiSuccess(GENERIC_SUCCESS);
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
