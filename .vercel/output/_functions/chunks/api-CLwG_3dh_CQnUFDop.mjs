import { f as validatePluginIdentifier, I as InvalidCursorError, E as EmDashValidationError, g as getI18nConfig, h as isI18nEnabled, v as validateIdentifier } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { t as ContentRepository, r as RevisionRepository } from './content-C0ooIs-f_Bwo8eX_E.mjs';
import { e as encodeBase64, d as decodeBase64 } from './base64-CqR-7kqF_R5uZi2Nl.mjs';
import { M as MediaRepository } from './media-oqRcNiQf_LipfpTx8.mjs';
import { C as CommentRepository } from './comment-_yzlBYPx_CEy8OX5F.mjs';
import { w as withTransaction } from './transaction-NQj4VJ7Z_CWeepMQn.mjs';
import { R as RedirectRepository } from './redirect-CNv4mHX2_DtN1rCAr.mjs';
import { n as chunks, t as SQL_BATCH_SIZE } from './chunks-BkfVdD-3_DFCxAf1E.mjs';
import { B as BylineRepository } from './byline-CTaWkMh5_BRoEzpjM.mjs';
import { p as pluginManifestSchema, n as normalizeManifestRoute, S as SeoRepository } from './manifest-schema-Czqf0TLu_DL1mkBBG.mjs';
import { r as invalidateRedirectCache } from './cache-CNk1jIxp_DFeVYLPD.mjs';
import { i as isMissingTableError } from './db-errors-CGN9kJfo_CxKNWoxM.mjs';
import { m as matchesMimeAllowlist, p as parseAllowedMimeTypes } from './mime-KV5TqkMN_8Fgolcvg.mjs';
import { r as requestCached } from './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import { S as SchemaRegistry, a as SchemaError } from './registry-DqrAQDXH_ByM39WgY.mjs';
import { normalizeCapabilities } from '@emdash-cms/plugin-types';
import { r as resolveAndValidateExternalUrl, S as SsrfError } from './ssrf-MZ-zrG6-_C2NT9OCQ.mjs';
import { sql } from 'kysely';
import { createGzipDecoder, unpackTar } from 'modern-tar';
import { ClientValidationError, ClientResponseError } from '@atcute/client';

//#region src/storage/types.ts
/**
* Storage error with additional context
*/
var EmDashStorageError = class extends Error {
	constructor(message, code, cause) {
		super(message);
		this.code = code;
		this.cause = cause;
		this.name = "EmDashStorageError";
	}
};

