import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';

//#region src/api/site-url.ts
async function getSiteBaseUrl(db, request) {
	const storedUrl = await new OptionsRepository(db).get("emdash:site_url");
	if (storedUrl) return `${storedUrl}/_emdash`;
	const url = new URL(request.url);
	return `${url.protocol}//${url.host}/_emdash`;
}

export { getSiteBaseUrl as g };
