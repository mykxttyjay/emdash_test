import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import { i as validateSignupToken, S as SignupError } from './index_CZ_O-7V7.mjs';
import { r as roleFromLevel } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/auth/signup/verify.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const token = url.searchParams.get("token");
	if (!token) return apiError("MISSING_PARAM", "Token is required", 400);
	try {
		const result = await validateSignupToken(createKyselyAdapter(emdash.db), token);
		return apiSuccess({
			success: true,
			email: result.email,
			role: result.role,
			roleName: roleFromLevel(result.role)
		});
	} catch (error) {
		if (error instanceof SignupError) return apiError(error.code.toUpperCase(), error.message, {
			invalid_token: 404,
			token_expired: 410,
			user_exists: 409,
			domain_not_allowed: 403
		}[error.code] ?? 400);
		return handleError(error, "Failed to validate signup token", "SIGNUP_VERIFY_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