function encodeRev(item) {
  return encodeBase64(`${item.version}:${item.updatedAt}`);
}
function decodeRev(rev) {
  try {
    const decoded = decodeBase64(rev);
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) return null;
    const version = parseInt(decoded.slice(0, colonIdx), 10);
    const updatedAt = decoded.slice(colonIdx + 1);
    if (isNaN(version) || !updatedAt) return null;
    return {
      version,
      updatedAt
    };
  } catch {
    return null;
  }
}
function validateRev(rev, item) {
  if (!rev) return { valid: true };
  const decoded = decodeRev(rev);
  if (!decoded) return {
    valid: false,
    message: "Malformed _rev token"
  };
  if (decoded.version !== item.version || decoded.updatedAt !== item.updatedAt) return {
    valid: false,
    message: "Content has been modified since last read (version conflict)"
  };
  return { valid: true };
}
function asMediaRef(value) {
  if (value === null || value === void 0) return null;
  if (typeof value !== "object" || Array.isArray(value)) return null;
  return value;
}
function fail(message) {
  return {
    success: false,
    error: {
      code: "INVALID_MIME_FOR_FIELD",
      message
    }
  };
}
async function loadMediaFieldsForCollection(db, collectionSlug) {
  const rows = await db.selectFrom("_emdash_fields").innerJoin("_emdash_collections", "_emdash_collections.id", "_emdash_fields.collection_id").select([
    "_emdash_fields.slug",
    "_emdash_fields.type",
    "_emdash_fields.validation"
  ]).where("_emdash_collections.slug", "=", collectionSlug).where("_emdash_fields.type", "in", ["file", "image"]).execute();
  const out = [];
  for (const row of rows) {
    const list = parseAllowedMimeTypes(row.validation);
    if (!list) continue;
    out.push({
      slug: row.slug,
      type: row.type,
      allowedMimeTypes: list
    });
  }
  return out;
}
async function validateMediaFields(db, collectionSlug, data) {
  const fields = await requestCached(`mediaFields:${collectionSlug}`, () => loadMediaFieldsForCollection(db, collectionSlug));
  if (fields.length === 0) return {
    success: true,
    data: true
  };
  const localIds = /* @__PURE__ */ new Set();
  for (const field of fields) {
    const ref = asMediaRef(data[field.slug]);
    if (!ref) continue;
    if ((typeof ref.provider === "string" ? ref.provider : "local") === "local" && typeof ref.id === "string") localIds.add(ref.id);
  }
  const idList = [...localIds];
  const mimeById = /* @__PURE__ */ new Map();
  if (idList.length > 0) for (const batch of chunks(idList, SQL_BATCH_SIZE)) {
    const rows = await db.selectFrom("media").select(["id", "mime_type"]).where("id", "in", batch).execute();
    for (const r of rows) mimeById.set(r.id, r.mime_type);
  }
  for (const field of fields) {
    const value = data[field.slug];
    if (value === null || value === void 0) continue;
    const ref = asMediaRef(value);
    if (!ref) continue;
    const provider = typeof ref.provider === "string" ? ref.provider : "local";
    let mime;
    if (provider === "local") {
      if (typeof ref.id !== "string") return fail(`Field '${field.slug}' references media with an invalid id`);
      mime = mimeById.get(ref.id);
      if (!mime) return fail(`Field '${field.slug}' references media with unknown MIME type`);
    } else {
      if (typeof ref.mimeType !== "string") return fail(`Field '${field.slug}' requires a mimeType declaration for non-local media`);
      mime = ref.mimeType;
    }
    if (!matchesMimeAllowlist(mime, field.allowedMimeTypes)) return fail(`Field '${field.slug}' does not accept ${mime}`);
  }
  return {
    success: true,
    data: true
  };
}
function hasApiError(error) {
  if (!(error instanceof Error) || !("apiError" in error)) return false;
  const { apiError } = error;
  return typeof apiError === "object" && apiError !== null && "code" in apiError && typeof apiError.code === "string";
}
function getSlugSource(data) {
  if (typeof data.title === "string" && data.title.length > 0) return data.title;
  if (typeof data.name === "string" && data.name.length > 0) return data.name;
  return null;
}
const SEO_DEFAULTS = {
  title: null,
  description: null,
  image: null,
  canonical: null,
  noIndex: false
};
async function collectionHasSeo(db, collection) {
  return (await db.selectFrom("_emdash_collections").select("has_seo").where("slug", "=", collection).executeTakeFirst())?.has_seo === 1;
}
async function hydrateSeo(db, collection, item, hasSeo) {
  if (!hasSeo) return;
  item.seo = await new SeoRepository(db).get(collection, item.id);
}
async function hydrateSeoMany(db, collection, items, hasSeo) {
  if (!hasSeo || items.length === 0) return;
  const seoMap = await new SeoRepository(db).getMany(collection, items.map((i) => i.id));
  for (const item of items) item.seo = seoMap.get(item.id) ?? { ...SEO_DEFAULTS };
}
async function hydrateBylines(db, collection, item) {
  const bylineRepo = new BylineRepository(db);
  const localeOpt = item.locale ? { locale: item.locale } : void 0;
  const bylines = await bylineRepo.getContentBylines(collection, item.id, localeOpt);
  if (bylines.length > 0) {
    item.bylines = bylines.map((c) => ({
      ...c,
      source: "explicit"
    }));
    item.byline = bylines[0]?.byline ?? null;
    return;
  }
  if (item.primaryBylineId) {
    item.bylines = [];
    item.byline = null;
    return;
  }
  if (item.authorId) {
    const fallback = await bylineRepo.findByUserId(item.authorId, localeOpt);
    if (fallback) {
      item.bylines = [{
        byline: fallback,
        sortOrder: 0,
        roleLabel: null,
        source: "inferred"
      }];
      item.byline = fallback;
      return;
    }
  }
  item.bylines = [];
  item.byline = null;
}
async function hydrateBylinesMany(db, collection, items) {
  if (items.length === 0) return;
  const bylineRepo = new BylineRepository(db);
  const localeBuckets = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = item.locale ?? null;
    const bucket = localeBuckets.get(key);
    if (bucket) bucket.push(item);
    else localeBuckets.set(key, [item]);
  }
  const bylinesByItem = /* @__PURE__ */ new Map();
  const itemsNeedingAuthorCheck = [];
  for (const [locale, bucket] of localeBuckets) {
    const localeOpt = locale ? { locale } : void 0;
    const ids = bucket.map((i) => i.id);
    const credits = await bylineRepo.getContentBylinesMany(collection, ids, localeOpt);
    for (const [id, list] of credits) bylinesByItem.set(id, list);
    for (const item of bucket) {
      if (credits.has(item.id) && credits.get(item.id).length > 0) continue;
      if (item.authorId) itemsNeedingAuthorCheck.push(item);
    }
  }
  const fallbackByItem = /* @__PURE__ */ new Map();
  if (itemsNeedingAuthorCheck.length > 0) {
    const authorBuckets = /* @__PURE__ */ new Map();
    for (const item of itemsNeedingAuthorCheck) {
      if (item.primaryBylineId) continue;
      const key = item.locale ?? null;
      const bucket = authorBuckets.get(key);
      if (bucket) bucket.push(item);
      else authorBuckets.set(key, [item]);
    }
    for (const [locale, bucket] of authorBuckets) {
      const localeOpt = locale ? { locale } : void 0;
      const authorIds = bucket.map((i) => i.authorId).filter((id) => id !== null);
      const uniqueAuthorIds = [...new Set(authorIds)];
      if (uniqueAuthorIds.length === 0) continue;
      const authorMap = await bylineRepo.findByUserIds(uniqueAuthorIds, localeOpt);
      for (const item of bucket) {
        if (!item.authorId) continue;
        const f = authorMap.get(item.authorId);
        if (f) fallbackByItem.set(item.id, f);
      }
    }
  }
  for (const item of items) {
    const explicit = bylinesByItem.get(item.id);
    if (explicit && explicit.length > 0) {
      item.bylines = explicit.map((c) => ({
        ...c,
        source: "explicit"
      }));
      item.byline = explicit[0]?.byline ?? null;
      continue;
    }
    const fallback = fallbackByItem.get(item.id);
    if (fallback) {
      item.bylines = [{
        byline: fallback,
        sortOrder: 0,
        roleLabel: null,
        source: "inferred"
      }];
      item.byline = fallback;
      continue;
    }
    item.bylines = [];
    item.byline = null;
  }
}
async function resolveId(repo, collection, identifier, locale) {
  return (await repo.findByIdOrSlug(collection, identifier, locale))?.id ?? null;
}
async function resolveIdIncludingTrashed(repo, collection, identifier, locale) {
  return (await repo.findByIdOrSlugIncludingTrashed(collection, identifier, locale))?.id ?? null;
}
async function handleContentList(db, collection, params) {
  try {
    const repo = new ContentRepository(db);
    const where = {};
    if (params.status) where.status = params.status;
    if (params.locale) where.locale = params.locale;
    const result = await repo.findMany(collection, {
      cursor: params.cursor,
      limit: params.limit || 50,
      where: Object.keys(where).length > 0 ? where : void 0,
      orderBy: params.orderBy ? {
        field: params.orderBy,
        direction: params.order || "desc"
      } : void 0
    });
    const hasSeo = await collectionHasSeo(db, collection);
    await hydrateSeoMany(db, collection, result.items, hasSeo);
    await hydrateBylinesMany(db, collection, result.items);
    return {
      success: true,
      data: {
        items: result.items,
        nextCursor: result.nextCursor,
        total: result.total
      }
    };
  } catch (error) {
    if (error instanceof InvalidCursorError) return {
      success: false,
      error: {
        code: "INVALID_CURSOR",
        message: error.message
      }
    };
    if (isMissingTableError(error)) return {
      success: false,
      error: {
        code: "COLLECTION_NOT_FOUND",
        message: `Collection '${collection}' not found`
      }
    };
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    console.error("Content list error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_LIST_ERROR",
        message: "Failed to list content"
      }
    };
  }
}
async function handleContentGet(db, collection, id, locale) {
  try {
    const item = await new ContentRepository(db).findByIdOrSlug(collection, id, locale);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    await hydrateBylines(db, collection, item);
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    console.error("Content get error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_GET_ERROR",
        message: "Failed to get content"
      }
    };
  }
}
async function handleContentGetIncludingTrashed(db, collection, id, locale) {
  try {
    const item = await new ContentRepository(db).findByIdOrSlugIncludingTrashed(collection, id, locale);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    await hydrateBylines(db, collection, item);
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    console.error("Content get error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_GET_ERROR",
        message: "Failed to get content"
      }
    };
  }
}
async function handleContentCreate(db, collection, body) {
  try {
    const hasSeo = await collectionHasSeo(db, collection);
    if (body.seo && !hasSeo) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
      }
    };
    const mimeCheck = await validateMediaFields(db, collection, body.data);
    if (!mimeCheck.success) return mimeCheck;
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const bylineRepo = new BylineRepository(trx);
      const effectiveLocale = body.locale ?? getI18nConfig()?.defaultLocale;
      let slug = body.slug;
      if (!slug) {
        const slugSource = getSlugSource(body.data);
        if (slugSource) slug = await repo.generateUniqueSlug(collection, slugSource, effectiveLocale);
      }
      const created = await repo.create({
        type: collection,
        slug,
        data: body.data,
        status: body.status || "draft",
        authorId: body.authorId,
        locale: effectiveLocale,
        translationOf: body.translationOf,
        createdAt: body.createdAt,
        publishedAt: body.publishedAt
      });
      if (body.bylines !== void 0) created.primaryBylineId = (await bylineRepo.setContentBylines(collection, created.id, body.bylines))[0]?.byline.translationGroup ?? null;
      if (body.translationOf) {
        const { TaxonomyRepository } = await import('./taxonomy-D4Uc2LsZ_BcrFt9f5.mjs').then((n) => n.n);
        await new TaxonomyRepository(trx).copyEntryTerms(collection, body.translationOf, created.id);
        if (body.bylines === void 0) {
          await bylineRepo.copyContentBylines(collection, body.translationOf, created.id);
          const source = await repo.findById(collection, body.translationOf);
          if (source) created.primaryBylineId = source.primaryBylineId;
        }
      }
      await hydrateBylines(trx, collection, created);
      if (body.seo && hasSeo) created.seo = await new SeoRepository(trx).upsert(collection, created.id, body.seo);
      else if (hasSeo) created.seo = { ...SEO_DEFAULTS };
      return created;
    });
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    if (isMissingTableError(error)) return {
      success: false,
      error: {
        code: "COLLECTION_NOT_FOUND",
        message: `Collection '${collection}' not found`
      }
    };
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("unique constraint failed") || message.includes("duplicate key")) {
      if (message.includes("slug")) return {
        success: false,
        error: {
          code: "SLUG_CONFLICT",
          message: `Slug '${body.slug ?? "(auto-generated)"}' already exists in collection '${collection}'`
        }
      };
      return {
        success: false,
        error: {
          code: "CONFLICT",
          message: "Unique constraint violation"
        }
      };
    }
    console.error("Content create error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_CREATE_ERROR",
        message: "Failed to create content"
      }
    };
  }
}
async function handleContentUpdate(db, collection, id, body) {
  try {
    const hasSeo = await collectionHasSeo(db, collection);
    if (body.seo && !hasSeo) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Collection "${collection}" does not have SEO enabled. Remove the seo field or enable SEO on this collection.`
      }
    };
    if (body.data) {
      const mimeCheck = await validateMediaFields(db, collection, body.data);
      if (!mimeCheck.success) return mimeCheck;
    }
    const resolvedId = await resolveId(new ContentRepository(db), collection, id) ?? id;
    const item = await withTransaction(db, async (trx) => {
      const trxRepo = new ContentRepository(trx);
      const bylineRepo = new BylineRepository(trx);
      const existing = body._rev || body.slug ? await trxRepo.findById(collection, resolvedId) : null;
      if (body._rev) {
        if (!existing) throw Object.assign(/* @__PURE__ */ new Error(`Content item not found: ${id}`), { apiError: { code: "NOT_FOUND" } });
        const revCheck = validateRev(body._rev, existing);
        if (!revCheck.valid) throw Object.assign(new Error(revCheck.message), { apiError: { code: "CONFLICT" } });
      }
      let oldSlug;
      if (body.slug && existing?.slug && existing.slug !== body.slug) oldSlug = existing.slug;
      const updated = await trxRepo.update(collection, resolvedId, {
        data: body.data,
        slug: body.slug,
        status: body.status,
        authorId: body.authorId,
        publishedAt: body.publishedAt
      });
      if (body.bylines !== void 0) updated.primaryBylineId = (await bylineRepo.setContentBylines(collection, resolvedId, body.bylines))[0]?.byline.translationGroup ?? null;
      if (oldSlug && body.slug) {
        const collectionRow = await trx.selectFrom("_emdash_collections").select("url_pattern").where("slug", "=", collection).executeTakeFirst();
        await new RedirectRepository(trx).createAutoRedirect(collection, oldSlug, body.slug, resolvedId, collectionRow?.url_pattern ?? null);
        invalidateRedirectCache();
      }
      if (isI18nEnabled() && body.data && updated.translationGroup) await syncNonTranslatableFields(trx, collection, updated.id, updated.translationGroup, body.data);
      if (body.seo && hasSeo) updated.seo = await new SeoRepository(trx).upsert(collection, resolvedId, body.seo);
      else if (hasSeo) updated.seo = await new SeoRepository(trx).get(collection, resolvedId);
      await hydrateBylines(trx, collection, updated);
      return updated;
    });
    return {
      success: true,
      data: {
        item,
        _rev: encodeRev(item)
      }
    };
  } catch (error) {
    if (hasApiError(error)) return {
      success: false,
      error: {
        code: error.apiError.code,
        message: error.message
      }
    };
    if (isMissingTableError(error)) return {
      success: false,
      error: {
        code: "COLLECTION_NOT_FOUND",
        message: `Collection '${collection}' not found`
      }
    };
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("unique constraint failed") || message.includes("duplicate key")) {
      if (message.includes("slug")) return {
        success: false,
        error: {
          code: "SLUG_CONFLICT",
          message: `Slug '${body.slug ?? id}' already exists in collection '${collection}'`
        }
      };
      return {
        success: false,
        error: {
          code: "CONFLICT",
          message: "Unique constraint violation"
        }
      };
    }
    console.error("Content update error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_UPDATE_ERROR",
        message: "Failed to update content"
      }
    };
  }
}
async function handleContentDuplicate(db, collection, id, authorId) {
  try {
    const hasSeo = await collectionHasSeo(db, collection);
    return {
      success: true,
      data: { item: await withTransaction(db, async (trx) => {
        const repo = new ContentRepository(trx);
        const bylineRepo = new BylineRepository(trx);
        const resolvedId = await resolveId(repo, collection, id) ?? id;
        const dup = await repo.duplicate(collection, resolvedId, authorId);
        const existingBylines = await bylineRepo.getContentBylines(collection, resolvedId);
        if (existingBylines.length > 0) await bylineRepo.setContentBylines(collection, dup.id, existingBylines.map((entry) => ({
          bylineId: entry.byline.id,
          roleLabel: entry.roleLabel
        })));
        if (hasSeo) {
          const seoRepo = new SeoRepository(trx);
          await seoRepo.copyForDuplicate(collection, resolvedId, dup.id);
          dup.seo = await seoRepo.get(collection, dup.id);
        }
        await hydrateBylines(trx, collection, dup);
        return dup;
      }) }
    };
  } catch (err) {
    if (err instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: err.message
      }
    };
    console.error("Content duplicate error:", err);
    return {
      success: false,
      error: {
        code: "CONTENT_DUPLICATE_ERROR",
        message: "Failed to duplicate content"
      }
    };
  }
}
async function handleContentDelete(db, collection, id) {
  try {
    if (!await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.delete(collection, resolvedId);
    })) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { deleted: true }
    };
  } catch (error) {
    console.error("Content delete error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_DELETE_ERROR",
        message: "Failed to delete content"
      }
    };
  }
}
async function handleContentRestore(db, collection, id) {
  try {
    if (!await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveIdIncludingTrashed(repo, collection, id) ?? id;
      return repo.restore(collection, resolvedId);
    })) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Trashed content item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { restored: true }
    };
  } catch (error) {
    console.error("Content restore error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_RESTORE_ERROR",
        message: "Failed to restore content"
      }
    };
  }
}
async function handleContentPermanentDelete(db, collection, id) {
  try {
    const resolvedId = await resolveIdIncludingTrashed(new ContentRepository(db), collection, id) ?? id;
    if (!await withTransaction(db, async (trx) => {
      const wasDeleted = await new ContentRepository(trx).permanentDelete(collection, resolvedId);
      if (wasDeleted) {
        await new SeoRepository(trx).delete(collection, resolvedId);
        await new CommentRepository(trx).deleteByContent(collection, resolvedId);
        await new RevisionRepository(trx).deleteByEntry(collection, resolvedId);
      }
      return wasDeleted;
    })) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { deleted: true }
    };
  } catch (error) {
    console.error("Content permanent delete error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_DELETE_ERROR",
        message: "Failed to permanently delete content"
      }
    };
  }
}
async function handleContentListTrashed(db, collection, options = {}) {
  try {
    const result = await new ContentRepository(db).findTrashed(collection, {
      limit: options.limit,
      cursor: options.cursor
    });
    return {
      success: true,
      data: {
        items: result.items.map((item) => ({
          id: item.id,
          type: item.type,
          slug: item.slug,
          status: item.status,
          data: item.data,
          authorId: item.authorId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          publishedAt: item.publishedAt,
          deletedAt: item.deletedAt
        })),
        nextCursor: result.nextCursor
      }
    };
  } catch (error) {
    if (error instanceof InvalidCursorError) return {
      success: false,
      error: {
        code: "INVALID_CURSOR",
        message: error.message
      }
    };
    console.error("Content list trashed error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_LIST_ERROR",
        message: "Failed to list trashed content"
      }
    };
  }
}
async function handleContentCountTrashed(db, collection) {
  try {
    return {
      success: true,
      data: { count: await new ContentRepository(db).countTrashed(collection) }
    };
  } catch (error) {
    console.error("Content count trashed error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_COUNT_ERROR",
        message: "Failed to count trashed content"
      }
    };
  }
}
async function handleContentSchedule(db, collection, id, scheduledAt) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.schedule(collection, resolvedId, scheduledAt);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    console.error("Content schedule error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_SCHEDULE_ERROR",
        message: "Failed to schedule content"
      }
    };
  }
}
async function handleContentUnschedule(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.unschedule(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    console.error("Content unschedule error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_UNSCHEDULE_ERROR",
        message: "Failed to unschedule content"
      }
    };
  }
}
async function handleContentPublish(db, collection, id, options = {}) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.publish(collection, resolvedId, options.publishedAt);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    console.error("Content publish error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_PUBLISH_ERROR",
        message: "Failed to publish content"
      }
    };
  }
}
async function handleContentUnpublish(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.unpublish(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message
      }
    };
    console.error("Content unpublish error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_UNPUBLISH_ERROR",
        message: "Failed to unpublish content"
      }
    };
  }
}
async function handleContentCountScheduled(db, collection) {
  try {
    return {
      success: true,
      data: { count: await new ContentRepository(db).countScheduled(collection) }
    };
  } catch (error) {
    console.error("Content count scheduled error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_COUNT_ERROR",
        message: "Failed to count scheduled content"
      }
    };
  }
}
async function handleContentDiscardDraft(db, collection, id) {
  try {
    const item = await withTransaction(db, async (trx) => {
      const repo = new ContentRepository(trx);
      const resolvedId = await resolveId(repo, collection, id) ?? id;
      return repo.discardDraft(collection, resolvedId);
    });
    await hydrateSeo(db, collection, item, await collectionHasSeo(db, collection));
    return {
      success: true,
      data: { item }
    };
  } catch (error) {
    if (error instanceof EmDashValidationError) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: error.message
      }
    };
    console.error("Content discard draft error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_DISCARD_DRAFT_ERROR",
        message: "Failed to discard draft"
      }
    };
  }
}
async function handleContentCompare(db, collection, id) {
  try {
    const entry = await new ContentRepository(db).findByIdOrSlug(collection, id);
    if (!entry) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    const revisionRepo = new RevisionRepository(db);
    const live = entry.liveRevisionId ? await revisionRepo.findById(entry.liveRevisionId) : null;
    const draft = entry.draftRevisionId ? await revisionRepo.findById(entry.draftRevisionId) : null;
    return {
      success: true,
      data: {
        hasChanges: entry.draftRevisionId !== null && entry.draftRevisionId !== entry.liveRevisionId,
        live: live?.data ?? null,
        draft: draft?.data ?? null
      }
    };
  } catch (error) {
    console.error("Content compare error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_COMPARE_ERROR",
        message: "Failed to compare revisions"
      }
    };
  }
}
async function handleContentTranslations(db, collection, id) {
  try {
    const repo = new ContentRepository(db);
    const item = await repo.findByIdOrSlug(collection, id);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Content item not found: ${id}`
      }
    };
    if (!item.translationGroup) return {
      success: true,
      data: {
        translationGroup: item.id,
        translations: [{
          id: item.id,
          locale: item.locale,
          slug: item.slug,
          status: item.status,
          updatedAt: item.updatedAt
        }]
      }
    };
    const translations = await repo.findTranslations(collection, item.translationGroup);
    return {
      success: true,
      data: {
        translationGroup: item.translationGroup,
        translations: translations.map((t) => ({
          id: t.id,
          locale: t.locale,
          slug: t.slug,
          status: t.status,
          updatedAt: t.updatedAt
        }))
      }
    };
  } catch (error) {
    if (error instanceof Error) console.error("Content translations error:", error);
    return {
      success: false,
      error: {
        code: "CONTENT_TRANSLATIONS_ERROR",
        message: "Failed to get translations"
      }
    };
  }
}
async function syncNonTranslatableFields(trx, collectionSlug, updatedItemId, translationGroup, data) {
  const collection = await trx.selectFrom("_emdash_collections").select("id").where("slug", "=", collectionSlug).executeTakeFirst();
  if (!collection) return;
  const nonTranslatableSlugs = (await trx.selectFrom("_emdash_fields").select("slug").where("collection_id", "=", collection.id).where("translatable", "=", 0).execute()).map((f) => f.slug);
  if (nonTranslatableSlugs.length === 0) return;
  const syncData = {};
  for (const slug of nonTranslatableSlugs) if (slug in data) syncData[slug] = data[slug];
  if (Object.keys(syncData).length === 0) return;
  validateIdentifier(collectionSlug, "collection slug");
  const tableName = `ec_${collectionSlug}`;
  const setClauses = Object.entries(syncData).map(([key, value]) => {
    validateIdentifier(key, "field slug");
    const serialized = typeof value === "object" && value !== null ? JSON.stringify(value) : value;
    return sql`${sql.ref(key)} = ${serialized}`;
  });
  await sql`
		UPDATE ${sql.ref(tableName)}
		SET ${sql.join(setClauses, sql`, `)}
		WHERE translation_group = ${translationGroup}
		AND id != ${updatedItemId}
	`.execute(trx);
}
async function handleRevisionList(db, collection, entryId, params = {}) {
  try {
    const repo = new RevisionRepository(db);
    const [items, total] = await Promise.all([repo.findByEntry(collection, entryId, { limit: Math.min(params.limit || 50, 100) }), repo.countByEntry(collection, entryId)]);
    return {
      success: true,
      data: {
        items,
        total
      }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "REVISION_LIST_ERROR",
        message: "Failed to list revisions"
      }
    };
  }
}
async function handleRevisionGet(db, revisionId) {
  try {
    const item = await new RevisionRepository(db).findById(revisionId);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Revision not found: ${revisionId}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "REVISION_GET_ERROR",
        message: "Failed to get revision"
      }
    };
  }
}
async function handleRevisionRestore(db, revisionId, callerUserId) {
  try {
    const revision = await new RevisionRepository(db).findById(revisionId);
    if (!revision) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Revision not found: ${revisionId}`
      }
    };
    const { _slug, ...fieldData } = revision.data;
    const item = await withTransaction(db, async (trx) => {
      const trxContentRepo = new ContentRepository(trx);
      const trxRevisionRepo = new RevisionRepository(trx);
      const updated = await trxContentRepo.update(revision.collection, revision.entryId, {
        data: fieldData,
        slug: typeof _slug === "string" ? _slug : void 0
      });
      await trxRevisionRepo.create({
        collection: revision.collection,
        entryId: revision.entryId,
        data: revision.data,
        authorId: callerUserId
      });
      return updated;
    });
    new RevisionRepository(db).pruneOldRevisions(revision.collection, revision.entryId, 50).catch(() => {
    });
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "REVISION_RESTORE_ERROR",
        message: "Failed to restore revision"
      }
    };
  }
}
async function handleMediaList(db, params) {
  try {
    const result = await new MediaRepository(db).findMany({
      cursor: params.cursor,
      limit: Math.min(params.limit || 50, 100),
      mimeType: params.mimeType
    });
    return {
      success: true,
      data: {
        items: result.items,
        nextCursor: result.nextCursor
      }
    };
  } catch (error) {
    if (error instanceof InvalidCursorError) return {
      success: false,
      error: {
        code: "INVALID_CURSOR",
        message: error.message
      }
    };
    return {
      success: false,
      error: {
        code: "MEDIA_LIST_ERROR",
        message: "Failed to list media"
      }
    };
  }
}
async function handleMediaGet(db, id) {
  try {
    const item = await new MediaRepository(db).findById(id);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Media item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_GET_ERROR",
        message: "Failed to get media"
      }
    };
  }
}
async function handleMediaCreate(db, input) {
  try {
    return {
      success: true,
      data: { item: await new MediaRepository(db).create(input) }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_CREATE_ERROR",
        message: "Failed to create media"
      }
    };
  }
}
async function handleMediaUpdate(db, id, input) {
  try {
    const item = await new MediaRepository(db).update(id, input);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Media item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_UPDATE_ERROR",
        message: "Failed to update media"
      }
    };
  }
}
async function handleMediaDelete(db, id) {
  try {
    if (!await new MediaRepository(db).delete(id)) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Media item not found: ${id}`
      }
    };
    return {
      success: true,
      data: { deleted: true }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "MEDIA_DELETE_ERROR",
        message: "Failed to delete media"
      }
    };
  }
}
async function handleSchemaCollectionList(db) {
  try {
    return {
      success: true,
      data: { items: await new SchemaRegistry(db).listCollections() }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "SCHEMA_LIST_ERROR",
        message: "Failed to list collections"
      }
    };
  }
}
async function handleSchemaCollectionGet(db, slug, options) {
  try {
    const registry = new SchemaRegistry(db);
    if (options?.includeFields) {
      const item2 = await registry.getCollectionWithFields(slug);
      if (!item2) return {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Collection not found: ${slug}`
        }
      };
      return {
        success: true,
        data: { item: item2 }
      };
    }
    const item = await registry.getCollection(slug);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Collection not found: ${slug}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "SCHEMA_GET_ERROR",
        message: "Failed to get collection"
      }
    };
  }
}
async function handleSchemaCollectionCreate(db, input) {
  try {
    return {
      success: true,
      data: { item: await new SchemaRegistry(db).createCollection(input) }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    console.error("[emdash] Failed to create collection:", error);
    return {
      success: false,
      error: {
        code: "SCHEMA_CREATE_ERROR",
        message: "Failed to create collection"
      }
    };
  }
}
async function handleSchemaCollectionUpdate(db, slug, input) {
  try {
    return {
      success: true,
      data: { item: await new SchemaRegistry(db).updateCollection(slug, input) }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "SCHEMA_UPDATE_ERROR",
        message: "Failed to update collection"
      }
    };
  }
}
async function handleSchemaCollectionDelete(db, slug, options) {
  try {
    await new SchemaRegistry(db).deleteCollection(slug, options);
    return {
      success: true,
      data: { success: true }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "SCHEMA_DELETE_ERROR",
        message: "Failed to delete collection"
      }
    };
  }
}
async function handleSchemaFieldList(db, collectionSlug) {
  try {
    const registry = new SchemaRegistry(db);
    const collection = await registry.getCollection(collectionSlug);
    if (!collection) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Collection not found: ${collectionSlug}`
      }
    };
    return {
      success: true,
      data: { items: await registry.listFields(collection.id) }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "SCHEMA_FIELD_LIST_ERROR",
        message: "Failed to list fields"
      }
    };
  }
}
async function handleSchemaFieldGet(db, collectionSlug, fieldSlug) {
  try {
    const item = await new SchemaRegistry(db).getField(collectionSlug, fieldSlug);
    if (!item) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Field not found: ${fieldSlug} in collection ${collectionSlug}`
      }
    };
    return {
      success: true,
      data: { item }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "SCHEMA_FIELD_GET_ERROR",
        message: "Failed to get field"
      }
    };
  }
}
async function handleSchemaFieldCreate(db, collectionSlug, input) {
  try {
    return {
      success: true,
      data: { item: await new SchemaRegistry(db).createField(collectionSlug, input) }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "SCHEMA_FIELD_CREATE_ERROR",
        message: "Failed to create field"
      }
    };
  }
}
async function handleSchemaFieldUpdate(db, collectionSlug, fieldSlug, input) {
  try {
    return {
      success: true,
      data: { item: await new SchemaRegistry(db).updateField(collectionSlug, fieldSlug, input) }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "SCHEMA_FIELD_UPDATE_ERROR",
        message: "Failed to update field"
      }
    };
  }
}
async function handleSchemaFieldDelete(db, collectionSlug, fieldSlug) {
  try {
    await new SchemaRegistry(db).deleteField(collectionSlug, fieldSlug);
    return {
      success: true,
      data: { success: true }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "SCHEMA_FIELD_DELETE_ERROR",
        message: "Failed to delete field"
      }
    };
  }
}
async function handleSchemaFieldReorder(db, collectionSlug, fieldSlugs) {
  try {
    await new SchemaRegistry(db).reorderFields(collectionSlug, fieldSlugs);
    return {
      success: true,
      data: { success: true }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "SCHEMA_FIELD_REORDER_ERROR",
        message: "Failed to reorder fields"
      }
    };
  }
}
async function handleOrphanedTableList(db) {
  try {
    return {
      success: true,
      data: { items: await new SchemaRegistry(db).discoverOrphanedTables() }
    };
  } catch (error) {
    console.error("[emdash] Failed to list orphaned tables:", error);
    return {
      success: false,
      error: {
        code: "ORPHAN_LIST_ERROR",
        message: "Failed to list orphaned tables"
      }
    };
  }
}
async function handleOrphanedTableRegister(db, slug, options) {
  try {
    return {
      success: true,
      data: { item: await new SchemaRegistry(db).registerOrphanedTable(slug, options) }
    };
  } catch (error) {
    if (error instanceof SchemaError) return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    };
    return {
      success: false,
      error: {
        code: "ORPHAN_REGISTER_ERROR",
        message: "Failed to register orphaned table"
      }
    };
  }
}
function toPluginStatus(value) {
  if (value === "active") return "active";
  return "inactive";
}
function toPluginSource(value) {
  if (value === "marketplace") return "marketplace";
  if (value === "registry") return "registry";
  return "config";
}
var PluginStateRepository = class {
  constructor(db) {
    this.db = db;
  }
  /**
  * Get state for a specific plugin
  */
  async get(pluginId) {
    const row = await this.db.selectFrom("_plugin_state").selectAll().where("plugin_id", "=", pluginId).executeTakeFirst();
    if (!row) return null;
    return rowToPluginState(row);
  }
  /**
  * Get all plugin states
  */
  async getAll() {
    return (await this.db.selectFrom("_plugin_state").selectAll().execute()).map(rowToPluginState);
  }
  /**
  * Get all marketplace-installed plugin states
  */
  async getMarketplacePlugins() {
    return (await this.db.selectFrom("_plugin_state").selectAll().where("source", "=", "marketplace").execute()).map(rowToPluginState);
  }
  /**
  * Get all registry-installed plugin states.
  *
  * The runtime's registry sync path uses this to discover which
  * registry plugins should be loaded into the sandbox on this worker.
  */
  async getRegistryPlugins() {
    return (await this.db.selectFrom("_plugin_state").selectAll().where("source", "=", "registry").execute()).map(rowToPluginState);
  }
  /**
  * Create or update plugin state
  */
  async upsert(pluginId, version, status, opts) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = await this.get(pluginId);
    if (existing) {
      const updates = {
        status,
        version
      };
      if (status === "active" && existing.status !== "active") updates.activated_at = now;
      else if (status === "inactive" && existing.status !== "inactive") updates.deactivated_at = now;
      if (opts?.source) updates.source = opts.source;
      if (opts?.marketplaceVersion !== void 0) updates.marketplace_version = opts.marketplaceVersion;
      if (opts?.displayName !== void 0) updates.display_name = opts.displayName;
      if (opts?.description !== void 0) updates.description = opts.description;
      if (opts?.registryPublisherDid !== void 0) updates.registry_publisher_did = opts.registryPublisherDid;
      if (opts?.registrySlug !== void 0) updates.registry_slug = opts.registrySlug;
      await this.db.updateTable("_plugin_state").set(updates).where("plugin_id", "=", pluginId).execute();
    } else await this.db.insertInto("_plugin_state").values({
      plugin_id: pluginId,
      status,
      version,
      installed_at: now,
      activated_at: status === "active" ? now : null,
      deactivated_at: null,
      data: null,
      source: opts?.source ?? "config",
      marketplace_version: opts?.marketplaceVersion ?? null,
      display_name: opts?.displayName ?? null,
      description: opts?.description ?? null,
      registry_publisher_did: opts?.registryPublisherDid ?? null,
      registry_slug: opts?.registrySlug ?? null
    }).execute();
    return await this.get(pluginId);
  }
  /**
  * Enable a plugin
  */
  async enable(pluginId, version) {
    return this.upsert(pluginId, version, "active");
  }
  /**
  * Disable a plugin
  */
  async disable(pluginId, version) {
    return this.upsert(pluginId, version, "inactive");
  }
  /**
  * Delete plugin state
  */
  async delete(pluginId) {
    return ((await this.db.deleteFrom("_plugin_state").where("plugin_id", "=", pluginId).executeTakeFirst()).numDeletedRows ?? 0) > 0;
  }
};
function rowToPluginState(row) {
  return {
    pluginId: row.plugin_id,
    status: toPluginStatus(row.status),
    version: row.version,
    installedAt: new Date(row.installed_at),
    activatedAt: row.activated_at ? new Date(row.activated_at) : null,
    deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : null,
    source: toPluginSource(row.source),
    marketplaceVersion: row.marketplace_version ?? null,
    displayName: row.display_name ?? null,
    description: row.description ?? null,
    registryPublisherDid: row.registry_publisher_did ?? null,
    registrySlug: row.registry_slug ?? null
  };
}
function marketplaceIconUrl(marketplaceUrl, pluginId) {
  return `${marketplaceUrl}/api/v1/plugins/${encodeURIComponent(pluginId)}/icon`;
}
function buildPluginInfo(plugin, state, marketplaceUrl) {
  const status = state?.status ?? "active";
  const enabled = status === "active";
  const isMarketplace = (state?.source ?? "config") === "marketplace";
  return {
    id: plugin.id,
    name: state?.displayName || plugin.id,
    version: plugin.version,
    package: void 0,
    enabled,
    status,
    source: state?.source ?? "config",
    marketplaceVersion: state?.marketplaceVersion ?? void 0,
    registryPublisherDid: state?.registryPublisherDid ?? void 0,
    registrySlug: state?.registrySlug ?? void 0,
    capabilities: plugin.capabilities,
    hasAdminPages: (plugin.admin.pages?.length ?? 0) > 0,
    hasDashboardWidgets: (plugin.admin.widgets?.length ?? 0) > 0,
    hasHooks: Object.keys(plugin.hooks ?? {}).length > 0,
    installedAt: state?.installedAt?.toISOString(),
    activatedAt: state?.activatedAt?.toISOString() ?? void 0,
    deactivatedAt: state?.deactivatedAt?.toISOString() ?? void 0,
    description: state?.description ?? void 0,
    iconUrl: isMarketplace && marketplaceUrl ? marketplaceIconUrl(marketplaceUrl, plugin.id) : void 0
  };
}
async function handlePluginList(db, configuredPlugins, marketplaceUrl) {
  try {
    const allStates = await new PluginStateRepository(db).getAll();
    const stateMap = new Map(allStates.map((s) => [s.pluginId, s]));
    const configuredIds = new Set(configuredPlugins.map((p) => p.id));
    const items = configuredPlugins.map((plugin) => {
      return buildPluginInfo(plugin, stateMap.get(plugin.id) ?? null, marketplaceUrl);
    });
    for (const state of allStates) {
      if (state.source !== "marketplace" && state.source !== "registry") continue;
      if (configuredIds.has(state.pluginId)) continue;
      items.push({
        id: state.pluginId,
        name: state.displayName || state.pluginId,
        version: state.marketplaceVersion ?? state.version,
        enabled: state.status === "active",
        status: state.status,
        source: state.source,
        marketplaceVersion: state.marketplaceVersion ?? void 0,
        registryPublisherDid: state.registryPublisherDid ?? void 0,
        registrySlug: state.registrySlug ?? void 0,
        capabilities: [],
        hasAdminPages: false,
        hasDashboardWidgets: false,
        hasHooks: false,
        installedAt: state.installedAt?.toISOString(),
        activatedAt: state.activatedAt?.toISOString() ?? void 0,
        deactivatedAt: state.deactivatedAt?.toISOString() ?? void 0,
        description: state.description ?? void 0,
        iconUrl: state.source === "marketplace" && marketplaceUrl ? marketplaceIconUrl(marketplaceUrl, state.pluginId) : void 0
      });
    }
    return {
      success: true,
      data: { items }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "PLUGIN_LIST_ERROR",
        message: "Failed to list plugins"
      }
    };
  }
}
async function handlePluginGet(db, configuredPlugins, pluginId, marketplaceUrl) {
  try {
    const plugin = configuredPlugins.find((p) => p.id === pluginId);
    if (!plugin) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Plugin not found: ${pluginId}`
      }
    };
    return {
      success: true,
      data: { item: buildPluginInfo(plugin, await new PluginStateRepository(db).get(pluginId), marketplaceUrl) }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "PLUGIN_GET_ERROR",
        message: "Failed to get plugin"
      }
    };
  }
}
function buildStateOnlyPluginInfo(state) {
  return {
    id: state.pluginId,
    name: state.displayName || state.pluginId,
    version: state.marketplaceVersion ?? state.version,
    enabled: state.status === "active",
    status: state.status,
    source: state.source,
    marketplaceVersion: state.marketplaceVersion ?? void 0,
    registryPublisherDid: state.registryPublisherDid ?? void 0,
    registrySlug: state.registrySlug ?? void 0,
    capabilities: [],
    hasAdminPages: false,
    hasDashboardWidgets: false,
    hasHooks: false,
    installedAt: state.installedAt?.toISOString(),
    activatedAt: state.activatedAt?.toISOString() ?? void 0,
    deactivatedAt: state.deactivatedAt?.toISOString() ?? void 0,
    description: state.description ?? void 0
  };
}
async function handlePluginEnable(db, configuredPlugins, pluginId) {
  try {
    const stateRepo = new PluginStateRepository(db);
    const plugin = configuredPlugins.find((p) => p.id === pluginId);
    if (plugin) return {
      success: true,
      data: { item: buildPluginInfo(plugin, await stateRepo.enable(pluginId, plugin.version)) }
    };
    const existing = await stateRepo.get(pluginId);
    if (!existing || existing.source !== "marketplace" && existing.source !== "registry") return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Plugin not found: ${pluginId}`
      }
    };
    return {
      success: true,
      data: { item: buildStateOnlyPluginInfo(await stateRepo.enable(pluginId, existing.version)) }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "PLUGIN_ENABLE_ERROR",
        message: "Failed to enable plugin"
      }
    };
  }
}
async function handlePluginDisable(db, configuredPlugins, pluginId) {
  try {
    const stateRepo = new PluginStateRepository(db);
    const plugin = configuredPlugins.find((p) => p.id === pluginId);
    if (plugin) return {
      success: true,
      data: { item: buildPluginInfo(plugin, await stateRepo.disable(pluginId, plugin.version)) }
    };
    const existing = await stateRepo.get(pluginId);
    if (!existing || existing.source !== "marketplace" && existing.source !== "registry") return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Plugin not found: ${pluginId}`
      }
    };
    return {
      success: true,
      data: { item: buildStateOnlyPluginInfo(await stateRepo.disable(pluginId, existing.version)) }
    };
  } catch {
    return {
      success: false,
      error: {
        code: "PLUGIN_DISABLE_ERROR",
        message: "Failed to disable plugin"
      }
    };
  }
}
const TRAILING_SLASHES$1 = /\/+$/;
const LEADING_DOT_SLASH = /^\.\//;
var MarketplaceError = class extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "MarketplaceError";
  }
};
var MarketplaceUnavailableError = class extends MarketplaceError {
  constructor(cause) {
    super("Plugin marketplace is unavailable", void 0, "MARKETPLACE_UNAVAILABLE");
    if (cause) this.cause = cause;
  }
};
var MarketplaceClientImpl = class {
  baseUrl;
  siteOrigin;
  constructor(baseUrl, siteOrigin) {
    this.baseUrl = baseUrl.replace(TRAILING_SLASHES$1, "");
    this.siteOrigin = siteOrigin;
  }
  async search(query, opts) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (opts?.category) params.set("category", opts.category);
    if (opts?.capability) params.set("capability", opts.capability);
    if (opts?.sort) params.set("sort", opts.sort);
    if (opts?.cursor) params.set("cursor", opts.cursor);
    if (opts?.limit) params.set("limit", String(opts.limit));
    const qs = params.toString();
    const url = `${this.baseUrl}/api/v1/plugins${qs ? `?${qs}` : ""}`;
    return await this.fetchJson(url);
  }
  async getPlugin(id) {
    const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}`;
    return this.fetchJson(url);
  }
  async getVersions(id) {
    const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/versions`;
    return (await this.fetchJson(url)).items;
  }
  async downloadBundle(id, version) {
    const bundleUrl = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}/bundle`;
    const marketplaceOrigin = new URL(this.baseUrl).origin;
    const MAX_REDIRECTS2 = 5;
    let response;
    try {
      let currentUrl = bundleUrl;
      response = await fetch(currentUrl, { redirect: "manual" });
      for (let i = 0; i < MAX_REDIRECTS2; i++) {
        if (response.status < 300 || response.status >= 400) break;
        const location = response.headers.get("location");
        if (!location) break;
        const target = new URL(location, currentUrl);
        if (target.origin !== marketplaceOrigin) throw new MarketplaceError(`Bundle download redirected to untrusted host: ${target.origin}`, response.status, "BUNDLE_REDIRECT_UNTRUSTED");
        currentUrl = target.href;
        response = await fetch(currentUrl, { redirect: "manual" });
      }
      if (response.status >= 300 && response.status < 400) throw new MarketplaceError(`Bundle download exceeded maximum redirects (${MAX_REDIRECTS2})`, response.status, "BUNDLE_TOO_MANY_REDIRECTS");
    } catch (err) {
      if (err instanceof MarketplaceError) throw err;
      throw new MarketplaceUnavailableError(err);
    }
    if (!response.ok) throw new MarketplaceError(`Failed to download bundle: ${response.status} ${response.statusText}`, response.status, "BUNDLE_DOWNLOAD_FAILED");
    const tarballBytes = new Uint8Array(await response.arrayBuffer());
    try {
      return await extractBundle(tarballBytes);
    } catch (err) {
      if (err instanceof MarketplaceError) throw err;
      throw new MarketplaceError("Failed to extract plugin bundle", void 0, "BUNDLE_EXTRACT_FAILED");
    }
  }
  async reportInstall(id, version) {
    const siteHash = await generateSiteHash(this.siteOrigin);
    const url = `${this.baseUrl}/api/v1/plugins/${encodeURIComponent(id)}/installs`;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteHash,
          version
        })
      });
    } catch {
    }
  }
  async searchThemes(query, opts) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (opts?.keyword) params.set("keyword", opts.keyword);
    if (opts?.sort) params.set("sort", opts.sort);
    if (opts?.cursor) params.set("cursor", opts.cursor);
    if (opts?.limit) params.set("limit", String(opts.limit));
    const qs = params.toString();
    const url = `${this.baseUrl}/api/v1/themes${qs ? `?${qs}` : ""}`;
    return this.fetchJson(url);
  }
  async getTheme(id) {
    const url = `${this.baseUrl}/api/v1/themes/${encodeURIComponent(id)}`;
    return this.fetchJson(url);
  }
  async fetchJson(url) {
    let response;
    try {
      response = await fetch(url, { headers: { Accept: "application/json" } });
    } catch (err) {
      throw new MarketplaceUnavailableError(err);
    }
    if (!response.ok) {
      let errorMessage = `Marketplace request failed: ${response.status}`;
      try {
        const body = await response.json();
        if (body.error) errorMessage = body.error;
      } catch {
      }
      throw new MarketplaceError(errorMessage, response.status);
    }
    return await response.json();
  }
};
const MAX_DECOMPRESSED_BUNDLE_BYTES = 256 * 1024;
const MAX_BUNDLE_TAR_ENTRIES = 32;
async function extractBundle(tarballBytes) {
  const reader = new ReadableStream({ start(controller) {
    controller.enqueue(tarballBytes);
    controller.close();
  } }).pipeThrough(createGzipDecoder()).getReader();
  const chunks2 = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > MAX_DECOMPRESSED_BUNDLE_BYTES) {
      try {
        await reader.cancel();
      } catch {
      }
      throw new MarketplaceError(`Bundle decompressed size exceeds limit (${MAX_DECOMPRESSED_BUNDLE_BYTES} bytes)`, void 0, "INVALID_BUNDLE");
    }
    chunks2.push(value);
  }
  const decompressedBytes = new Uint8Array(total);
  {
    let offset = 0;
    for (const chunk of chunks2) {
      decompressedBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
  }
  const entries = await unpackTar(new ReadableStream({ start(controller) {
    controller.enqueue(decompressedBytes);
    controller.close();
  } }));
  if (entries.length > MAX_BUNDLE_TAR_ENTRIES) throw new MarketplaceError(`Bundle has too many tar entries (${entries.length} > ${MAX_BUNDLE_TAR_ENTRIES})`, void 0, "INVALID_BUNDLE");
  const decoder = new TextDecoder();
  const files = /* @__PURE__ */ new Map();
  for (const entry of entries) if (entry.data && entry.header.type === "file") {
    const name = entry.header.name.replace(LEADING_DOT_SLASH, "");
    files.set(name, decoder.decode(entry.data));
  }
  const manifestJson = files.get("manifest.json");
  const backendCode = files.get("backend.js");
  if (!manifestJson) throw new MarketplaceError("Invalid bundle: missing manifest.json", void 0, "INVALID_BUNDLE");
  if (!backendCode) throw new MarketplaceError("Invalid bundle: missing backend.js", void 0, "INVALID_BUNDLE");
  let manifest;
  try {
    const parsed = JSON.parse(manifestJson);
    const result = pluginManifestSchema.safeParse(parsed);
    if (!result.success) throw new MarketplaceError("Invalid bundle: manifest.json failed validation", void 0, "INVALID_BUNDLE");
    manifest = result.data;
  } catch (err) {
    if (err instanceof MarketplaceError) throw err;
    throw new MarketplaceError("Invalid bundle: malformed manifest.json", void 0, "INVALID_BUNDLE");
  }
  const hashBuffer = await crypto.subtle.digest("SHA-256", tarballBytes);
  const hashArray = new Uint8Array(hashBuffer);
  const checksum = Array.from(hashArray, (b) => b.toString(16).padStart(2, "0")).join("");
  return {
    manifest,
    backendCode,
    adminCode: files.get("admin.js"),
    checksum
  };
}
async function generateSiteHash(siteOrigin) {
  const seed = siteOrigin ? `emdash-site:${siteOrigin}` : `emdash-anonymous`;
  try {
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
    const arr = new Uint8Array(hash);
    return Array.from(arr.slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const h2 = h ^ h >>> 16;
    return (h >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0");
  }
}
function createMarketplaceClient(baseUrl, siteOrigin) {
  return new MarketplaceClientImpl(baseUrl, siteOrigin);
}
const VERSION_PATTERN = /^[a-z0-9][a-z0-9._+-]*$/i;
function validateVersion(version) {
  if (version.includes("..")) throw new Error("Invalid version format");
  if (!VERSION_PATTERN.test(version)) throw new Error("Invalid version format");
}
function getClient(marketplaceUrl, siteOrigin) {
  if (!marketplaceUrl) return null;
  return createMarketplaceClient(marketplaceUrl, siteOrigin);
}
function diffCapabilities(oldCaps, newCaps) {
  const oldNorm = normalizeCapabilities(oldCaps);
  const newNorm = normalizeCapabilities(newCaps);
  const oldSet = new Set(oldNorm);
  const newSet = new Set(newNorm);
  return {
    added: newNorm.filter((c) => !oldSet.has(c)),
    removed: oldNorm.filter((c) => !newSet.has(c))
  };
}
function diffRouteVisibility(oldManifest, newManifest) {
  const oldPublicRoutes = /* @__PURE__ */ new Set();
  if (oldManifest) for (const entry of oldManifest.routes) {
    const normalized = normalizeManifestRoute(entry);
    if (normalized.public === true) oldPublicRoutes.add(normalized.name);
  }
  const newlyPublic = [];
  for (const entry of newManifest.routes) {
    const normalized = normalizeManifestRoute(entry);
    if (normalized.public === true && !oldPublicRoutes.has(normalized.name)) newlyPublic.push(normalized.name);
  }
  return { newlyPublic };
}
async function resolveVersionMetadata(client, pluginId, pluginDetail, version) {
  if (pluginDetail.latestVersion?.version === version) return {
    version: pluginDetail.latestVersion.version,
    minEmDashVersion: pluginDetail.latestVersion.minEmDashVersion,
    bundleSize: pluginDetail.latestVersion.bundleSize,
    checksum: pluginDetail.latestVersion.checksum,
    changelog: pluginDetail.latestVersion.changelog,
    capabilities: pluginDetail.latestVersion.capabilities,
    status: pluginDetail.latestVersion.status,
    auditVerdict: pluginDetail.latestVersion.audit?.verdict ?? null,
    imageAuditVerdict: pluginDetail.latestVersion.imageAudit?.verdict ?? null,
    publishedAt: pluginDetail.latestVersion.publishedAt
  };
  return (await client.getVersions(pluginId)).find((v) => v.version === version) ?? null;
}
function validateBundleIdentity(bundle, pluginId, version) {
  if (bundle.manifest.id !== pluginId) return {
    success: false,
    error: {
      code: "MANIFEST_MISMATCH",
      message: `Bundle manifest ID (${bundle.manifest.id}) does not match requested plugin (${pluginId})`
    }
  };
  if (bundle.manifest.version !== version) return {
    success: false,
    error: {
      code: "MANIFEST_VERSION_MISMATCH",
      message: `Bundle manifest version (${bundle.manifest.version}) does not match requested version (${version})`
    }
  };
  return null;
}
function bundlePrefix(source, pluginId, version) {
  return `${source}/${pluginId}/${version}`;
}
async function storeBundleInR2(storage, pluginId, version, bundle, source = "marketplace") {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = bundlePrefix(source, pluginId, version);
  await storage.upload({
    key: `${prefix}/manifest.json`,
    body: new TextEncoder().encode(JSON.stringify(bundle.manifest)),
    contentType: "application/json"
  });
  await storage.upload({
    key: `${prefix}/backend.js`,
    body: new TextEncoder().encode(bundle.backendCode),
    contentType: "application/javascript"
  });
  if (bundle.adminCode) await storage.upload({
    key: `${prefix}/admin.js`,
    body: new TextEncoder().encode(bundle.adminCode),
    contentType: "application/javascript"
  });
}
async function streamToText(stream) {
  return new Response(stream).text();
}
async function loadBundleFromR2(storage, pluginId, version, source = "marketplace") {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = bundlePrefix(source, pluginId, version);
  try {
    const manifestResult = await storage.download(`${prefix}/manifest.json`);
    const backendResult = await storage.download(`${prefix}/backend.js`);
    const manifestText = await streamToText(manifestResult.body);
    const backendCode = await streamToText(backendResult.body);
    const parsed = JSON.parse(manifestText);
    const result = pluginManifestSchema.safeParse(parsed);
    if (!result.success) return null;
    const manifest = result.data;
    let adminCode;
    try {
      adminCode = await streamToText((await storage.download(`${prefix}/admin.js`)).body);
    } catch {
    }
    return {
      manifest,
      backendCode,
      adminCode
    };
  } catch {
    return null;
  }
}
async function deleteBundleFromR2(storage, pluginId, version, source = "marketplace") {
  validatePluginIdentifier(pluginId, "plugin ID");
  validateVersion(version);
  const prefix = bundlePrefix(source, pluginId, version);
  for (const file of [
    "manifest.json",
    "backend.js",
    "admin.js"
  ]) try {
    await storage.delete(`${prefix}/${file}`);
  } catch {
  }
}
async function handleMarketplaceInstall(db, storage, sandboxRunner, marketplaceUrl, pluginId, opts) {
  const client = getClient(marketplaceUrl, opts?.siteOrigin);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  if (!storage) return {
    success: false,
    error: {
      code: "STORAGE_NOT_CONFIGURED",
      message: "Storage is required for marketplace plugin installation"
    }
  };
  if (!opts?.sandboxBypassed && (!sandboxRunner || !sandboxRunner.isAvailable())) return {
    success: false,
    error: {
      code: "SANDBOX_NOT_AVAILABLE",
      message: "Sandbox runner is required for marketplace plugins"
    }
  };
  try {
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (existing && existing.source === "marketplace") return {
      success: false,
      error: {
        code: "ALREADY_INSTALLED",
        message: `Plugin ${pluginId} is already installed`
      }
    };
    if (opts?.configuredPluginIds?.has(pluginId)) return {
      success: false,
      error: {
        code: "PLUGIN_ID_CONFLICT",
        message: `Cannot install marketplace plugin "${pluginId}" — a configured plugin with the same ID already exists`
      }
    };
    const pluginDetail = await client.getPlugin(pluginId);
    const version = opts?.version ?? pluginDetail.latestVersion?.version;
    if (!version) return {
      success: false,
      error: {
        code: "NO_VERSION",
        message: `No published versions found for plugin ${pluginId}`
      }
    };
    const versionMetadata = await resolveVersionMetadata(client, pluginId, pluginDetail, version);
    if (!versionMetadata) return {
      success: false,
      error: {
        code: "NO_VERSION",
        message: `Version ${version} was not found for plugin ${pluginId}`
      }
    };
    if (versionMetadata.auditVerdict === "fail" || versionMetadata.auditVerdict === "warn") return {
      success: false,
      error: {
        code: "AUDIT_FAILED",
        message: versionMetadata.auditVerdict === "fail" ? "Plugin failed security audit and cannot be installed" : "Plugin audit was inconclusive and cannot be installed until reviewed"
      }
    };
    const bundle = await client.downloadBundle(pluginId, version);
    if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) return {
      success: false,
      error: {
        code: "CHECKSUM_MISMATCH",
        message: "Bundle checksum does not match marketplace record. Download may be corrupted."
      }
    };
    const bundleIdentityError = validateBundleIdentity(bundle, pluginId, version);
    if (bundleIdentityError) return bundleIdentityError;
    await storeBundleInR2(storage, pluginId, version, bundle);
    await stateRepo.upsert(pluginId, version, "active", {
      source: "marketplace",
      marketplaceVersion: version,
      displayName: pluginDetail.name,
      description: pluginDetail.description ?? void 0
    });
    client.reportInstall(pluginId, version).catch(() => {
    });
    return {
      success: true,
      data: {
        pluginId,
        version,
        capabilities: bundle.manifest.capabilities
      }
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Plugin marketplace is currently unavailable"
      }
    };
    if (err instanceof MarketplaceError) return {
      success: false,
      error: {
        code: err.code ?? "MARKETPLACE_ERROR",
        message: err.message
      }
    };
    if (err instanceof EmDashStorageError) return {
      success: false,
      error: {
        code: err.code ?? "STORAGE_ERROR",
        message: "Storage error while installing plugin"
      }
    };
    if (err && typeof err === "object" && "code" in err) {
      const code = err.code;
      if (typeof code === "string" && code.trim()) return {
        success: false,
        error: {
          code,
          message: "Failed to install plugin from marketplace"
        }
      };
    }
    console.error("Failed to install marketplace plugin:", err);
    return {
      success: false,
      error: {
        code: "INSTALL_FAILED",
        message: "Failed to install plugin from marketplace"
      }
    };
  }
}
async function handleMarketplaceUpdate(db, storage, sandboxRunner, marketplaceUrl, pluginId, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  if (!storage) return {
    success: false,
    error: {
      code: "STORAGE_NOT_CONFIGURED",
      message: "Storage is required"
    }
  };
  if (!opts?.sandboxBypassed && (!sandboxRunner || !sandboxRunner.isAvailable())) return {
    success: false,
    error: {
      code: "SANDBOX_NOT_AVAILABLE",
      message: "Sandbox runner is required"
    }
  };
  try {
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (!existing || existing.source !== "marketplace") return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `No marketplace plugin found: ${pluginId}`
      }
    };
    const oldVersion = existing.marketplaceVersion ?? existing.version;
    const pluginDetail = await client.getPlugin(pluginId);
    const newVersion = opts?.version ?? pluginDetail.latestVersion?.version;
    if (!newVersion) return {
      success: false,
      error: {
        code: "NO_VERSION",
        message: "No newer version available"
      }
    };
    if (newVersion === oldVersion) return {
      success: false,
      error: {
        code: "ALREADY_UP_TO_DATE",
        message: "Plugin is already up to date"
      }
    };
    const versionMetadata = await resolveVersionMetadata(client, pluginId, pluginDetail, newVersion);
    if (!versionMetadata) return {
      success: false,
      error: {
        code: "NO_VERSION",
        message: `Version ${newVersion} was not found for plugin ${pluginId}`
      }
    };
    const bundle = await client.downloadBundle(pluginId, newVersion);
    if (versionMetadata.checksum && bundle.checksum !== versionMetadata.checksum) return {
      success: false,
      error: {
        code: "CHECKSUM_MISMATCH",
        message: "Bundle checksum does not match marketplace record. Download may be corrupted."
      }
    };
    const bundleIdentityError = validateBundleIdentity(bundle, pluginId, newVersion);
    if (bundleIdentityError) return bundleIdentityError;
    const oldBundle = await loadBundleFromR2(storage, pluginId, oldVersion);
    const capabilityChanges = diffCapabilities(oldBundle?.manifest.capabilities ?? [], bundle.manifest.capabilities);
    if (capabilityChanges.added.length > 0 && !opts?.confirmCapabilityChanges) return {
      success: false,
      error: {
        code: "CAPABILITY_ESCALATION",
        message: "Plugin update requires new capabilities",
        details: { capabilityChanges }
      }
    };
    const routeVisibilityChanges = diffRouteVisibility(oldBundle?.manifest, bundle.manifest);
    const hasNewPublicRoutes = routeVisibilityChanges.newlyPublic.length > 0;
    if (hasNewPublicRoutes && !opts?.confirmRouteVisibilityChanges) return {
      success: false,
      error: {
        code: "ROUTE_VISIBILITY_ESCALATION",
        message: "Plugin update exposes new public (unauthenticated) routes",
        details: {
          routeVisibilityChanges,
          capabilityChanges
        }
      }
    };
    await storeBundleInR2(storage, pluginId, newVersion, bundle);
    await stateRepo.upsert(pluginId, newVersion, "active", {
      source: "marketplace",
      marketplaceVersion: newVersion,
      displayName: pluginDetail.name,
      description: pluginDetail.description ?? void 0
    });
    deleteBundleFromR2(storage, pluginId, oldVersion).catch(() => {
    });
    return {
      success: true,
      data: {
        pluginId,
        oldVersion,
        newVersion,
        capabilityChanges,
        routeVisibilityChanges: hasNewPublicRoutes ? routeVisibilityChanges : void 0
      }
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Marketplace is unavailable"
      }
    };
    if (err instanceof MarketplaceError) return {
      success: false,
      error: {
        code: err.code ?? "MARKETPLACE_ERROR",
        message: err.message
      }
    };
    console.error("Failed to update marketplace plugin:", err);
    return {
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: "Failed to update plugin"
      }
    };
  }
}
async function handleMarketplaceUninstall(db, storage, pluginId, opts) {
  try {
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (!existing || existing.source !== "marketplace") return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `No marketplace plugin found: ${pluginId}`
      }
    };
    const version = existing.marketplaceVersion ?? existing.version;
    if (storage) await deleteBundleFromR2(storage, pluginId, version);
    let dataDeleted = false;
    if (opts?.deleteData) try {
      await db.deleteFrom("_plugin_storage").where("plugin_id", "=", pluginId).execute();
      dataDeleted = true;
    } catch {
    }
    await stateRepo.delete(pluginId);
    return {
      success: true,
      data: {
        pluginId,
        dataDeleted
      }
    };
  } catch (err) {
    console.error("Failed to uninstall marketplace plugin:", err);
    return {
      success: false,
      error: {
        code: "UNINSTALL_FAILED",
        message: "Failed to uninstall plugin"
      }
    };
  }
}
async function handleMarketplaceUpdateCheck(db, marketplaceUrl) {
  const client = getClient(marketplaceUrl);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  try {
    const marketplacePlugins = await new PluginStateRepository(db).getMarketplacePlugins();
    const items = [];
    for (const plugin of marketplacePlugins) try {
      const detail = await client.getPlugin(plugin.pluginId);
      const latest = detail.latestVersion?.version;
      const installed = plugin.marketplaceVersion ?? plugin.version;
      if (!latest) continue;
      const hasUpdate = latest !== installed;
      let capabilityChanges;
      let hasCapabilityChanges = false;
      if (hasUpdate && detail.latestVersion) {
        capabilityChanges = diffCapabilities(detail.capabilities ?? [], detail.latestVersion.capabilities ?? []);
        hasCapabilityChanges = capabilityChanges.added.length > 0 || capabilityChanges.removed.length > 0;
      }
      items.push({
        pluginId: plugin.pluginId,
        installed,
        latest: latest ?? installed,
        hasUpdate,
        hasCapabilityChanges,
        capabilityChanges: hasCapabilityChanges ? capabilityChanges : void 0,
        hasRouteVisibilityChanges: false
      });
    } catch (err) {
      console.warn(`Failed to check updates for ${plugin.pluginId}:`, err);
    }
    return {
      success: true,
      data: { items }
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Marketplace is unavailable"
      }
    };
    console.error("Failed to check marketplace updates:", err);
    return {
      success: false,
      error: {
        code: "UPDATE_CHECK_FAILED",
        message: "Failed to check for updates"
      }
    };
  }
}
async function handleMarketplaceSearch(marketplaceUrl, query, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  try {
    return {
      success: true,
      data: await client.search(query, opts)
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Marketplace is unavailable"
      }
    };
    console.error("Failed to search marketplace:", err);
    return {
      success: false,
      error: {
        code: "SEARCH_FAILED",
        message: "Failed to search marketplace"
      }
    };
  }
}
async function handleMarketplaceGetPlugin(marketplaceUrl, pluginId) {
  const client = getClient(marketplaceUrl);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  try {
    return {
      success: true,
      data: await client.getPlugin(pluginId)
    };
  } catch (err) {
    if (err instanceof MarketplaceError && err.status === 404) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Plugin not found: ${pluginId}`
      }
    };
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Marketplace is unavailable"
      }
    };
    console.error("Failed to get marketplace plugin:", err);
    return {
      success: false,
      error: {
        code: "GET_PLUGIN_FAILED",
        message: "Failed to get plugin details"
      }
    };
  }
}
async function handleThemeSearch(marketplaceUrl, query, opts) {
  const client = getClient(marketplaceUrl);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  try {
    return {
      success: true,
      data: await client.searchThemes(query, opts)
    };
  } catch (err) {
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Marketplace is unavailable"
      }
    };
    console.error("Failed to search themes:", err);
    return {
      success: false,
      error: {
        code: "THEME_SEARCH_FAILED",
        message: "Failed to search themes"
      }
    };
  }
}
async function handleThemeGetDetail(marketplaceUrl, themeId) {
  const client = getClient(marketplaceUrl);
  if (!client) return {
    success: false,
    error: {
      code: "MARKETPLACE_NOT_CONFIGURED",
      message: "Marketplace is not configured"
    }
  };
  try {
    return {
      success: true,
      data: await client.getTheme(themeId)
    };
  } catch (err) {
    if (err instanceof MarketplaceError && err.status === 404) return {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Theme not found: ${themeId}`
      }
    };
    if (err instanceof MarketplaceUnavailableError) return {
      success: false,
      error: {
        code: "MARKETPLACE_UNAVAILABLE",
        message: "Marketplace is unavailable"
      }
    };
    console.error("Failed to get marketplace theme:", err);
    return {
      success: false,
      error: {
        code: "GET_THEME_FAILED",
        message: "Failed to get theme details"
      }
    };
  }
}
function canonicalCapabilitiesForDriftCheck(value) {
  if (!Array.isArray(value)) return [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of value) if (typeof entry === "string" && entry.length > 0) seen.add(entry);
  return [...seen].toSorted();
}
function releaseExemptFromMinimumAge(exclude, publisherDid, slug) {
  if (!exclude || exclude.length === 0) return false;
  const didLower = publisherDid.toLowerCase();
  const fullDid = `${didLower}/${slug.toLowerCase()}`;
  for (const entry of exclude) {
    if (entry === didLower) return true;
    if (entry === fullDid) return true;
  }
  return false;
}
const DURATION_PATTERN = /^(\d+)(s|m|h|d|w)$/;
const TRAILING_SLASHES = /\/+$/;
const TRAILING_DOT$1 = /\.$/;
function parseDurationSeconds(duration) {
  if (typeof duration === "number") {
    if (!Number.isFinite(duration) || duration < 0) throw new Error(`Invalid duration: ${duration} (must be a non-negative finite number)`);
    return Math.floor(duration);
  }
  const match = duration.match(DURATION_PATTERN);
  if (!match) throw new Error(`Invalid duration format: "${duration}". Use a duration string like "48h", "7d", "30m", or a number of seconds.`);
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
      return value * 24 * 60 * 60;
    case "w":
      return value * 7 * 24 * 60 * 60;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
  }
}
function validateAggregatorUrl(aggregatorUrl) {
  let parsed;
  try {
    parsed = new URL(aggregatorUrl);
  } catch {
    throw new Error(`registry.aggregatorUrl is not a valid URL: ${aggregatorUrl}`);
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`registry.aggregatorUrl must use http or https: ${aggregatorUrl}`);
  if (parsed.username || parsed.password) throw new Error("registry.aggregatorUrl must not contain embedded credentials (user:pass@)");
  const rawHostname = parsed.hostname.toLowerCase().replace(TRAILING_DOT$1, "");
  const hostname = rawHostname.startsWith("[") && rawHostname.endsWith("]") ? rawHostname.slice(1, -1) : rawHostname;
  const isLocalhost = hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "127.0.0.1" || hostname === "::1" || hostname.startsWith("::ffff:127.") || hostname.startsWith("::ffff:7f00:");
  {
    if (parsed.protocol === "http:") throw new Error(`registry.aggregatorUrl must use https in production: ${aggregatorUrl}`);
    if (isLocalhost) throw new Error(`registry.aggregatorUrl points at localhost; allowed only in dev: ${aggregatorUrl}`);
  }
  return parsed;
}
function coerceRegistryConfig(input) {
  if (input === void 0) return void 0;
  if (typeof input === "string") return { aggregatorUrl: input };
  return input;
}
function normalizeRegistryConfig(input) {
  const config = coerceRegistryConfig(input);
  if (!config) return null;
  const aggregatorUrl = config.aggregatorUrl?.trim();
  if (!aggregatorUrl) throw new Error("registry.aggregatorUrl is required when registry is configured");
  validateAggregatorUrl(aggregatorUrl);
  const out = { aggregatorUrl: aggregatorUrl.replace(TRAILING_SLASHES, "") };
  if (config.acceptLabelers) out.acceptLabelers = config.acceptLabelers;
  const policy = {};
  let hasPolicy = false;
  if (config.policy?.minimumReleaseAge !== void 0) {
    policy.minimumReleaseAgeSeconds = parseDurationSeconds(config.policy.minimumReleaseAge);
    hasPolicy = true;
  }
  if (config.policy?.minimumReleaseAgeExclude !== void 0) {
    const list = config.policy.minimumReleaseAgeExclude.map((entry) => {
      const trimmed = entry.trim();
      if (!trimmed) throw new Error("registry.policy.minimumReleaseAgeExclude entries cannot be empty");
      return trimmed.toLowerCase();
    });
    if (list.length > 0) {
      policy.minimumReleaseAgeExclude = list;
      hasPolicy = true;
    }
  }
  if (hasPolicy) out.policy = policy;
  return out;
}
const HASH_LENGTH = 16;
const BASE32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567";
function base32Encode(bytes) {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of bytes) {
    value = value << 8 | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out += BASE32_ALPHABET[value >>> bits & 31];
    }
  }
  if (bits > 0) out += BASE32_ALPHABET[value << 5 - bits & 31];
  return out;
}
async function makeRegistryPluginId(publisherDid, slug) {
  const did = publisherDid.trim();
  const s = slug.trim();
  if (!did) throw new Error("makeRegistryPluginId: publisherDid is required");
  if (!s) throw new Error("makeRegistryPluginId: slug is required");
  const input = `${did}
${s}`;
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return `r_${base32Encode(new Uint8Array(hashBuffer)).slice(0, HASH_LENGTH)}`;
}
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i;
async function sha256Hex(bytes) {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  const arr = new Uint8Array(buf);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
const MULTIHASH_SHA256_CODE = 18;
const MULTIHASH_SHA256_LENGTH = 32;
async function sha256MultibaseMultihash(bytes) {
  const digestBuf = await crypto.subtle.digest("SHA-256", bytes);
  const digest = new Uint8Array(digestBuf);
  const multihash = new Uint8Array(2 + digest.length);
  multihash[0] = MULTIHASH_SHA256_CODE;
  multihash[1] = MULTIHASH_SHA256_LENGTH;
  multihash.set(digest, 2);
  const { toBase32 } = await import('@atcute/multibase');
  return `b${toBase32(multihash)}`;
}
async function verifyChecksum(bytes, checksum) {
  if (SHA256_HEX_PATTERN.test(checksum)) {
    const actual = await sha256Hex(bytes);
    return checksum.toLowerCase() === actual;
  }
  if (checksum.length === 56 && checksum.startsWith("b")) return (await sha256MultibaseMultihash(bytes)).toLowerCase() === checksum.toLowerCase();
  return false;
}
const MAX_ARTIFACT_BYTES = 512 * 1024;
const MAX_REDIRECTS = 5;
const ARTIFACT_FETCH_TIMEOUT_MS = 15e3;
const ARTIFACT_TOTAL_BUDGET_MS = 45e3;
const MAX_MIRRORS = 16;
const AGGREGATOR_REQUEST_TIMEOUT_MS = 15e3;
const AGGREGATOR_TOTAL_BUDGET_MS = 3e4;
function timedFetch(totalDeadline) {
  return (input, init) => {
    const now = Date.now();
    const remaining = Math.max(0, totalDeadline - now);
    if (remaining === 0) return Promise.reject(/* @__PURE__ */ new Error("Aggregator request budget exhausted"));
    const timeout = Math.min(AGGREGATOR_REQUEST_TIMEOUT_MS, remaining);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const callerSignal = init?.signal;
    if (callerSignal) if (callerSignal.aborted) controller.abort(callerSignal.reason);
    else callerSignal.addEventListener("abort", () => controller.abort(callerSignal.reason));
    return fetch(input, {
      ...init,
      signal: controller.signal
    }).finally(() => {
      clearTimeout(timer);
    });
  };
}
const FORBIDDEN_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback"
]);
const TRAILING_DOT = /\.$/;
function isLocalhostHostname(hostname) {
  const stripped = hostname.toLowerCase().replace(TRAILING_DOT, "");
  const h = stripped.startsWith("[") && stripped.endsWith("]") ? stripped.slice(1, -1) : stripped;
  if (FORBIDDEN_HOSTNAMES.has(h)) return true;
  if (h === "localhost") return true;
  if (h.endsWith(".localhost")) return true;
  if (h === "127.0.0.1" || h === "::1") return true;
  if (h.startsWith("::ffff:127.") || h.startsWith("::ffff:7f00:")) return true;
  return false;
}
async function assertSafeArtifactUrl(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch {
    throw new Error(`Invalid artifact URL: ${urlString}`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`Artifact URL protocol not allowed: ${url.protocol}`);
  if (url.username || url.password) throw new Error("Artifact URL must not contain embedded credentials");
  const rawHostname = url.hostname.toLowerCase().replace(TRAILING_DOT, "");
  const hostname = rawHostname.startsWith("[") && rawHostname.endsWith("]") ? rawHostname.slice(1, -1) : rawHostname;
  const localhost = isLocalhostHostname(hostname);
  {
    if (url.protocol === "http:") throw new Error("Artifact URL must use https");
    if (localhost) throw new Error(`Artifact URL points to localhost: ${hostname}`);
  }
  if (localhost) return url;
  try {
    return await resolveAndValidateExternalUrl(url.href);
  } catch (err) {
    if (err instanceof SsrfError) throw new Error(`Artifact URL rejected: ${err.message}`, { cause: err });
    throw err;
  }
}
async function fetchWithLimits(initialUrl, totalDeadline) {
  const now = Date.now();
  const remaining = Math.max(0, totalDeadline - now);
  if (remaining === 0) throw new Error("Artifact download budget exhausted");
  const perUrlTimeout = Math.min(ARTIFACT_FETCH_TIMEOUT_MS, remaining);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), perUrlTimeout);
  try {
    let current = await assertSafeArtifactUrl(initialUrl);
    let response;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      response = await fetch(current.href, {
        redirect: "manual",
        signal: controller.signal
      });
      if (response.status < 300 || response.status >= 400) break;
      const location = response.headers.get("location");
      if (!location) break;
      if (hop === MAX_REDIRECTS) throw new Error(`Too many redirects fetching artifact (>${MAX_REDIRECTS})`);
      current = await assertSafeArtifactUrl(new URL(location, current).href);
    }
    const finalResponse = response;
    if (!finalResponse.ok) throw new Error(`HTTP ${finalResponse.status}`);
    const lengthHeader = finalResponse.headers.get("content-length");
    if (lengthHeader) {
      const declared = Number(lengthHeader);
      if (Number.isFinite(declared) && declared > MAX_ARTIFACT_BYTES) throw new Error(`Artifact too large (declared ${declared} bytes, limit ${MAX_ARTIFACT_BYTES})`);
    }
    const body = finalResponse.body;
    if (!body) {
      const buf = new Uint8Array(await finalResponse.arrayBuffer());
      if (buf.byteLength > MAX_ARTIFACT_BYTES) throw new Error(`Artifact too large (limit ${MAX_ARTIFACT_BYTES} bytes)`);
      return buf;
    }
    const reader = body.getReader();
    const chunks2 = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > MAX_ARTIFACT_BYTES) {
        try {
          await reader.cancel();
        } catch {
        }
        throw new Error(`Artifact too large (limit ${MAX_ARTIFACT_BYTES} bytes)`);
      }
      chunks2.push(value);
    }
    const out = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks2) {
      out.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return out;
  } finally {
    clearTimeout(timer);
  }
}
function redactUrlForError(raw) {
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname}`;
  } catch {
    return "<malformed url>";
  }
}
async function fetchArtifact(mirrors, declaredUrl) {
  const urls = [...mirrors.slice(0, MAX_MIRRORS), declaredUrl];
  const clientErrors = [];
  const totalDeadline = Date.now() + ARTIFACT_TOTAL_BUDGET_MS;
  for (const url of urls) {
    if (Date.now() >= totalDeadline) {
      clientErrors.push("(total artifact download budget exhausted)");
      break;
    }
    try {
      return await fetchWithLimits(url, totalDeadline);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[registry-install] Artifact fetch failed from ${url}:`, message);
      clientErrors.push(`${redactUrlForError(url)}: ${message}`);
    }
  }
  throw new Error(`Failed to download artifact from any source. Tried:
  ${clientErrors.join("\n  ")}`);
}
async function handleRegistryInstall(db, storage, sandboxRunner, registryConfigInput, input, opts) {
  const registryConfig = coerceRegistryConfig(registryConfigInput);
  if (!registryConfig) return {
    success: false,
    error: {
      code: "REGISTRY_NOT_CONFIGURED",
      message: "Registry is not configured"
    }
  };
  if (!storage) return {
    success: false,
    error: {
      code: "STORAGE_NOT_CONFIGURED",
      message: "Storage is required for registry plugin installation"
    }
  };
  if (!sandboxRunner || !sandboxRunner.isAvailable()) return {
    success: false,
    error: {
      code: "SANDBOX_NOT_AVAILABLE",
      message: "Sandbox runner is required for registry plugins"
    }
  };
  try {
    validateAggregatorUrl(registryConfig.aggregatorUrl);
  } catch (err) {
    return {
      success: false,
      error: {
        code: "REGISTRY_NOT_CONFIGURED",
        message: err instanceof Error ? err.message : "Invalid aggregator URL"
      }
    };
  }
  const { did, slug, version: requestedVersion } = input;
  const { DiscoveryClient } = await import('@emdash-cms/registry-client/discovery');
  const aggregatorDeadline = Date.now() + AGGREGATOR_TOTAL_BUDGET_MS;
  const discovery = new DiscoveryClient({
    aggregatorUrl: registryConfig.aggregatorUrl,
    acceptLabelers: registryConfig.acceptLabelers,
    fetch: timedFetch(aggregatorDeadline)
  });
  if (!did.startsWith("did:") || did.split(":").length < 3) return {
    success: false,
    error: {
      code: "INVALID_DID",
      message: "DID must be a valid atproto DID (e.g. did:plc:abc123)"
    }
  };
  try {
    const publisherDid = did;
    const packageView = await discovery.getPackage({
      did: publisherDid,
      slug
    });
    const MAX_LIST_PAGES = 20;
    const releaseView = await (async () => {
      if (!requestedVersion) return discovery.getLatestRelease({
        did: publisherDid,
        package: slug
      });
      let cursor;
      const seenCursors = /* @__PURE__ */ new Set();
      for (let page = 0; page < MAX_LIST_PAGES; page++) {
        if (cursor !== void 0) {
          if (seenCursors.has(cursor)) break;
          seenCursors.add(cursor);
        }
        const result = await discovery.listReleases({
          did: publisherDid,
          package: slug,
          cursor,
          limit: 50
        });
        for (const r of result.releases) if (r.version === requestedVersion) return r;
        if (!result.cursor) break;
        cursor = result.cursor;
      }
    })();
    if (!releaseView) return {
      success: false,
      error: {
        code: "NO_RELEASE",
        message: requestedVersion ? `Version ${requestedVersion} not found for ${publisherDid}/${slug}` : `No installable release found for ${publisherDid}/${slug}`
      }
    };
    const signedRelease = releaseView.release;
    if (packageView.did !== publisherDid || packageView.slug !== slug) return {
      success: false,
      error: {
        code: "AGGREGATOR_IDENTITY_MISMATCH",
        message: "Aggregator returned a package view for a different publisher or slug."
      }
    };
    if (releaseView.did !== publisherDid || releaseView.package !== slug || signedRelease?.package !== slug || requestedVersion !== void 0 && releaseView.version !== requestedVersion || signedRelease?.version !== releaseView.version) return {
      success: false,
      error: {
        code: "AGGREGATOR_IDENTITY_MISMATCH",
        message: "Aggregator returned a release view that does not match the requested package or version."
      }
    };
    const version = releaseView.version;
    const yanked = (packageView.labels ?? []).some((l) => l.val === "security:yanked");
    const releaseYanked = (releaseView.labels ?? []).some((l) => l.val === "security:yanked");
    if (yanked || releaseYanked) return {
      success: false,
      error: {
        code: "RELEASE_YANKED",
        message: "This release has been withdrawn (security:yanked label)."
      }
    };
    const minimumReleaseAge = registryConfig.policy?.minimumReleaseAge;
    let minimumReleaseAgeSeconds = 0;
    if (minimumReleaseAge !== void 0) try {
      minimumReleaseAgeSeconds = parseDurationSeconds(minimumReleaseAge);
    } catch (err) {
      return {
        success: false,
        error: {
          code: "REGISTRY_POLICY_INVALID",
          message: err instanceof Error ? err.message : "Invalid minimumReleaseAge value in registry config"
        }
      };
    }
    if (minimumReleaseAgeSeconds > 0) {
      const exclude = registryConfig.policy?.minimumReleaseAgeExclude?.map((e) => e.trim().toLowerCase());
      if (!releaseExemptFromMinimumAge(exclude, publisherDid, slug)) {
        const indexedAt = Date.parse(releaseView.indexedAt);
        if (!Number.isFinite(indexedAt)) return {
          success: false,
          error: {
            code: "RELEASE_TIMESTAMP_INVALID",
            message: "Release record is missing a valid indexed-at timestamp; cannot evaluate minimum release age policy."
          }
        };
        const ageSeconds = (Date.now() - indexedAt) / 1e3;
        if (ageSeconds < minimumReleaseAgeSeconds) {
          const remaining = Math.ceil(minimumReleaseAgeSeconds - ageSeconds);
          return {
            success: false,
            error: {
              code: "RELEASE_TOO_NEW",
              message: `This release does not meet the configured minimum release age of ${minimumReleaseAgeSeconds}s. It will be installable in ~${remaining}s.`
            }
          };
        }
      }
    }
    const pluginId = await makeRegistryPluginId(publisherDid, slug);
    if (opts?.configuredPluginIds?.has(pluginId)) return {
      success: false,
      error: {
        code: "PLUGIN_ID_CONFLICT",
        message: "A configured plugin with the same derived id already exists"
      }
    };
    const stateRepo = new PluginStateRepository(db);
    const existing = await stateRepo.get(pluginId);
    if (existing) {
      if (existing.source === "registry") return {
        success: false,
        error: {
          code: "ALREADY_INSTALLED",
          message: `Plugin ${publisherDid}/${slug} is already installed`
        }
      };
      return {
        success: false,
        error: {
          code: "PLUGIN_ID_COLLISION",
          message: `A non-registry plugin already exists at the derived id ${pluginId}. Uninstall it before installing this registry plugin.`
        }
      };
    }
    const release = releaseView.release;
    const declaredUrl = release?.artifacts?.package?.url;
    const declaredChecksum = release?.artifacts?.package?.checksum;
    if (!declaredUrl || !declaredChecksum) return {
      success: false,
      error: {
        code: "INVALID_RELEASE",
        message: "Release record is missing artifact url or checksum"
      }
    };
    const artifactBytes = await fetchArtifact(releaseView.mirrors ?? [], declaredUrl);
    if (!await verifyChecksum(artifactBytes, declaredChecksum)) return {
      success: false,
      error: {
        code: "CHECKSUM_MISMATCH",
        message: "Artifact bytes do not match the release record's checksum, or the checksum encoding is unsupported."
      }
    };
    let bundle;
    try {
      bundle = await extractBundle(artifactBytes);
    } catch (err) {
      return {
        success: false,
        error: {
          code: "INVALID_BUNDLE",
          message: err instanceof Error ? err.message : "Failed to extract plugin bundle"
        }
      };
    }
    if (bundle.manifest.version !== version) return {
      success: false,
      error: {
        code: "MANIFEST_VERSION_MISMATCH",
        message: `Bundle manifest version (${bundle.manifest.version}) does not match release version (${version})`
      }
    };
    if (bundle.manifest.id !== slug) return {
      success: false,
      error: {
        code: "MANIFEST_ID_MISMATCH",
        message: `Bundle manifest id (${bundle.manifest.id}) does not match registry slug (${slug})`
      }
    };
    bundle.manifest = {
      ...bundle.manifest,
      id: pluginId
    };
    const actualCapabilities = canonicalCapabilitiesForDriftCheck(bundle.manifest.capabilities);
    if (actualCapabilities.length > 0) {
      if (input.acknowledgedDeclaredAccess === void 0) return {
        success: false,
        error: {
          code: "DECLARED_ACCESS_REQUIRED",
          message: "This plugin declares capabilities that require consent. Re-open the install dialog to review and acknowledge them."
        }
      };
      const acknowledged = canonicalCapabilitiesForDriftCheck(input.acknowledgedDeclaredAccess);
      if (acknowledged.length !== actualCapabilities.length || acknowledged.some((cap, i) => cap !== actualCapabilities[i])) return {
        success: false,
        error: {
          code: "DECLARED_ACCESS_DRIFT",
          message: "Plugin manifest has changed since you consented. Re-open the install dialog to review the new permissions."
        }
      };
    }
    await storeBundleInR2(storage, pluginId, version, bundle, "registry");
    const profile = packageView.profile;
    try {
      await stateRepo.upsert(pluginId, version, "active", {
        source: "registry",
        displayName: profile?.name ?? slug,
        description: profile?.description ?? void 0,
        registryPublisherDid: publisherDid,
        registrySlug: slug
      });
    } catch (stateErr) {
      let lostRace = false;
      try {
        const winner = await stateRepo.get(pluginId);
        lostRace = winner !== void 0 && winner !== null;
      } catch (probeErr) {
        console.warn(`[registry-install] Failed to probe state row for ${pluginId} after state-write failure; treating as orphan:`, probeErr);
      }
      if (!lostRace) try {
        await deleteBundleFromR2(storage, pluginId, version, "registry");
      } catch (cleanupErr) {
        console.warn(`[registry-install] Failed to clean up R2 bundle for ${pluginId}@${version} after state-row write failure:`, cleanupErr);
      }
      throw stateErr;
    }
    return {
      success: true,
      data: {
        pluginId,
        publisherDid,
        slug,
        version,
        capabilities: bundle.manifest.capabilities
      }
    };
  } catch (err) {
    if (err instanceof ClientValidationError) return {
      success: false,
      error: {
        code: "AGGREGATOR_RESPONSE_INVALID",
        message: `Aggregator returned a response that does not conform to its lexicon (${err.target})`
      }
    };
    if (err instanceof ClientResponseError) return {
      success: false,
      error: {
        code: err.status === 404 ? "AGGREGATOR_NOT_FOUND" : "AGGREGATOR_HTTP_ERROR",
        message: `Aggregator returned ${err.status}: ${err.error}`
      }
    };
    if (err instanceof EmDashStorageError) return {
      success: false,
      error: {
        code: err.code ?? "STORAGE_ERROR",
        message: "Storage error while installing plugin"
      }
    };
    console.error("[registry-install] Failed:", err);
    return {
      success: false,
      error: {
        code: "INSTALL_FAILED",
        message: err instanceof Error ? err.message : "Failed to install plugin from registry"
      }
    };
  }
}
async function handleRegistryUpdateCheck(db, registryConfigInput) {
  const registryConfig = coerceRegistryConfig(registryConfigInput);
  if (!registryConfig) return {
    success: false,
    error: {
      code: "REGISTRY_NOT_CONFIGURED",
      message: "Registry is not configured"
    }
  };
  try {
    const registryPlugins = await new PluginStateRepository(db).getRegistryPlugins();
    if (registryPlugins.length === 0) return {
      success: true,
      data: { items: [] }
    };
    const { DiscoveryClient } = await import('@emdash-cms/registry-client/discovery');
    const aggregatorDeadline = Date.now() + AGGREGATOR_TOTAL_BUDGET_MS;
    const discovery = new DiscoveryClient({
      aggregatorUrl: registryConfig.aggregatorUrl,
      acceptLabelers: registryConfig.acceptLabelers,
      fetch: timedFetch(aggregatorDeadline)
    });
    const items = [];
    for (const plugin of registryPlugins) {
      if (!plugin.registryPublisherDid || !plugin.registrySlug) continue;
      try {
        const latest = (await discovery.getLatestRelease({
          did: plugin.registryPublisherDid,
          package: plugin.registrySlug
        })).version;
        if (!latest) continue;
        const installed = plugin.version;
        items.push({
          pluginId: plugin.pluginId,
          installed,
          latest,
          hasUpdate: latest !== installed,
          hasCapabilityChanges: false,
          hasRouteVisibilityChanges: false
        });
      } catch (err) {
        console.warn(`[registry-update-check] Skipped ${plugin.pluginId}:`, err);
      }
    }
    return {
      success: true,
      data: { items }
    };
  } catch (err) {
    if (err instanceof ClientValidationError) return {
      success: false,
      error: {
        code: "AGGREGATOR_RESPONSE_INVALID",
        message: `Aggregator returned a response that does not conform to its lexicon (${err.target})`
      }
    };
    if (err instanceof ClientResponseError) return {
      success: false,
      error: {
        code: err.status === 404 ? "AGGREGATOR_NOT_FOUND" : "AGGREGATOR_HTTP_ERROR",
        message: `Aggregator returned ${err.status}: ${err.error}`
      }
    };
    console.error("[registry-update-check] Failed:", err);
    return {
      success: false,
      error: {
        code: "UPDATE_CHECK_FAILED",
        message: "Failed to check for registry updates"
      }
    };
  }
}

export { handleSchemaCollectionGet as $, handleMediaDelete as A, handleRevisionList as B, handleRevisionGet as C, handleRevisionRestore as D, EmDashStorageError as E, handleMarketplaceInstall as F, handleMarketplaceGetPlugin as G, handleMarketplaceSearch as H, handleRegistryInstall as I, handleMarketplaceUpdateCheck as J, handleRegistryUpdateCheck as K, handlePluginDisable as L, handlePluginEnable as M, handleMarketplaceUninstall as N, handleMarketplaceUpdate as O, PluginStateRepository as P, handlePluginGet as Q, handlePluginList as R, handleThemeGetDetail as S, handleThemeSearch as T, handleSchemaFieldReorder as U, handleSchemaFieldDelete as V, handleSchemaFieldGet as W, handleSchemaFieldUpdate as X, handleSchemaFieldList as Y, handleSchemaFieldCreate as Z, handleSchemaCollectionDelete as _, handleContentGet as a, handleSchemaCollectionUpdate as a0, handleSchemaCollectionList as a1, handleSchemaCollectionCreate as a2, handleOrphanedTableRegister as a3, handleOrphanedTableList as a4, handleContentGetIncludingTrashed as b, handleContentCreate as c, handleContentUpdate as d, handleContentDelete as e, handleContentListTrashed as f, handleContentRestore as g, handleContentList as h, handleContentPermanentDelete as i, handleContentCountTrashed as j, handleContentDuplicate as k, loadBundleFromR2 as l, handleContentPublish as m, normalizeRegistryConfig as n, handleContentUnpublish as o, handleContentSchedule as p, handleContentUnschedule as q, handleContentCountScheduled as r, handleContentDiscardDraft as s, handleContentCompare as t, handleContentTranslations as u, validateRev as v, handleMediaList as w, handleMediaGet as x, handleMediaCreate as y, handleMediaUpdate as z };
