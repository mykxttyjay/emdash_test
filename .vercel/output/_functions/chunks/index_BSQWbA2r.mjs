import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/admin/hooks/exclusive/index.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;
	try {
		const pipeline = emdash.hooks;
		const exclusiveHookNames = pipeline.getRegisteredExclusiveHooks();
		const optionsRepo = new OptionsRepository(emdash.db);
		const hooks = [];
		for (const hookName of exclusiveHookNames) {
			const providers = pipeline.getExclusiveHookProviders(hookName);
			const selection = await optionsRepo.get(`emdash:exclusive_hook:${hookName}`);
			hooks.push({
				hookName,
				providers: providers.map((provider) => ({ pluginId: provider.pluginId })),
				selectedPluginId: selection
			});
		}
		return apiSuccess({ items: hooks });
	} catch (error) {
		return handleError(error, "Failed to list exclusive hooks", "EXCLUSIVE_HOOKS_LIST_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
