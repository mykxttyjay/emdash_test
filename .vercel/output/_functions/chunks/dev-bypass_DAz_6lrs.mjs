import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './content-C0ooIs-f_Bwo8eX_E.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import { a as apiError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import 'image-size';
import 'mime/lite';
import './index_CZ_O-7V7.mjs';

const prerender = false;
async function handleDevBypass(context) {
  return apiError("FORBIDDEN", "Dev bypass is only available in development mode", 403);
}
const GET = handleDevBypass;
const POST = handleDevBypass;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
