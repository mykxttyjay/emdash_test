import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { C as COMMIT, V as VERSION } from './version-Ct7C6RSo_Db477Nts.mjs';
import { g as getAuthMode } from './mode-CaaiebZI_DSSHIDlR.mjs';

//#region src/astro/routes/api/manifest.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash } = locals;
	try {
		const emdashManifest = emdash ? await emdash.getManifest() : null;
		const authMode = getAuthMode(emdash?.config);
		const adminBranding = emdash?.config?.admin;
		let signupEnabled = false;
		if (emdash?.db && authMode.type === "passkey") try {
			const { sql } = await import('kysely');
			const result = await sql`
					SELECT COUNT(*) as cnt FROM allowed_domains WHERE enabled = 1
				`.execute(emdash.db);
			signupEnabled = Number(result.rows[0]?.cnt ?? 0) > 0;
		} catch {}
		const manifest = emdashManifest ? {
			...emdashManifest,
			authMode: authMode.type === "external" ? authMode.providerType : "passkey",
			signupEnabled,
			admin: adminBranding
		} : {
			version: VERSION,
			commit: COMMIT,
			hash: "default",
			collections: {},
			plugins: {},
			taxonomies: [],
			authMode: "passkey",
			signupEnabled,
			admin: adminBranding
		};
		return Response.json({ data: manifest }, { headers: { "Cache-Control": "private, no-store" } });
	} catch (error) {
		return handleError(error, "Failed to build manifest", "MANIFEST_BUILD_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
