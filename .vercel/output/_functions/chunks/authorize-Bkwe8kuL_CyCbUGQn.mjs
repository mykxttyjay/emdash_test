import { a as apiError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { h as hasPermission, c as canActOnOwn } from './index_CZ_O-7V7.mjs';

//#region src/api/authorize.ts
/**
* Check if user has a permission. Returns a 401/403 Response if not, or null if authorized.
*
* Usage:
* ```ts
* const denied = requirePerm(user, "schema:manage");
* if (denied) return denied;
* ```
*/
function requirePerm(user, permission) {
	if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);
	if (!hasPermission(user, permission)) return apiError("FORBIDDEN", "Insufficient permissions", 403);
	return null;
}
/**
* Check if user can act on a resource, considering ownership.
* Returns a 401/403 Response if not, or null if authorized.
*
* Usage:
* ```ts
* const denied = requireOwnerPerm(user, item.authorId, "content:edit_own", "content:edit_any");
* if (denied) return denied;
* ```
*/
function requireOwnerPerm(user, ownerId, ownPermission, anyPermission) {
	if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);
	if (!canActOnOwn(user, ownerId, ownPermission, anyPermission)) return apiError("FORBIDDEN", "Insufficient permissions", 403);
	return null;
}

export { requireOwnerPerm as a, requirePerm as r };
