import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/media/providers/[providerId]/index.ts
const prerender = false;
/**
* List media from a specific provider
*/
const GET = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { providerId } = params;
	const readDenied = requirePerm(user, "media:read");
	if (readDenied) return readDenied;
	if (!providerId) return apiError("INVALID_REQUEST", "Provider ID required", 400);
	if (!emdash?.getMediaProvider) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const provider = emdash.getMediaProvider(providerId);
	if (!provider) return apiError("NOT_FOUND", `Provider "${providerId}" not found`, 404);
	const url = new URL(request.url);
	const cursor = url.searchParams.get("cursor") || void 0;
	const rawLimit = url.searchParams.get("limit");
	const limit = rawLimit ? Math.max(1, Math.min(parseInt(rawLimit, 10) || 50, 100)) : void 0;
	const query = url.searchParams.get("query") || void 0;
	const mimeType = url.searchParams.get("mimeType") || void 0;
	try {
		const result = await provider.list({
			cursor,
			limit,
			query,
			mimeType
		});
		return apiSuccess({
			items: result.items,
			nextCursor: result.nextCursor
		});
	} catch (error) {
		return handleError(error, "Failed to list media from provider", "PROVIDER_LIST_ERROR");
	}
};
/**
* Upload media to a specific provider
*/
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { providerId } = params;
	const uploadDenied = requirePerm(user, "media:upload");
	if (uploadDenied) return uploadDenied;
	if (!providerId) return apiError("INVALID_REQUEST", "Provider ID required", 400);
	if (!emdash?.getMediaProvider) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const provider = emdash.getMediaProvider(providerId);
	if (!provider) return apiError("NOT_FOUND", `Provider "${providerId}" not found`, 404);
	if (!provider.upload) return apiError("NOT_SUPPORTED", `Provider "${providerId}" does not support uploads`, 400);
	try {
		const formData = await request.formData();
		const fileEntry = formData.get("file");
		const file = fileEntry instanceof File ? fileEntry : null;
		const altEntry = formData.get("alt");
		const alt = typeof altEntry === "string" ? altEntry : null;
		if (!file) return apiError("NO_FILE", "No file provided", 400);
		const maxSize = emdash.config?.maxUploadSize ?? 50 * 1024 * 1024;
		if (file.size > maxSize) return apiError("FILE_TOO_LARGE", `File exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`, 413);
		return apiSuccess({ item: await provider.upload({
			file,
			filename: file.name,
			alt: alt || void 0
		}) }, 201);
	} catch (error) {
		return handleError(error, "Failed to upload to provider", "PROVIDER_UPLOAD_ERROR");
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
