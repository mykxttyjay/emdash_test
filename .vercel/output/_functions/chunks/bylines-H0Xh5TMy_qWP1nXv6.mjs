import { g as getI18nConfig } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { B as BylineRepository } from './byline-CTaWkMh5_BRoEzpjM.mjs';

//#region src/api/handlers/bylines.ts
/**
* Reject locales the site doesn't configure. Returns `null` when the locale
* is fine (omitted, or matches `locales` in the i18n config, or i18n isn't
* configured at all).
*/
function rejectUnknownLocale(locale) {
	if (!locale) return null;
	const config = getI18nConfig();
	if (!config) return null;
	if (config.locales.includes(locale)) return null;
	return {
		success: false,
		error: {
			code: "VALIDATION_ERROR",
			message: `Locale "${locale}" is not configured for this site`
		}
	};
}
/**
* List every translation of a byline (by row id). Returns NOT_FOUND when no
* row with the given id exists.
*/
async function handleBylineTranslations(db, id) {
	try {
		const repo = new BylineRepository(db);
		if (!await repo.findById(id)) return {
			success: false,
			error: {
				code: "NOT_FOUND",
				message: "Byline not found"
			}
		};
		return {
			success: true,
			data: { items: await repo.listTranslations(id) }
		};
	} catch {
		return {
			success: false,
			error: {
				code: "BYLINE_TRANSLATIONS_ERROR",
				message: "Failed to list byline translations"
			}
		};
	}
}
/**
* Create a new byline. When `translationOf` is supplied, the new row joins the
* source byline's translation_group (a sibling in the same logical identity).
*
* Translating from a source row only makes sense when the caller names the
* target locale, otherwise we'd silently clone into the configured default,
* which is almost never what's intended (and will collide if the source is
* already the default-locale row). Mirrors `handleMenuCreate`.
*/
async function handleBylineCreate(db, input) {
	try {
		if (input.translationOf && !input.locale) return {
			success: false,
			error: {
				code: "VALIDATION_ERROR",
				message: "`locale` is required when `translationOf` is provided"
			}
		};
		const localeErr = rejectUnknownLocale(input.locale);
		if (localeErr) return localeErr;
		const repo = new BylineRepository(db);
		let sourceGroup;
		if (input.translationOf) {
			const source = await repo.findById(input.translationOf);
			if (!source) return {
				success: false,
				error: {
					code: "NOT_FOUND",
					message: "Source byline for translation not found"
				}
			};
			sourceGroup = source.translationGroup ?? source.id;
		}
		const effectiveLocale = input.locale ?? getI18nConfig()?.defaultLocale ?? "en";
		if (sourceGroup) {
			if ((await repo.findByTranslationGroup(sourceGroup)).some((b) => b.locale === effectiveLocale)) return {
				success: false,
				error: {
					code: "CONFLICT",
					message: `Translation already exists in locale "${effectiveLocale}" for this byline`
				}
			};
		}
		if (await repo.findBySlug(input.slug, { locale: effectiveLocale })) return {
			success: false,
			error: {
				code: "CONFLICT",
				message: `Byline "${input.slug}" already exists${input.locale ? ` in locale "${input.locale}"` : ""}`
			}
		};
		return {
			success: true,
			data: await repo.create(input)
		};
	} catch {
		return {
			success: false,
			error: {
				code: "BYLINE_CREATE_ERROR",
				message: "Failed to create byline"
			}
		};
	}
}

export { handleBylineCreate as a, handleBylineTranslations as h };
