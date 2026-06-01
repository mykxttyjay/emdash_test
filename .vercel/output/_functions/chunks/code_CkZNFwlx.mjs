import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { g as getTrustedProxyHeaders } from './trusted-proxy-97pajC2f_jQH5p4aV.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import './index_CZ_O-7V7.mjs';
import { a as handleDeviceCodeRequest } from './device-flow-B9oG8PwP_CFToePGY.mjs';
import { g as getClientIp, c as checkRateLimit, r as rateLimitResponse } from './rate-limit-D_-gAeJ0_BFjvf0uK.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/oauth/device/code.ts
const prerender = false;
const deviceCodeSchema = z.object({
	client_id: z.string().optional(),
	scope: z.string().optional()
});
const POST = async ({ request, locals, url }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, deviceCodeSchema);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "device/code", 10, 60)).allowed) return rateLimitResponse(60);
		const verificationUri = new URL("/_emdash/admin/device", getPublicOrigin(url, emdash?.config)).toString();
		return unwrapResult(await handleDeviceCodeRequest(emdash.db, body, verificationUri));
	} catch (error) {
		return handleError(error, "Failed to create device code", "DEVICE_CODE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
