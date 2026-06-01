import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import './index_CZ_O-7V7.mjs';
import { h as handleDeviceAuthorize } from './device-flow-B9oG8PwP_CFToePGY.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/oauth/device/authorize.ts
const prerender = false;
const authorizeSchema = z.object({
	user_code: z.string().min(1),
	action: z.enum(["approve", "deny"]).optional()
});
const POST = async ({ request, locals }) => {
	const { emdash } = locals;
	const { user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Authentication required", 401);
	try {
		const body = await parseBody(request, authorizeSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleDeviceAuthorize(emdash.db, user.id, user.role, body));
	} catch (error) {
		return handleError(error, "Failed to authorize device", "AUTHORIZE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
