import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import './index_CZ_O-7V7.mjs';
import { V as VALID_SCOPES } from './authenticate-BiDGbUVY_CNGQ9xrZ.mjs';

//#region src/astro/routes/api/well-known/oauth-protected-resource.ts
const prerender = false;
const GET = async ({ url, locals }) => {
	const origin = getPublicOrigin(url, locals.emdash?.config);
	return Response.json({
		resource: `${origin}/_emdash/api/mcp`,
		authorization_servers: [`${origin}/_emdash`],
		scopes_supported: [...VALID_SCOPES],
		bearer_methods_supported: ["header"]
	}, { headers: {
		"Cache-Control": "public, max-age=3600",
		"Access-Control-Allow-Origin": "*"
	} });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
