import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { b as allowedDomainCreateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';
import './index_CZ_O-7V7.mjs';
import { R as Role, r as roleFromLevel } from './types-ndj-bYfi_CoL8kXti.mjs';

//#region src/astro/routes/api/admin/allowed-domains/index.ts
const prerender = false;
const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9-]+)+$/;
/**
* GET - List all allowed domains
*/
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		return apiSuccess({ domains: (await adapter.getAllowedDomains()).map((d) => ({
			domain: d.domain,
			defaultRole: d.defaultRole,
			roleName: roleFromLevel(d.defaultRole),
			enabled: d.enabled,
			createdAt: d.createdAt.toISOString()
		})) });
	} catch (error) {
		return handleError(error, "Failed to list allowed domains", "DOMAIN_LIST_ERROR");
	}
};
/**
* POST - Add a new allowed domain
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "Database not configured", 500);
	if (!user || user.role < Role.ADMIN) return apiError("FORBIDDEN", "Admin privileges required", 403);
	const adapter = createKyselyAdapter(emdash.db);
	try {
		const body = await parseBody(request, allowedDomainCreateBody);
		if (isParseError(body)) return body;
		const defaultRole = body.defaultRole;
		const cleanDomain = body.domain.toLowerCase().trim();
		if (!DOMAIN_REGEX.test(cleanDomain)) return apiError("VALIDATION_ERROR", "Invalid domain format", 400);
		if (await adapter.getAllowedDomain(cleanDomain)) return apiError("CONFLICT", "Domain already exists", 409);
		const domain = await adapter.createAllowedDomain(cleanDomain, defaultRole);
		return apiSuccess({
			success: true,
			domain: {
				domain: domain.domain,
				defaultRole: domain.defaultRole,
				roleName: roleFromLevel(domain.defaultRole),
				enabled: domain.enabled,
				createdAt: domain.createdAt.toISOString()
			}
		}, 201);
	} catch (error) {
		return handleError(error, "Failed to create allowed domain", "DOMAIN_CREATE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
