import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { S as SsrfError } from './ssrf-MZ-zrG6-_C2NT9OCQ.mjs';
import { b as apiSuccess, a as apiError, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { G as importProbeBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { p as probeUrl } from './import-DG80rC_I_xvWF57jY.mjs';
import 'mime/lite';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/import/probe.ts
const prerender = false;
const POST = async ({ request, locals }) => {
	const { user } = locals;
	const denied = requirePerm(user, "import:execute");
	if (denied) return denied;
	try {
		const body = await parseBody(request, importProbeBody);
		if (isParseError(body)) return body;
		return apiSuccess({
			success: true,
			result: await probeUrl(body.url)
		});
	} catch (error) {
		if (error instanceof SsrfError) return apiError("SSRF_BLOCKED", error.message, 400);
		return handleError(error, "Failed to probe URL", "PROBE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
