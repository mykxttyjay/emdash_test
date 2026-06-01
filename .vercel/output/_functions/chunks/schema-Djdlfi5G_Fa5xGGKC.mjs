import { _ as __exportAll } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { r as requestCached } from './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import { S as SchemaRegistry } from './registry-DqrAQDXH_ByM39WgY.mjs';
import { g as getDb } from './loader-Chm5h7Gr_VuvI1mhf.mjs';

//#region src/schema/query.ts
/**
* Get collection metadata by slug.
*
* @example
* ```ts
* import { getCollectionInfo } from "emdash";
*
* const info = await getCollectionInfo("posts");
* if (info?.commentsEnabled) {
*   // render comment UI
* }
* ```
*/
async function getCollectionInfo(slug) {
	return requestCached(`collection-info:${slug}`, async () => {
		return getCollectionInfoWithDb(await getDb(), slug);
	});
}
/**
* Get collection metadata with an explicit db handle.
*
* @internal Use `getCollectionInfo()` in templates. This variant is for
* routes that already have a database handle.
*/
async function getCollectionInfoWithDb(db, slug) {
	return new SchemaRegistry(db).getCollection(slug);
}

//#endregion
//#region src/schema/index.ts
var schema_exports = /* @__PURE__ */ __exportAll({ SchemaRegistry: () => SchemaRegistry });

export { getCollectionInfo as n, schema_exports as t };
