import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { b as parseOptionalBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { Q as mediaConfirmBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm, a as requireOwnerPerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import './request-context_COpWwYmK.mjs';
import 'better-sqlite3';
import './adapt-sandbox-entry_DjK9-r0z.mjs';
import './content-C0ooIs-f_Bwo8eX_E.mjs';
import { M as MediaRepository } from './media-oqRcNiQf_LipfpTx8.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import 'croner';
import 'image-size';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import '@emdash-cms/plugin-types';
import '@atcute/client';
import './import-DG80rC_I_xvWF57jY.mjs';
import './email-console-CubRll9q_BSEoXBnN.mjs';
import 'mime/lite';

//#region src/astro/routes/api/media/[id]/confirm.ts
const prerender = false;
/**
* Add URL to media item (relative URL for portability)
*/
function addUrlToMedia(item) {
	return {
		...item,
		url: `/_emdash/api/media/file/${item.storageKey}`
	};
}
/**
* Confirm upload completion
*/
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { id } = params;
	const denied = requirePerm(user, "media:upload");
	if (denied) return denied;
	if (!id) return apiError("INVALID_REQUEST", "Media ID is required", 400);
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const body = await parseOptionalBody(request, mediaConfirmBody, {});
		if (isParseError(body)) return body;
		const repo = new MediaRepository(emdash.db);
		const existing = await repo.findById(id);
		if (!existing) return apiError("NOT_FOUND", `Media item not found: ${id}`, 404);
		if (existing.status !== "pending") return apiError("INVALID_STATE", `Media item is not pending: ${existing.status}`, 400);
		const ownerDenied = requireOwnerPerm(user, existing.authorId ?? "", "media:edit_own", "media:edit_any");
		if (ownerDenied) return ownerDenied;
		if (emdash.storage) {
			if (!await emdash.storage.exists(existing.storageKey)) {
				await repo.markFailed(id);
				return apiError("FILE_NOT_FOUND", "File was not uploaded to storage", 400);
			}
		}
		const item = await repo.confirmUpload(id, {
			size: body.size,
			width: body.width,
			height: body.height
		});
		if (!item) return apiError("CONFIRM_FAILED", "Failed to confirm upload", 500);
		return apiSuccess({ item: addUrlToMedia(item) });
	} catch (error) {
		return handleError(error, "Failed to confirm upload", "CONFIRM_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
