//#region src/plugins/email-console.ts
/** Plugin ID for the dev console email provider */
/**
* In-memory store for dev emails.
* Uses globalThis so the same array is shared across Vite SSR module
* instances (the runtime and the route handler may load separate copies
* of this module, but globalThis is always the same object).
*/
const GLOBAL_KEY = Symbol.for("emdash:dev-emails");
const g = globalThis;
(() => {
	const existing = g[GLOBAL_KEY];
	if (existing) return existing;
	const fresh = [];
	g[GLOBAL_KEY] = fresh;
	return fresh;
})();
