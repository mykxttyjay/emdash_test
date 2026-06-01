import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { R as mediaUpdateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm, a as requireOwnerPerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/media/[id].ts
const prerender = false;
/**
* Get media item
*/
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	const readDenied = requirePerm(user, "media:read");
	if (readDenied) return readDenied;
	if (!id) return apiError("INVALID_REQUEST", "Media ID required", 400);
	if (!emdash?.handleMediaGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	return unwrapResult(await emdash.handleMediaGet(id));
};
/**
* Update media metadata
*
* Authors can edit their own media; editors+ can edit any.
*/
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	const editDenied = requirePerm(user, "media:edit_own");
	if (editDenied) return editDenied;
	if (!id) return apiError("INVALID_REQUEST", "Media ID required", 400);
	if (!emdash?.handleMediaGet || !emdash?.handleMediaUpdate) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const getResult = await emdash.handleMediaGet(id);
		if (!getResult.success || !getResult.data?.item) return apiError("NOT_FOUND", "Media item not found", 404);
		const media = getResult.data.item;
		const ownerDenied = requireOwnerPerm(user, media.authorId, "media:edit_own", "media:edit_any");
		if (ownerDenied) return ownerDenied;
		const body = await parseBody(request, mediaUpdateBody);
		if (isParseError(body)) return body;
		return unwrapResult(await emdash.handleMediaUpdate(id, {
			alt: body.alt,
			caption: body.caption,
			width: body.width,
			height: body.height
		}));
	} catch (error) {
		return handleError(error, "Failed to update media", "MEDIA_UPDATE_ERROR");
	}
};
/**
* Delete media item
*
* Authors can delete their own media; editors+ can delete any.
*/
const DELETE = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	const deleteDenied = requirePerm(user, "media:delete_own");
	if (deleteDenied) return deleteDenied;
	if (!id) return apiError("INVALID_REQUEST", "Media ID required", 400);
	if (!emdash?.handleMediaGet || !emdash?.handleMediaDelete) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const getResult = await emdash.handleMediaGet(id);
		if (!getResult.success || !getResult.data?.item) return apiError("NOT_FOUND", "Media item not found", 404);
		const media = getResult.data.item;
		const ownerDenied = requireOwnerPerm(user, media.authorId, "media:delete_own", "media:delete_any");
		if (ownerDenied) return ownerDenied;
		if (emdash.storage) try {
			await emdash.storage.delete(media.storageKey);
		} catch {}
		return unwrapResult(await emdash.handleMediaDelete(id));
	} catch (error) {
		return handleError(error, "Failed to delete media", "MEDIA_DELETE_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	GET,
	PUT,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
