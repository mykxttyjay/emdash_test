import { r as runMigrations } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './content-C0ooIs-f_Bwo8eX_E.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import './settings-hcubRfkr_CN9G8DMH.mjs';
import { a as apiError, h as handleError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { al as setupBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { t as validateSeed } from './validate-mz87i8_1_BElwTvmd.mjs';
import { t as applySeed } from './apply-wJhM_bwU_AvjWwG50.mjs';
import { t as loadSeed } from './load-DmXNVhst_DyTgr651.mjs';
import { g as getPublicOrigin } from './public-url-CUWWFME2_Hewc1XpU.mjs';
import { g as getAuthMode } from './mode-CaaiebZI_DSSHIDlR.mjs';

//#region src/astro/routes/api/setup/index.ts
const prerender = false;
const POST = async ({ request, url, locals }) => {
	const { emdash } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		try {
			const setupComplete = await new OptionsRepository(emdash.db).get("emdash:setup_complete");
			if (setupComplete === true || setupComplete === "true") return apiError("ALREADY_CONFIGURED", "Setup has already been completed", 409);
		} catch {}
		const body = await parseBody(request, setupBody);
		if (isParseError(body)) return body;
		try {
			await runMigrations(emdash.db);
		} catch (error) {
			return handleError(error, "Failed to run database migrations", "MIGRATION_ERROR");
		}
		const seed = await loadSeed();
		seed.settings = {
			...seed.settings,
			title: body.title,
			tagline: body.tagline
		};
		const validation = validateSeed(seed);
		if (!validation.valid) return apiError("INVALID_SEED", `Invalid seed file: ${validation.errors.join(", ")}`, 400);
		let result;
		try {
			result = await applySeed(emdash.db, seed, {
				includeContent: body.includeContent,
				onConflict: "skip",
				storage: emdash.storage ?? void 0
			});
		} catch (error) {
			return handleError(error, "Failed to apply seed", "SEED_ERROR");
		}
		const useExternalAuth = getAuthMode(emdash.config).type === "external";
		try {
			const options = new OptionsRepository(emdash.db);
			const siteUrl = getPublicOrigin(url, emdash.config);
			await options.setIfAbsent("emdash:site_url", siteUrl);
			if (useExternalAuth) {
				await options.set("emdash:setup_complete", true);
				await options.set("emdash:site_title", body.title);
				if (body.tagline) await options.set("emdash:site_tagline", body.tagline);
			} else await options.set("emdash:setup_state", {
				step: "site_complete",
				title: body.title,
				tagline: body.tagline
			});
		} catch (error) {
			console.error("Failed to save setup state:", error);
		}
		return apiSuccess({
			success: true,
			setupComplete: useExternalAuth,
			result
		});
	} catch (error) {
		return handleError(error, "Setup failed", "SETUP_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	POST,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
