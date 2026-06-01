import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { o as authMeActionBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';

//#region src/astro/routes/api/auth/me.ts
const prerender = false;
const GET = async ({ locals, session }) => {
	const { user } = locals;
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	const isFirstLogin = !await session?.get("hasSeenWelcome");
	return apiSuccess({
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
		avatarUrl: user.avatarUrl,
		isFirstLogin
	});
};
/**
* POST /_emdash/api/auth/me
*
* Mark that the user has seen the welcome modal.
*/
const POST = async ({ request, locals, session }) => {
	const { user } = locals;
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	const body = await parseBody(request, authMeActionBody);
	if (isParseError(body)) return body;
	if (body.action === "dismissWelcome") {
		session?.set("hasSeenWelcome", true);
		return apiSuccess({ success: true });
	}
	return apiError("UNKNOWN_ACTION", "Unknown action", 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
