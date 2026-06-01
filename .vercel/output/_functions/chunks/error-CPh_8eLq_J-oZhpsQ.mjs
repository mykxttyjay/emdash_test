import { I as InvalidCursorError } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';

//#region src/api/errors.ts
/**
* Typed error codes and status mapping for the EmDash REST API.
*
* All handler-level and route-level error codes are defined here.
* Routes and handlers should import error codes from this module
* instead of using ad-hoc strings.
*/
const ErrorCode = {
	NOT_FOUND: "NOT_FOUND",
	VALIDATION_ERROR: "VALIDATION_ERROR",
	INVALID_INPUT: "INVALID_INPUT",
	INVALID_JSON: "INVALID_JSON",
	INVALID_CURSOR: "INVALID_CURSOR",
	CONFLICT: "CONFLICT",
	SLUG_CONFLICT: "SLUG_CONFLICT",
	NOT_CONFIGURED: "NOT_CONFIGURED",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	RATE_LIMITED: "RATE_LIMITED",
	NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
	NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
	NOT_SUPPORTED: "NOT_SUPPORTED",
	MISSING_PARAM: "MISSING_PARAM",
	CSRF_REJECTED: "CSRF_REJECTED",
	INVALID_REVISION: "INVALID_REVISION",
	COLLECTION_EXISTS: "COLLECTION_EXISTS",
	COLLECTION_NOT_FOUND: "COLLECTION_NOT_FOUND",
	TABLE_NOT_FOUND: "TABLE_NOT_FOUND",
	FIELD_EXISTS: "FIELD_EXISTS",
	RESERVED_SLUG: "RESERVED_SLUG",
	INVALID_SLUG: "INVALID_SLUG",
	NO_STORAGE: "NO_STORAGE",
	NO_FILE: "NO_FILE",
	INVALID_TYPE: "INVALID_TYPE",
	FILE_NOT_FOUND: "FILE_NOT_FOUND",
	INVALID_STATE: "INVALID_STATE",
	STORAGE_NOT_CONFIGURED: "STORAGE_NOT_CONFIGURED",
	COMMENTS_DISABLED: "COMMENTS_DISABLED",
	COMMENTS_CLOSED: "COMMENTS_CLOSED",
	COMMENT_REJECTED: "COMMENT_REJECTED",
	ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
	ADMIN_EXISTS: "ADMIN_EXISTS",
	SETUP_COMPLETE: "SETUP_COMPLETE",
	CREDENTIAL_EXISTS: "CREDENTIAL_EXISTS",
	CHALLENGE_EXPIRED: "CHALLENGE_EXPIRED",
	PASSKEY_LIMIT: "PASSKEY_LIMIT",
	LAST_PASSKEY: "LAST_PASSKEY",
	SELF_ROLE_CHANGE: "SELF_ROLE_CHANGE",
	EMAIL_IN_USE: "EMAIL_IN_USE",
	EMAIL_NOT_CONFIGURED: "EMAIL_NOT_CONFIGURED",
	USER_EXISTS: "USER_EXISTS",
	INVALID_TOKEN: "INVALID_TOKEN",
	TOKEN_EXPIRED: "TOKEN_EXPIRED",
	DOMAIN_NOT_ALLOWED: "DOMAIN_NOT_ALLOWED",
	INVALID_CODE: "INVALID_CODE",
	EXPIRED_CODE: "EXPIRED_CODE",
	INSUFFICIENT_ROLE: "INSUFFICIENT_ROLE",
	INSUFFICIENT_SCOPE: "INSUFFICIENT_SCOPE",
	INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
	PLUGIN_ID_CONFLICT: "PLUGIN_ID_CONFLICT",
	MARKETPLACE_NOT_CONFIGURED: "MARKETPLACE_NOT_CONFIGURED",
	MARKETPLACE_UNAVAILABLE: "MARKETPLACE_UNAVAILABLE",
	SANDBOX_NOT_AVAILABLE: "SANDBOX_NOT_AVAILABLE",
	ALREADY_INSTALLED: "ALREADY_INSTALLED",
	ALREADY_UP_TO_DATE: "ALREADY_UP_TO_DATE",
	NO_VERSION: "NO_VERSION",
	AUDIT_FAILED: "AUDIT_FAILED",
	CHECKSUM_MISMATCH: "CHECKSUM_MISMATCH",
	INVALID_BUNDLE: "INVALID_BUNDLE",
	BUNDLE_EXTRACT_FAILED: "BUNDLE_EXTRACT_FAILED",
	BUNDLE_DOWNLOAD_FAILED: "BUNDLE_DOWNLOAD_FAILED",
	AGGREGATOR_RESPONSE_INVALID: "AGGREGATOR_RESPONSE_INVALID",
	AGGREGATOR_HTTP_ERROR: "AGGREGATOR_HTTP_ERROR",
	AGGREGATOR_NOT_FOUND: "AGGREGATOR_NOT_FOUND",
	CAPABILITY_ESCALATION: "CAPABILITY_ESCALATION",
	ROUTE_VISIBILITY_ESCALATION: "ROUTE_VISIBILITY_ESCALATION",
	AMBIGUOUS_LOCALE: "AMBIGUOUS_LOCALE",
	ALREADY_CONFIGURED: "ALREADY_CONFIGURED",
	INVALID_SEED: "INVALID_SEED",
	INVALID_REDIRECT: "INVALID_REDIRECT",
	SSRF_BLOCKED: "SSRF_BLOCKED",
	NO_DB: "NO_DB",
	INVALID_REQUEST: "INVALID_REQUEST",
	UNKNOWN_ACTION: "UNKNOWN_ACTION"
};
/**
* Map a handler error code to an HTTP status code.
*
* Shared codes have explicit mappings. Domain-specific `*_ERROR` codes
* (used in catch blocks via handleError) default to 500. Everything else
* defaults to 400 (client error).
*/
function mapErrorStatus(code) {
	switch (code) {
		case ErrorCode.VALIDATION_ERROR:
		case ErrorCode.INVALID_INPUT:
		case ErrorCode.INVALID_JSON:
		case ErrorCode.INVALID_CURSOR:
		case ErrorCode.MISSING_PARAM:
		case ErrorCode.INVALID_REQUEST:
		case ErrorCode.NOT_SUPPORTED:
		case ErrorCode.INVALID_SLUG:
		case ErrorCode.RESERVED_SLUG:
		case ErrorCode.INVALID_TYPE:
		case ErrorCode.NO_FILE:
		case ErrorCode.INVALID_STATE:
		case ErrorCode.INVALID_SEED:
		case ErrorCode.INVALID_REDIRECT:
		case ErrorCode.INVALID_TOKEN:
		case ErrorCode.INVALID_REVISION:
		case ErrorCode.INVALID_CODE:
		case ErrorCode.CHALLENGE_EXPIRED:
		case ErrorCode.EXPIRED_CODE:
		case ErrorCode.LAST_PASSKEY:
		case ErrorCode.PASSKEY_LIMIT:
		case ErrorCode.ADMIN_EXISTS:
		case ErrorCode.SETUP_COMPLETE:
		case ErrorCode.SELF_ROLE_CHANGE:
		case ErrorCode.SSRF_BLOCKED:
		case ErrorCode.UNKNOWN_ACTION:
		case ErrorCode.AMBIGUOUS_LOCALE: return 400;
		case ErrorCode.UNAUTHORIZED:
		case ErrorCode.NOT_AUTHENTICATED: return 401;
		case ErrorCode.FORBIDDEN:
		case ErrorCode.CSRF_REJECTED:
		case ErrorCode.ACCOUNT_DISABLED:
		case ErrorCode.COMMENTS_DISABLED:
		case ErrorCode.COMMENTS_CLOSED:
		case ErrorCode.COMMENT_REJECTED:
		case ErrorCode.DOMAIN_NOT_ALLOWED:
		case ErrorCode.INSUFFICIENT_ROLE:
		case ErrorCode.INSUFFICIENT_SCOPE:
		case ErrorCode.INSUFFICIENT_PERMISSIONS:
		case ErrorCode.CAPABILITY_ESCALATION:
		case ErrorCode.ROUTE_VISIBILITY_ESCALATION:
		case ErrorCode.AUDIT_FAILED: return 403;
		case ErrorCode.NOT_FOUND:
		case ErrorCode.TABLE_NOT_FOUND:
		case ErrorCode.COLLECTION_NOT_FOUND:
		case ErrorCode.FILE_NOT_FOUND:
		case ErrorCode.NO_VERSION:
		case ErrorCode.AGGREGATOR_NOT_FOUND: return 404;
		case ErrorCode.CONFLICT:
		case ErrorCode.SLUG_CONFLICT:
		case ErrorCode.COLLECTION_EXISTS:
		case ErrorCode.FIELD_EXISTS:
		case ErrorCode.CREDENTIAL_EXISTS:
		case ErrorCode.EMAIL_IN_USE:
		case ErrorCode.USER_EXISTS:
		case ErrorCode.PLUGIN_ID_CONFLICT:
		case ErrorCode.ALREADY_INSTALLED:
		case ErrorCode.ALREADY_CONFIGURED:
		case ErrorCode.ALREADY_UP_TO_DATE: return 409;
		case ErrorCode.TOKEN_EXPIRED: return 410;
		case ErrorCode.CHECKSUM_MISMATCH:
		case ErrorCode.INVALID_BUNDLE:
		case ErrorCode.BUNDLE_EXTRACT_FAILED: return 422;
		case ErrorCode.RATE_LIMITED: return 429;
		case ErrorCode.NOT_CONFIGURED:
		case ErrorCode.NO_STORAGE:
		case ErrorCode.NO_DB:
		case ErrorCode.STORAGE_NOT_CONFIGURED:
		case ErrorCode.EMAIL_NOT_CONFIGURED: return 500;
		case ErrorCode.NOT_IMPLEMENTED: return 501;
		case ErrorCode.BUNDLE_DOWNLOAD_FAILED:
		case ErrorCode.AGGREGATOR_RESPONSE_INVALID:
		case ErrorCode.AGGREGATOR_HTTP_ERROR: return 502;
		case ErrorCode.MARKETPLACE_UNAVAILABLE:
		case ErrorCode.MARKETPLACE_NOT_CONFIGURED:
		case ErrorCode.SANDBOX_NOT_AVAILABLE: return 503;
		default: return code?.endsWith("_ERROR") ? 500 : 400;
	}
}

