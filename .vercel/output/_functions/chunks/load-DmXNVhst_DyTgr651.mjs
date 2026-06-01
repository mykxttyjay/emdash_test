import { _ as __exportAll } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';

//#region src/seed/load.ts
var load_exports = /* @__PURE__ */ __exportAll({
	loadSeed: () => loadSeed,
	loadUserSeed: () => loadUserSeed
});
async function getSeedModule() {
	return import('./seed_K7-lG5iX.mjs');
}
/**
* Load the seed file (user seed or default).
*/
async function loadSeed() {
	const { seed } = await getSeedModule();
	return seed;
}
/**
* Load the user's seed file, or null if none exists.
*/
async function loadUserSeed() {
	const { userSeed } = await getSeedModule();
	return userSeed ?? null;
}

export { loadUserSeed as n, load_exports as r, loadSeed as t };
