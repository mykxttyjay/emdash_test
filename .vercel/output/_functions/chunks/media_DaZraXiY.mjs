import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { M as MediaRepository } from './media-oqRcNiQf_LipfpTx8.mjs';
import { encode } from 'blurhash';
import { imageSize } from 'image-size';
import { m as matchesMimeAllowlist, n as normalizeMime } from './mime-KV5TqkMN_8Fgolcvg.mjs';
import { c as computeContentHash } from './hash-DlUxGhQS_CP43UY8x.mjs';
import { a as apiError, u as unwrapResult, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { a as parseQuery, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { O as DEFAULT_MAX_UPLOAD_SIZE, S as formatFileSize, T as mediaListQuery } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { r as resolveFieldAllowlist, G as GLOBAL_UPLOAD_ALLOWLIST } from './media-allowlist-BNloC69x_D8ibW2MH.mjs';
import { ulid } from 'ulidx';
import * as path from 'node:path';

//#region src/media/placeholder.ts
/**
* Image Placeholder Generation
*
* Generates blurhash and dominant color from image buffers for LQIP support.
* Decodes images via jpeg-js (pure JS) and upng-js (pure JS, uses pako for
* deflate). No Node-specific dependencies — works in Workers and Node SSR.
*/
const SUPPORTED_TYPES = {
	"image/jpeg": "jpeg",
	"image/jpg": "jpeg",
	"image/png": "png"
};
/** Max width for blurhash input. Encode is O(w*h*components), so downsample first. */
const MAX_ENCODE_WIDTH = 32;
/** Max decoded RGBA size (32 MB). Images exceeding this skip placeholder generation. */
const MAX_DECODED_BYTES = 32 * 1024 * 1024;
/**
* Decode a JPEG buffer into raw RGBA pixel data.
*/
async function decodeJpeg(buffer) {
	const { decode } = await import('jpeg-js');
	const result = decode(buffer, { useTArray: true });
	return {
		width: result.width,
		height: result.height,
		data: result.data
	};
}
/**
* Decode a PNG buffer into raw RGBA pixel data.
* Uses upng-js (pure JS with pako deflate) — no Node zlib dependency.
*/
async function decodePng(buffer) {
	const UPNG = (await import('upng-js')).default;
	const img = UPNG.decode(buffer.buffer);
	const frames = UPNG.toRGBA8(img);
	const rgba = new Uint8Array(frames[0]);
	return {
		width: img.width,
		height: img.height,
		data: rgba
	};
}
/**
* Extract the dominant color from RGBA pixel data.
* Simple average of all non-transparent pixels.
*/
function extractDominantColor(data, width, height) {
	let r = 0;
	let g = 0;
	let b = 0;
	let count = 0;
	const len = width * height * 4;
	for (let i = 0; i < len; i += 4) {
		if (data[i + 3] < 128) continue;
		r += data[i];
		g += data[i + 1];
		b += data[i + 2];
		count++;
	}
	if (count === 0) return "rgb(0,0,0)";
	return `rgb(${Math.round(r / count)},${Math.round(g / count)},${Math.round(b / count)})`;
}
/**
* Read image dimensions from headers without decoding pixel data.
*/
function getImageDimensions(buffer) {
	try {
		const result = imageSize(buffer);
		if (result.width != null && result.height != null) return {
			width: result.width,
			height: result.height
		};
		return null;
	} catch {
		return null;
	}
}
/**
* Generate blurhash and dominant color from an image buffer.
* Returns null for non-image MIME types or on failure.
*
* @param dimensions - Optional pre-known dimensions. Used as a fallback when
*   image-size cannot parse the buffer (e.g. truncated headers). When the
*   decoded size (width * height * 4) exceeds MAX_DECODED_BYTES, placeholder
*   generation is skipped to avoid OOM on memory-constrained runtimes.
*/
async function generatePlaceholder(buffer, mimeType, dimensions) {
	const format = SUPPORTED_TYPES[mimeType];
	if (!format) return null;
	try {
		const dims = getImageDimensions(buffer) ?? dimensions;
		if (dims && dims.width * dims.height * 4 > MAX_DECODED_BYTES) return null;
		const { width, height, data } = format === "jpeg" ? await decodeJpeg(buffer) : await decodePng(buffer);
		if (width === 0 || height === 0) return null;
		let encodePixels;
		let encodeWidth;
		let encodeHeight;
		if (width > MAX_ENCODE_WIDTH) {
			const scale = MAX_ENCODE_WIDTH / width;
			encodeWidth = MAX_ENCODE_WIDTH;
			encodeHeight = Math.max(1, Math.round(height * scale));
			encodePixels = downsample(data, width, height, encodeWidth, encodeHeight);
		} else {
			encodeWidth = width;
			encodeHeight = height;
			encodePixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
		}
		return {
			blurhash: encode(encodePixels, encodeWidth, encodeHeight, 4, 3),
			dominantColor: extractDominantColor(data, width, height)
		};
	} catch {
		return null;
	}
}
/**
* Nearest-neighbor downsample of RGBA pixel data.
*/
function downsample(src, srcW, srcH, dstW, dstH) {
	const dst = new Uint8ClampedArray(dstW * dstH * 4);
	for (let y = 0; y < dstH; y++) {
		const srcY = Math.floor(y * srcH / dstH);
		for (let x = 0; x < dstW; x++) {
			const srcX = Math.floor(x * srcW / dstW);
			const srcIdx = (srcY * srcW + srcX) * 4;
			const dstIdx = (y * dstW + x) * 4;
			dst[dstIdx] = src[srcIdx];
			dst[dstIdx + 1] = src[srcIdx + 1];
			dst[dstIdx + 2] = src[srcIdx + 2];
			dst[dstIdx + 3] = src[srcIdx + 3];
		}
	}
	return dst;
}

//#region src/astro/routes/api/media.ts
/**
* Media list and upload endpoint
*
* GET /_emdash/api/media - List all media
* POST /_emdash/api/media - Upload new media (via configured storage adapter)
*/
const prerender = false;
/**
* Add URL to media items
* Uses relative URLs to ensure portability across deployments
*/
function addUrlToMedia(item) {
	return {
		...item,
		url: `/_emdash/api/media/file/${item.storageKey}`
	};
}
/**
* List media items
*/
const GET = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "media:read");
	if (denied) return denied;
	if (!emdash?.handleMediaList) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const query = parseQuery(new URL(request.url), mediaListQuery);
	if (isParseError(query)) return query;
	const result = await emdash.handleMediaList({
		cursor: query.cursor,
		limit: query.limit,
		mimeType: query.mimeType
	});
	if (!result.success) return unwrapResult(result);
	return apiSuccess({
		items: result.data.items.map((item) => addUrlToMedia(item)),
		nextCursor: result.data.nextCursor
	});
};
/**
* Upload media file
*
* Uses the configured storage adapter to store the file.
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "media:upload");
	if (denied) return denied;
	if (!emdash?.handleMediaCreate) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	if (!emdash?.storage) return apiError("NO_STORAGE", "Storage not configured", 500);
	try {
		const rawMax = emdash.config.maxUploadSize ?? DEFAULT_MAX_UPLOAD_SIZE;
		if (!Number.isFinite(rawMax) || rawMax <= 0) return apiError("CONFIGURATION_ERROR", "Invalid maxUploadSize configuration", 500);
		const maxUploadSize = rawMax;
		const contentLength = request.headers.get("Content-Length");
		if (contentLength && parseInt(contentLength, 10) > maxUploadSize) return apiError("PAYLOAD_TOO_LARGE", "Upload too large", 413);
		const formData = await request.formData();
		const fileEntry = formData.get("file");
		const file = fileEntry instanceof File ? fileEntry : null;
		if (!file) return apiError("NO_FILE", "No file provided", 400);
		const fieldIdEntry = formData.get("fieldId");
		const fieldId = typeof fieldIdEntry === "string" && fieldIdEntry.length > 0 ? fieldIdEntry : null;
		const allowlist = (fieldId ? await resolveFieldAllowlist(emdash.db, fieldId) : null) ?? [...GLOBAL_UPLOAD_ALLOWLIST];
		if (!matchesMimeAllowlist(file.type, allowlist)) return apiError("INVALID_TYPE", "File type not allowed", 400);
		if (file.size > maxUploadSize) return apiError("PAYLOAD_TOO_LARGE", `File exceeds maximum size of ${formatFileSize(maxUploadSize)}`, 413);
		const buffer = new Uint8Array(await file.arrayBuffer());
		const contentHash = await computeContentHash(buffer);
		const existing = await new MediaRepository(emdash.db).findByContentHash(contentHash);
		if (existing) return apiSuccess({
			item: addUrlToMedia(existing),
			deduplicated: true
		});
		const storageKey = `${ulid()}${path.extname(file.name) || ""}`;
		await emdash.storage.upload({
			key: storageKey,
			body: buffer,
			contentType: file.type
		});
		const widthEntry = formData.get("width");
		const widthStr = typeof widthEntry === "string" ? widthEntry : null;
		const heightEntry = formData.get("height");
		const heightStr = typeof heightEntry === "string" ? heightEntry : null;
		const width = widthStr ? parseInt(widthStr, 10) : void 0;
		const height = heightStr ? parseInt(heightStr, 10) : void 0;
		const thumbnailEntry = formData.get("thumbnail");
		const thumbnail = thumbnailEntry instanceof File ? thumbnailEntry : null;
		let placeholder = null;
		if (file.type.startsWith("image/")) if (thumbnail) placeholder = await generatePlaceholder(new Uint8Array(await thumbnail.arrayBuffer()), thumbnail.type);
		else {
			const clientDims = width && height ? {
				width,
				height
			} : void 0;
			placeholder = await generatePlaceholder(buffer, file.type, clientDims);
		}
		const result = await emdash.handleMediaCreate({
			filename: file.name,
			mimeType: normalizeMime(file.type),
			size: file.size,
			width,
			height,
			storageKey,
			contentHash,
			blurhash: placeholder?.blurhash,
			dominantColor: placeholder?.dominantColor,
			authorId: user?.id
		});
		if (!result.success) {
			try {
				await emdash.storage.delete(storageKey);
			} catch {}
			return unwrapResult(result);
		}
		return apiSuccess({ item: addUrlToMedia(result.data.item) }, 201);
	} catch (error) {
		return handleError(error, "Upload failed", "UPLOAD_ERROR");
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
