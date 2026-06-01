import { a as encodeBase64url, b as decodeBase64url } from './base64-CqR-7kqF_R5uZi2Nl.mjs';

const DURATION_PATTERN = /^(\d+)([smhdw])$/;
function parseDuration(duration) {
  if (typeof duration === "number") return duration;
  const match = duration.match(DURATION_PATTERN);
  if (!match) throw new Error(`Invalid duration format: "${duration}". Use "1h", "30m", "1d", "2w", or seconds.`);
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
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
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}
async function createSignature(data, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return new Uint8Array(signature);
}
async function verifySignature(data, signature, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, ["verify"]);
  const sigBuffer = new ArrayBuffer(signature.byteLength);
  new Uint8Array(sigBuffer).set(signature);
  return crypto.subtle.verify("HMAC", key, sigBuffer, encoder.encode(data));
}
async function generatePreviewToken(options) {
  const { contentId, expiresIn = "1h", secret } = options;
  if (!secret) throw new Error("Preview secret is required");
  if (!contentId || !contentId.includes(":")) throw new Error('Content ID must be in format "collection:id"');
  const now = Math.floor(Date.now() / 1e3);
  const payload = {
    cid: contentId,
    exp: now + parseDuration(expiresIn),
    iat: now
  };
  const payloadJson = JSON.stringify(payload);
  const encodedPayload = encodeBase64url(new TextEncoder().encode(payloadJson));
  return `${encodedPayload}.${encodeBase64url(await createSignature(encodedPayload, secret))}`;
}
async function verifyPreviewToken(options) {
  const { secret } = options;
  if (!secret) throw new Error("Preview secret is required");
  const token = "url" in options ? options.url.searchParams.get("_preview") : options.token;
  if (!token) return {
    valid: false,
    error: "none"
  };
  const parts = token.split(".");
  if (parts.length !== 2) return {
    valid: false,
    error: "malformed"
  };
  const [encodedPayload, encodedSignature] = parts;
  let signature;
  try {
    signature = decodeBase64url(encodedSignature);
  } catch {
    return {
      valid: false,
      error: "malformed"
    };
  }
  if (!await verifySignature(encodedPayload, signature, secret)) return {
    valid: false,
    error: "invalid"
  };
  let payload;
  try {
    const payloadBytes = decodeBase64url(encodedPayload);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    payload = JSON.parse(payloadJson);
  } catch {
    return {
      valid: false,
      error: "malformed"
    };
  }
  if (typeof payload.cid !== "string" || typeof payload.exp !== "number" || typeof payload.iat !== "number") return {
    valid: false,
    error: "malformed"
  };
  const now = Math.floor(Date.now() / 1e3);
  if (payload.exp < now) return {
    valid: false,
    error: "expired"
  };
  return {
    valid: true,
    payload
  };
}
function parseContentId(contentId) {
  const colonIndex = contentId.indexOf(":");
  if (colonIndex === -1) throw new Error('Content ID must be in format "collection:id"');
  return {
    collection: contentId.slice(0, colonIndex),
    id: contentId.slice(colonIndex + 1)
  };
}

export { generatePreviewToken as g, parseContentId as p, verifyPreviewToken as v };
