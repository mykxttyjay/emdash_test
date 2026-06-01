import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import './index_CZ_O-7V7.mjs';
import { c as handleTokenRefresh } from './device-flow-B9oG8PwP_CFToePGY.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/oauth/token/refresh.ts
const prerender = false;
const refreshSchema = z.object({
	refresh_token: z.string().min(1),
	grant_type: z.string().min(1)
});
const POST = async ({ request, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseBody(request, refreshSchema);
		if (isParseError(body)) return body;
		return unwrapResult(await handleTokenRefresh(emdash.db, body));
	} catch (error) {
		return handleError(error, "Failed to refresh token", "TOKEN_REFRESH_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
