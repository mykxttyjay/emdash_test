import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { j as usersListQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { R as Role } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/users/index.ts
/**
* User management list endpoint
*
* GET /_emdash/api/admin/users - List users with search, filter, pagination
*/
const prerender = false;
const GET = async ({ url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const query = parseQuery(url, usersListQuery);
		if (isParseError(query)) return query;
		const result = await adapter.getUsers({
			search: query.search,
			role: query.role ? parseInt(query.role, 10) : void 0,
			cursor: query.cursor,
			limit: query.limit
		});
		return apiSuccess({
			items: result.items.map((u) => ({
				id: u.id,
				email: u.email,
				name: u.name,
				avatarUrl: u.avatarUrl,
				role: u.role,
				emailVerified: u.emailVerified,
				disabled: u.disabled,
				createdAt: u.createdAt.toISOString(),
				updatedAt: u.updatedAt.toISOString(),
				lastLogin: u.lastLogin?.toISOString() ?? null,
				credentialCount: u.credentialCount,
				oauthProviders: u.oauthProviders
			})),
			nextCursor: result.nextCursor
		});
	} catch (error) {
		return handleError(error, "Failed to list users", "USER_LIST_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
