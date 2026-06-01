import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import { t as handleSettingsGet, n as handleSettingsUpdate } from './settings-CJnKiWuR_DQ6u9CPP.mjs';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { ai as settingsUpdateBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/settings.ts
const prerender = false;
/**
* GET /_emdash/api/settings
*
* Returns all site settings as a JSON object.
* Unset values are undefined. Media references include resolved URLs.
*/
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:read");
	if (denied) return denied;
	try {
		return unwrapResult(await handleSettingsGet(emdash.db, emdash.storage));
	} catch (error) {
		return handleError(error, "Failed to get settings", "SETTINGS_READ_ERROR");
	}
};
/**
* POST /_emdash/api/settings
*
* Updates site settings. Accepts a partial settings object.
* Merges with existing settings and returns the updated settings.
*/
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, settingsUpdateBody);
		if (isParseError(body)) return body;
		return unwrapResult(await handleSettingsUpdate(emdash.db, emdash.storage, body));
	} catch (error) {
		return handleError(error, "Failed to update settings", "SETTINGS_UPDATE_ERROR");
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
