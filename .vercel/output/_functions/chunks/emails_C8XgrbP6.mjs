import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import './email-console-CubRll9q_BSEoXBnN.mjs';

const prerender = false;
const GET = async () => {
  return apiError("FORBIDDEN", "Dev emails endpoint is only available in development mode", 403);
};
const DELETE = async () => {
  return apiError("FORBIDDEN", "Dev emails endpoint is only available in development mode", 403);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
