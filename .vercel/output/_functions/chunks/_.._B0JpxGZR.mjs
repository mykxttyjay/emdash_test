import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import './index_CZ_O-7V7.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { h as hasScope } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/auth/scopes.ts
/**
* Scope enforcement for API token authentication.
*
* Routes call `requireScope(locals, "content:write")` alongside role checks.
* Session-authenticated requests have no scope restrictions (implicit full access).
* Token-authenticated requests must have the required scope (or "admin").
*/
/**
* Check if the request has a required scope.
* Returns a 403 Response if the scope is missing, or null if OK.
*
* For session-authenticated users (no tokenScopes), always returns null
* since session auth has implicit full scope.
*/
function requireScope(locals, scope) {
	if (!locals.tokenScopes) return null;
	if (hasScope(locals.tokenScopes, scope)) return null;
	return new Response(JSON.stringify({ error: {
		code: "INSUFFICIENT_SCOPE",
		message: `Token lacks required scope: ${scope}`
	} }), {
		status: 403,
		headers: { "Content-Type": "application/json" }
	});
}

//#endregion
//#region src/astro/routes/api/plugins/[pluginId]/[...path].ts
const prerender = false;
/**
* Handle all methods by matching against plugin-defined routes
*/
const handleRequest = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const pluginId = params.pluginId;
	const path = params.path || "";
	const method = request.method.toUpperCase();
	if (!emdash?.handlePluginApiRoute) return apiError("NOT_CONFIGURED", "EmDash not configured", 500);
	const routeMeta = emdash.getPluginRouteMeta(pluginId, `/${path}`);
	if (!routeMeta) return apiError("NOT_FOUND", "Plugin route not found", 404);
	if (!routeMeta.public) {
		const denied = requirePerm(user, [
			"GET",
			"HEAD",
			"OPTIONS"
		].includes(method) ? "plugins:read" : "plugins:manage");
		if (denied) return denied;
		const scopeError = requireScope(locals, "admin");
		if (scopeError) return scopeError;
		if (![
			"GET",
			"HEAD",
			"OPTIONS"
		].includes(method) && !locals.tokenScopes && request.headers.get("X-EmDash-Request") !== "1") return apiError("CSRF_REJECTED", "Missing required header", 403);
	}
	const result = await emdash.handlePluginApiRoute(pluginId, method, `/${path}`, request);
	if (!result.success) {
		const code = result.error?.code ?? "PLUGIN_ERROR";
		return apiError(code, code === "INTERNAL_ERROR" ? "Plugin route error" : result.error?.message ?? "Plugin route error", result.status ?? (code === "NOT_FOUND" ? 404 : 400));
	}
	return apiSuccess(result.data);
};
const GET = handleRequest;
const POST = handleRequest;
const PUT = handleRequest;
const PATCH = handleRequest;
const DELETE = handleRequest;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	GET,
	PATCH,
	POST,
	PUT,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
