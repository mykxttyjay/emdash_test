import { _ as __exportAll } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { c as compilePattern, m as matchPattern, i as interpolateDestination } from './redirect-CNv4mHX2_DtN1rCAr.mjs';

//#region src/redirects/cache.ts
var cache_exports = /* @__PURE__ */ __exportAll({
	getCachedRedirects: () => getCachedRedirects,
	invalidateRedirectCache: () => invalidateRedirectCache,
	matchCachedPatterns: () => matchCachedPatterns,
	setCachedRedirects: () => setCachedRedirects
});
/**
* Cached enabled redirects.
* null = not yet populated, object = cached.
*/
let cachedRedirects = null;
/**
* Invalidate the cached redirects (both exact and pattern).
* Call when redirects are created, updated, or deleted.
*/
function invalidateRedirectCache() {
	cachedRedirects = null;
}
/**
* Get the cached redirects, or null if the cache is cold.
*/
function getCachedRedirects() {
	return cachedRedirects;
}
/**
* Populate the cache from a list of enabled redirects (both exact and
* pattern). The caller is responsible for passing only enabled rows — the
* cache stores them as-is.
*/
function setCachedRedirects(redirects) {
	const exact = /* @__PURE__ */ new Map();
	const patterns = [];
	for (const r of redirects) if (r.isPattern) patterns.push({
		redirect: r,
		compiled: compilePattern(r.source)
	});
	else exact.set(r.source, r);
	cachedRedirects = {
		exact,
		patterns
	};
	return cachedRedirects;
}
/**
* Match a path against the cached pattern rules.
* Returns the resolved destination and matching redirect, or null.
*/
function matchCachedPatterns(rules, pathname) {
	for (const { redirect, compiled } of rules) {
		const params = matchPattern(compiled, pathname);
		if (params) return {
			redirect,
			destination: interpolateDestination(redirect.destination, params)
		};
	}
	return null;
}

export { setCachedRedirects as a, matchCachedPatterns as i, getCachedRedirects as n, invalidateRedirectCache as r, cache_exports as t };
