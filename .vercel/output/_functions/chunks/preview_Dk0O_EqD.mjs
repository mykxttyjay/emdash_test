import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { r as resolveSecretsCached } from './secrets-rPdhEBkD_BN1YxHO5.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/themes/preview.ts
const prerender = false;
const POST = async ({ request, url, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "plugins:read");
	if (denied) return denied;
	const { previewSecret: secret } = await resolveSecretsCached(emdash.db);
	let body;
	try {
		body = await request.json();
	} catch {
		return apiError("INVALID_REQUEST", "Invalid JSON body", 400);
	}
	if (!body.previewUrl || typeof body.previewUrl !== "string") return apiError("INVALID_REQUEST", "previewUrl is required", 400);
	let parsedPreviewUrl;
	try {
		parsedPreviewUrl = new URL(body.previewUrl);
	} catch {
		return apiError("INVALID_REQUEST", "previewUrl must be a valid URL", 400);
	}
	if (parsedPreviewUrl.protocol !== "https:") return apiError("INVALID_REQUEST", "previewUrl must use HTTPS", 400);
	const source = getPublicOrigin(url, emdash?.config);
	const exp = Math.floor(Date.now() / 1e3) + 3600;
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const buffer = await crypto.subtle.sign("HMAC", key, encoder.encode(`${source}:${exp}`));
	const sig = Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
	const previewUrl = new URL(body.previewUrl);
	previewUrl.searchParams.set("source", source);
	previewUrl.searchParams.set("exp", String(exp));
	previewUrl.searchParams.set("sig", sig);
	return apiSuccess({ url: previewUrl.toString() });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