//#endregion
//#region src/api/error.ts
/**
* Standardized API error responses.
*
* All API routes should use these utilities instead of inline
* `new Response(JSON.stringify({ error: ... }), ...)` patterns.
*/
/**
* Standard cache headers for all API responses.
*
* Cache-Control: private, no-store -- prevents CDN/proxy caching of authenticated data.
* no-store already tells caches not to store the response, so Vary is unnecessary.
*/
const API_CACHE_HEADERS = { "Cache-Control": "private, no-store" };
/**
* Create a standardized error response.
*
* Always returns `{ error: { code, message } }` with correct Content-Type.
* Use this for all error responses in API routes.
*/
function apiError(code, message, status, details) {
	const error = {
		code,
		message
	};
	if (details !== void 0) error.details = details;
	return Response.json({ error }, {
		status,
		headers: API_CACHE_HEADERS
	});
}
/**
* Create a standardized success response.
*
* Always returns `{ data: T }` with correct status code.
* Use this for all success responses in API routes.
*/
function apiSuccess(data, status = 200) {
	return Response.json({ data }, {
		status,
		headers: API_CACHE_HEADERS
	});
}
/**
* Handle an unknown error in a catch block.
*
* - Logs the full error server-side
* - Returns a generic message to the client (never leaks error.message)
* - Use `fallbackMessage` for the public-facing message
* - Use `fallbackCode` for the error code
*/
function handleError(error, fallbackMessage, fallbackCode) {
	if (error instanceof InvalidCursorError) return apiError("INVALID_CURSOR", error.message, 400);
	console.error(`[${fallbackCode}]`, error);
	return apiError(fallbackCode, fallbackMessage, 500);
}
/**
* Standard database check.
*
* Returns an error response if the database is not available, or null if OK.
* Usage: `const err = requireDb(emdash?.db); if (err) return err;`
*/
function requireDb(db) {
	if (!db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	return null;
}
/**
* Convert an ApiResult into an HTTP Response.
*
* Collapses the handler-to-response boilerplate:
* - Success: returns `apiSuccess(result.data, successStatus)`
* - Error: returns `apiError(code, message, mapErrorStatus(code))`
*/
function unwrapResult(result, successStatus = 200) {
	if (!result.success) return apiError(result.error.code, result.error.message, mapErrorStatus(result.error.code), result.error.details);
	return apiSuccess(result.data, successStatus);
}

export { apiError as a, apiSuccess as b, handleError as h, mapErrorStatus as m, requireDb as r, unwrapResult as u };
