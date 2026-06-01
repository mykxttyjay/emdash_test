import 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import * as z from 'zod/v4';
export { z };
import { aw as generateCspDigest, b8 as unescapeHTML, Q as renderTemplate, bc as removeBase, aT as isRemotePath, A as AstroError, bd as UnknownContentCollectionError } from './sequence_DO5rsetM.mjs';
import { s as spreadAttributes } from './index_DbzAPd79.mjs';
import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'clsx';
import { b as VALID_INPUT_FORMATS } from './consts_BLFvATRa.mjs';
import 'piccolore';
import * as devalue from 'devalue';

function createSvgComponent({ meta, attributes, children, styles }) {
  const hasStyles = styles.length > 0;
  const Component = createComponent({
    async factory(result, props) {
      const normalizedProps = normalizeProps(attributes, props);
      if (hasStyles && result.cspDestination) {
        for (const style of styles) {
          const hash = await generateCspDigest(style, result.cspAlgorithm);
          result._metadata.extraStyleHashes.push(hash);
        }
      }
      return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
    },
    propagation: hasStyles ? "self" : "none"
  });
  Object.defineProperty(Component, "toJSON", {
    value: () => meta,
    enumerable: false
  });
  return Object.assign(Component, meta);
}
const ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
const DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BcEe_9wP.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

function formatZodError(error) {
  return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
class LiveCollectionError extends Error {
  collection;
  message;
  cause;
  constructor(collection, message, cause) {
    super(message);
    this.collection = collection;
    this.message = message;
    this.cause = cause;
    this.name = "LiveCollectionError";
    if (cause?.stack) {
      this.stack = cause.stack;
    }
  }
  static is(error) {
    return error instanceof LiveCollectionError;
  }
}
class LiveEntryNotFoundError extends LiveCollectionError {
  constructor(collection, entryFilter) {
    super(
      collection,
      `Entry ${collection} \u2192 ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`
    );
    this.name = "LiveEntryNotFoundError";
  }
  static is(error) {
    return error?.name === "LiveEntryNotFoundError";
  }
}
class LiveCollectionValidationError extends LiveCollectionError {
  constructor(collection, entryId, error) {
    super(
      collection,
      [
        `**${collection} \u2192 ${entryId}** data does not match the collection schema.
`,
        ...formatZodError(error),
        ""
      ].join("\n")
    );
    this.name = "LiveCollectionValidationError";
  }
  static is(error) {
    return error?.name === "LiveCollectionValidationError";
  }
}
class LiveCollectionCacheHintError extends LiveCollectionError {
  constructor(collection, entryId, error) {
    super(
      collection,
      [
        `**${String(collection)}${entryId ? ` \u2192 ${String(entryId)}` : ""}** returned an invalid cache hint.
`,
        ...formatZodError(error),
        ""
      ].join("\n")
    );
    this.name = "LiveCollectionCacheHintError";
  }
  static is(error) {
    return error?.name === "LiveCollectionCacheHintError";
  }
}

const cacheHintSchema = z.object({
  tags: z.array(z.string()).optional(),
  lastModified: z.date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
  try {
    const parsed = await z.safeParseAsync(schema, entry.data);
    if (!parsed.success) {
      return {
        error: new LiveCollectionValidationError(collection, entry.id, parsed.error)
      };
    }
    if (entry.cacheHint) {
      const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
      if (!cacheHint.success) {
        return {
          error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error)
        };
      }
      entry.cacheHint = cacheHint.data;
    }
    return {
      entry: {
        ...entry,
        data: parsed.data
      }
    };
  } catch (error) {
    return {
      error: new LiveCollectionError(
        collection,
        `Unexpected error parsing entry ${entry.id} in collection ${collection}`,
        error
      )
    };
  }
}
function createGetCollection({
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./_astro_asset-imports_D9aVaOQr.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
  };
}
function createGetLiveCollection({
  liveCollections
}) {
  return async function getLiveCollection(collection, filter) {
    if (!(collection in liveCollections)) {
      return {
        error: new LiveCollectionError(
          collection,
          `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`
        )
      };
    }
    try {
      const context = {
        filter,
        collection
      };
      const response = await liveCollections[collection].loader?.loadCollection?.(context);
      if (response && "error" in response) {
        return { error: response.error };
      }
      const { schema } = liveCollections[collection];
      let processedEntries = response.entries;
      if (schema) {
        const entryResults = await Promise.all(
          response.entries.map((entry) => parseLiveEntry(entry, schema, collection))
        );
        for (const result of entryResults) {
          if (result.error) {
            return { error: result.error };
          }
        }
        processedEntries = entryResults.map((result) => result.entry);
      }
      let cacheHint = response.cacheHint;
      if (cacheHint) {
        const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
        if (!cacheHintResult.success) {
          return {
            error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error)
          };
        }
        cacheHint = cacheHintResult.data;
      }
      if (processedEntries.length > 0) {
        const entryTags = /* @__PURE__ */ new Set();
        let latestModified;
        for (const entry of processedEntries) {
          if (entry.cacheHint) {
            if (entry.cacheHint.tags) {
              entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
            }
            if (entry.cacheHint.lastModified instanceof Date) {
              if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) {
                latestModified = entry.cacheHint.lastModified;
              }
            }
          }
        }
        if (entryTags.size > 0 || latestModified || cacheHint) {
          const mergedCacheHint = {};
          if (cacheHint?.tags || entryTags.size > 0) {
            mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
          }
          if (cacheHint?.lastModified && latestModified) {
            mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
          } else if (cacheHint?.lastModified || latestModified) {
            mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
          }
          cacheHint = mergedCacheHint;
        }
      }
      return {
        entries: processedEntries,
        cacheHint
      };
    } catch (error) {
      return {
        error: new LiveCollectionError(
          collection,
          `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`,
          error
        )
      };
    }
  };
}
function createGetLiveEntry({
  liveCollections
}) {
  return async function getLiveEntry(collection, lookup) {
    if (!(collection in liveCollections)) {
      return {
        error: new LiveCollectionError(
          collection,
          `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`
        )
      };
    }
    try {
      const lookupObject = {
        filter: typeof lookup === "string" ? { id: lookup } : lookup,
        collection
      };
      let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
      if (entry && "error" in entry) {
        return { error: entry.error };
      }
      if (!entry) {
        return {
          error: new LiveEntryNotFoundError(collection, lookup)
        };
      }
      const { schema } = liveCollections[collection];
      if (schema) {
        const result = await parseLiveEntry(entry, schema, collection);
        if (result.error) {
          return { error: result.error };
        }
        entry = result.entry;
      }
      return {
        entry,
        cacheHint: entry.cacheHint
      };
    } catch (error) {
      return {
        error: new LiveCollectionError(
          collection,
          `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`,
          error
        )
      };
    }
  };
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        if (imported.__svgData) {
          const { __svgData: svgData, ...meta } = imported;
          ctx.update(createSvgComponent({ meta, ...svgData }));
        } else {
          ctx.update(imported);
        }
      } else {
        ctx.update(src);
      }
    }
  });
}

// astro-head-inject

const liveCollections = {};

const getCollection = createGetCollection({
	liveCollections,
});

const getLiveCollection = createGetLiveCollection({
	liveCollections,
});

const getLiveEntry = createGetLiveEntry({
	liveCollections,
});

export { getCollection, getLiveCollection, getLiveEntry };
