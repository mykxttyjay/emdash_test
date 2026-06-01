import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { m as matchesMimeAllowlist, n as normalizeMime } from './mime-KV5TqkMN_8Fgolcvg.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { O as DEFAULT_MAX_UPLOAD_SIZE, P as mediaUploadUrlBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { r as resolveFieldAllowlist, G as GLOBAL_UPLOAD_ALLOWLIST } from './media-allowlist-BNloC69x_D8ibW2MH.mjs';
import { ulid } from 'ulidx';
import * as path from 'node:path';
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

//#region src/astro/routes/api/media/upload-url.ts
/**
* Media upload URL endpoint
*
* POST /_emdash/api/media/upload-url
*
* Returns a signed URL for direct upload to storage.
* Creates a pending media record that must be confirmed after upload.
*/
const prerender = false;
/**
* Get a signed upload URL for direct-to-storage upload
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "media:upload");
	if (denied) return denied;
	if (!emdash?.storage) return apiError("NO_STORAGE", "Storage not configured. Signed URL uploads require S3-compatible storage.", 501);
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		const maxSize = emdash.config.maxUploadSize ?? DEFAULT_MAX_UPLOAD_SIZE;
		if (!Number.isFinite(maxSize) || maxSize <= 0) return apiError("CONFIGURATION_ERROR", "Invalid maxUploadSize configuration. Expected a positive finite number.", 500);
		const body = await parseBody(request, mediaUploadUrlBody(maxSize));
		if (isParseError(body)) return body;
		const allowlist = (body.fieldId ? await resolveFieldAllowlist(emdash.db, body.fieldId) : null) ?? [...GLOBAL_UPLOAD_ALLOWLIST];
		if (!matchesMimeAllowlist(body.contentType, allowlist)) return apiError("INVALID_TYPE", "File type not allowed", 400);
		const repo = new MediaRepository(emdash.db);
		if (body.contentHash) {
			const existing = await repo.findByContentHash(body.contentHash);
			if (existing) return apiSuccess({
				existing: true,
				mediaId: existing.id,
				storageKey: existing.storageKey,
				url: `/_emdash/api/media/file/${existing.storageKey}`
			});
		}
		const storageKey = `${ulid()}${path.extname(body.filename) || ""}`;
		const mediaItem = await repo.createPending({
			filename: body.filename,
			mimeType: normalizeMime(body.contentType),
			size: body.size,
			storageKey,
			contentHash: body.contentHash,
			authorId: user?.id
		});
		const signedUrl = await emdash.storage.getSignedUploadUrl({
			key: storageKey,
			contentType: body.contentType,
			size: body.size,
			expiresIn: 3600
		});
		return apiSuccess({
			uploadUrl: signedUrl.url,
			method: signedUrl.method,
			headers: signedUrl.headers,
			mediaId: mediaItem.id,
			storageKey,
			expiresAt: signedUrl.expiresAt
		});
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "NOT_SUPPORTED") return apiError("NOT_SUPPORTED", "Storage does not support signed upload URLs. Use direct upload.", 501);
		return handleError(error, "Failed to generate upload URL", "UPLOAD_URL_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
