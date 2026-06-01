import { M as MediaRepository } from './media-oqRcNiQf_LipfpTx8.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';

//#region src/settings/index.ts
/** Prefix for site settings in the options table */
const SETTINGS_PREFIX = "site:";
const SITE_SETTINGS_CACHE_KEY = Symbol.for("emdash:site-settings");
const g = globalThis;
const holder = g[SITE_SETTINGS_CACHE_KEY] ?? (() => {
	const h = {
		version: 0,
		cached: null,
		cachedVersion: -1
	};
	g[SITE_SETTINGS_CACHE_KEY] = h;
	return h;
})();
/**
* Bump the isolate-wide site-settings cache version, forcing the next
* `getSiteSettings()` to re-query the database.
*
* Called from every `site:*` write path. Other isolates still serve their
* own cached copy until they expire — staleness bounded by isolate lifetime.
*/
function invalidateSiteSettingsCache() {
	holder.version++;
	holder.cached = null;
	holder.cachedVersion = -1;
}
/**
* Resolve a media reference to include the full URL plus content metadata.
*
* Pulls `mimeType` and intrinsic dimensions from the media row so callers
* can emit correct head tags (e.g. `<link rel="icon" type="image/svg+xml">`,
* which Chromium requires when the URL has no `.svg` extension) without
* a second round-trip to the media table.
*/
async function resolveMediaReference(mediaRef, db, _storage) {
	if (!mediaRef?.mediaId) return mediaRef;
	try {
		const media = await new MediaRepository(db).findById(mediaRef.mediaId);
		if (media) return {
			...mediaRef,
			url: `/_emdash/api/media/file/${media.storageKey}`,
			contentType: media.mimeType,
			...media.width !== null ? { width: media.width } : {},
			...media.height !== null ? { height: media.height } : {}
		};
	} catch {}
	return mediaRef;
}
/**
* Get all site settings (with explicit db)
*
* @internal Use `getSiteSettings()` in templates. This variant is for admin routes
* that already have a database handle.
*/
async function getSiteSettingsWithDb(db, storage = null) {
	const allOptions = await new OptionsRepository(db).getByPrefix(SETTINGS_PREFIX);
	const settings = {};
	for (const [key, value] of allOptions) {
		const settingKey = key.replace(SETTINGS_PREFIX, "");
		settings[settingKey] = value;
	}
	const typedSettings = settings;
	if (typedSettings.logo) typedSettings.logo = await resolveMediaReference(typedSettings.logo, db);
	if (typedSettings.favicon) typedSettings.favicon = await resolveMediaReference(typedSettings.favicon, db);
	if (typedSettings.seo?.defaultOgImage) typedSettings.seo = {
		...typedSettings.seo,
		defaultOgImage: await resolveMediaReference(typedSettings.seo.defaultOgImage, db)
	};
	return typedSettings;
}
/**
* Set site settings (internal function used by admin API)
*
* Merges provided settings with existing ones. Only provided fields are updated.
* Media references should include just the mediaId; URLs are resolved on read.
*
* @param settings - Partial settings object with values to update
* @param db - Kysely database instance
* @returns Promise that resolves when settings are saved
*
* @internal
*
* @example
* ```ts
* // Update multiple settings at once
* await setSiteSettings({
*   title: "My Site",
*   tagline: "Welcome",
*   logo: { mediaId: "med_123", alt: "Logo" }
* }, db);
* ```
*/
async function setSiteSettings(settings, db) {
	const options = new OptionsRepository(db);
	const updates = {};
	for (const [key, value] of Object.entries(settings)) if (value !== void 0) updates[`${SETTINGS_PREFIX}${key}`] = value;
	try {
		await options.setMany(updates);
	} finally {
		invalidateSiteSettingsCache();
	}
}

export { getSiteSettingsWithDb as g, invalidateSiteSettingsCache as i, setSiteSettings as s };
