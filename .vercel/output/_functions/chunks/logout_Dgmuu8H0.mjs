import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { i as isSafeRedirect } from './redirect-BINiRYq4_BlsVN_DH.mjs';

//#region src/astro/routes/api/auth/logout.ts
const prerender = false;
const POST = async ({ session, url }) => {
	try {
		if (session) session.destroy();
		const redirect = url.searchParams.get("redirect");
		if (isSafeRedirect(redirect)) return new Response(null, {
			status: 302,
			headers: { Location: redirect }
		});
		return apiSuccess({
			success: true,
			message: "Logged out successfully"
		});
	} catch (error) {
		return handleError(error, "Logout failed", "LOGOUT_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
