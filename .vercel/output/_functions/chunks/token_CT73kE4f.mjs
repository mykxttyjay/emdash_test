import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { g as getTrustedProxyHeaders } from './trusted-proxy-97pajC2f_jQH5p4aV.mjs';
import './index_CZ_O-7V7.mjs';
import { b as handleDeviceTokenExchange } from './device-flow-B9oG8PwP_CFToePGY.mjs';
import { g as getClientIp, c as checkRateLimit, r as rateLimitResponse } from './rate-limit-D_-gAeJ0_BFjvf0uK.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/oauth/device/token.ts
const prerender = false;
const deviceTokenSchema = z.object({
	device_code: z.string().min(1),
	grant_type: z.string().min(1)
});
const POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, deviceTokenSchema);
		if (isParseError(body)) return body;
		const ip = getClientIp(request, getTrustedProxyHeaders(emdash.config));
		if (!(await checkRateLimit(emdash.db, ip, "device/token", 12, 60)).allowed) return rateLimitResponse(60);
		const result = await handleDeviceTokenExchange(emdash.db, body);
		if (!result.success && result.deviceFlowError) {
			const errorBody = { error: result.deviceFlowError };
			if (result.deviceFlowInterval !== void 0) errorBody.interval = result.deviceFlowInterval;
			return Response.json(errorBody, {
				status: 400,
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "no-store",
					Pragma: "no-cache"
				}
			});
		}
		return unwrapResult(result);
	} catch (error) {
		return handleError(error, "Failed to exchange device code", "TOKEN_EXCHANGE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
