import { _ as __exportAll } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { g as getSiteSettingsWithDb, s as setSiteSettings } from './settings-hcubRfkr_CN9G8DMH.mjs';

//#region src/api/handlers/settings.ts
var settings_exports = /* @__PURE__ */ __exportAll({
	handleSettingsGet: () => handleSettingsGet,
	handleSettingsUpdate: () => handleSettingsUpdate
});
/**
* Get all site settings
*/
async function handleSettingsGet(db, storage) {
	try {
		return {
			success: true,
			data: await getSiteSettingsWithDb(db, storage)
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SETTINGS_READ_ERROR",
				message: "Failed to get settings"
			}
		};
	}
}
/**
* Update site settings
*/
async function handleSettingsUpdate(db, storage, input) {
	try {
		await setSiteSettings(input, db);
		return {
			success: true,
			data: await getSiteSettingsWithDb(db, storage)
		};
	} catch {
		return {
			success: false,
			error: {
				code: "SETTINGS_UPDATE_ERROR",
				message: "Failed to update settings"
			}
		};
	}
}

export { handleSettingsUpdate as n, settings_exports as r, handleSettingsGet as t };
