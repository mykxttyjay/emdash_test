import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { createKyselyAdapter } from './kysely_B71kB-eV.mjs';

//#region src/astro/routes/api/auth/passkey/index.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!user) return apiError("NOT_AUTHENTICATED", "Not authenticated", 401);
	try {
		return apiSuccess({ items: (await createKyselyAdapter(emdash.db).getCredentialsByUserId(user.id)).map((cred) => ({
			id: cred.id,
			name: cred.name,
			deviceType: cred.deviceType,
			backedUp: cred.backedUp,
			createdAt: cred.createdAt.toISOString(),
			lastUsedAt: cred.lastUsedAt.toISOString()
		})) });
	} catch (error) {
		return handleError(error, "Failed to list passkeys", "PASSKEY_LIST_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
