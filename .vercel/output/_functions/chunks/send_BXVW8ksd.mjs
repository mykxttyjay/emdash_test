import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { n as magicLinkSendBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as getTrustedProxyHeaders } from './trusted-proxy-97pajC2f_jQH5p4aV.mjs';
import { g as getSiteBaseUrl } from './site-url-xkhw1tcz_TABJtqpK.mjs';
import { g as getClientIp, c as checkRateLimit } from './rate-limit-D_-gAeJ0_BFjvf0uK.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { s as sendMagicLink } from './index_CZ_O-7V7.mjs';

//#region src/astro/routes/api/auth/magic-link/send.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, magicLinkSendBody);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "magic-link/send", 3, 300)).allowed) return apiSuccess({
			success: true,
			message: "If an account exists for this email, a magic link has been sent."
		});
		if (!emdash.email?.isAvailable()) return apiError("EMAIL_NOT_CONFIGURED", "Email is not configured. Magic link authentication requires an email provider.", 503);
		const options = new OptionsRepository(emdash.db);
		await sendMagicLink({
			baseUrl: await getSiteBaseUrl(emdash.db, request),
			siteName: await options.get("emdash:site_title") ?? "EmDash",
			email: (message) => emdash.email.send(message, "system")
		}, createKyselyAdapter(emdash.db), body.email.toLowerCase());
		return apiSuccess({
			success: true,
			message: "If an account exists for this email, a magic link has been sent."
		});
	} catch (error) {
		console.error("Magic link send error:", error);
		return apiSuccess({
			success: true,
			message: "If an account exists for this email, a magic link has been sent."
		});
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
