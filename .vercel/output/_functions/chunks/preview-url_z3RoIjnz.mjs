import { g as getI18nConfig } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { a as apiError, u as unwrapResult, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { b as parseOptionalBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { z as contentPreviewUrlBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { g as generatePreviewToken } from './tokens-N8otWMmj_DR2qeMwT.mjs';
import { r as resolveSecretsCached } from './secrets-rPdhEBkD_BN1YxHO5.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/preview/urls.ts
/**
* Preview URL generation
*
* Creates preview URLs that include a signed token for accessing draft content.
*/
const REPEATED_SLASHES = /\/{2,}/g;
/**
* Generate a preview URL for content
*
* The URL includes a `_preview` query parameter with a signed token.
*
* @example
* ```ts
* const url = await getPreviewUrl({
*   collection: "posts",
*   id: "hello-world",
*   secret: process.env.PREVIEW_SECRET!,
* });
* // Returns: /posts/hello-world?_preview=eyJj...
*
* // With base URL:
* const fullUrl = await getPreviewUrl({
*   collection: "posts",
*   id: "hello-world",
*   secret: process.env.PREVIEW_SECRET!,
*   baseUrl: "https://example.com",
* });
* // Returns: https://example.com/posts/hello-world?_preview=eyJj...
*
* // Custom path pattern:
* const customUrl = await getPreviewUrl({
*   collection: "posts",
*   id: "hello-world",
*   secret: process.env.PREVIEW_SECRET!,
*   pathPattern: "/blog/{id}",
* });
* // Returns: /blog/hello-world?_preview=eyJj...
* ```
*/
async function getPreviewUrl(options) {
	const { collection, id, secret, expiresIn = "1h", baseUrl, pathPattern = "/{collection}/{id}", locale = "" } = options;
	const token = await generatePreviewToken({
		contentId: `${collection}:${id}`,
		expiresIn,
		secret
	});
	let path = pathPattern.replace("{collection}", collection).replace("{id}", id).replace("{locale}", locale);
	path = path.replace(REPEATED_SLASHES, "/");
	if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
	const url = new URL(path, baseUrl || "http://placeholder");
	url.searchParams.set("_preview", token);
	if (!baseUrl) return `${url.pathname}${url.search}`;
	return url.toString();
}

const prerender = false;
const DURATION_PATTERN = /^(\d+)([smhdw])$/;
const POST = async ({ params, request, locals }) => {
  const { emdash, user } = locals;
  const denied = requirePerm(user, "content:read_drafts");
  if (denied) return denied;
  const collection = params.collection;
  const id = params.id;
  if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
  const { previewSecret } = await resolveSecretsCached(emdash.db);
  let entryLocale = null;
  if (emdash?.handleContentGet) {
    const result = await emdash.handleContentGet(collection, id);
    if (!result.success) return unwrapResult(result);
    entryLocale = result.data?.item?.locale ?? null;
  }
  const body = await parseOptionalBody(request, contentPreviewUrlBody, {});
  if (isParseError(body)) return body;
  const expiresIn = body.expiresIn || "1h";
  const defaultPathPattern = "/{collection}/{id}";
  const pathPattern = body.pathPattern || defaultPathPattern;
  const i18n = getI18nConfig();
  let localeSegment = "";
  if (entryLocale && i18n) localeSegment = entryLocale === i18n.defaultLocale && !i18n.prefixDefaultLocale ? "" : entryLocale;
  else if (entryLocale) localeSegment = entryLocale;
  const expiresInSeconds = typeof expiresIn === "number" ? expiresIn : parseExpiresIn(expiresIn);
  const expiresAt = Math.floor(Date.now() / 1e3) + expiresInSeconds;
  try {
    return apiSuccess({
      url: await getPreviewUrl({
        collection,
        id,
        secret: previewSecret,
        expiresIn,
        pathPattern,
        locale: localeSegment
      }),
      expiresAt
    });
  } catch (error) {
    return handleError(error, "Failed to generate preview URL", "TOKEN_ERROR");
  }
};
function parseExpiresIn(duration) {
  const match = duration.match(DURATION_PATTERN);
  if (!match) return 3600;
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case "s":
      return value;
    case "m":
      return value * 60;
    case "h":
      return value * 60 * 60;
    case "d":
      return value * 60 * 60 * 24;
    case "w":
      return value * 60 * 60 * 24 * 7;
    default:
      return 3600;
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
