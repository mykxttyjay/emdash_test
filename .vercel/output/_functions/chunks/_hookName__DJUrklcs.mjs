import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { O as OptionsRepository } from './options-BL4X94qY_BcYAYOpH.mjs';
import { a as apiError, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { z } from 'zod';

//#region src/astro/routes/api/admin/hooks/exclusive/[hookName].ts
const prerender = false;
/** Hook name format: namespace:action (e.g., "content:beforeSave") */
const HOOK_NAME_RE = /^[a-z]+:[a-zA-Z]+$/;
const setSelectionSchema = z.object({ pluginId: z.string().min(1).nullable() });
const PUT = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const denied = requirePerm(user, "settings:manage");
	if (denied) return denied;
	const hookName = params.hookName;
	if (!hookName) return apiError("VALIDATION_ERROR", "Hook name is required", 400);
	if (!HOOK_NAME_RE.test(hookName)) return apiError("VALIDATION_ERROR", "Invalid hook name format", 400);
	try {
		const pipeline = emdash.hooks;
		if (!pipeline.isExclusiveHook(hookName)) return apiError("NOT_FOUND", `Hook '${hookName}' is not a registered exclusive hook`, 404);
		const body = await parseBody(request, setSelectionSchema);
		if (isParseError(body)) return body;
		const optionsRepo = new OptionsRepository(emdash.db);
		const optionKey = `emdash:exclusive_hook:${hookName}`;
		if (body.pluginId === null) {
			await optionsRepo.delete(optionKey);
			pipeline.clearExclusiveSelection(hookName);
		} else {
			if (!pipeline.getExclusiveHookProviders(hookName).some((p) => p.pluginId === body.pluginId)) return apiError("VALIDATION_ERROR", `Plugin '${body.pluginId}' is not a provider for hook '${hookName}'`, 400);
			await optionsRepo.set(optionKey, body.pluginId);
			pipeline.setExclusiveSelection(hookName, body.pluginId);
		}
		return apiSuccess({
			hookName,
			selectedPluginId: body.pluginId
		});
	} catch (error) {
		return handleError(error, "Failed to set exclusive hook selection", "EXCLUSIVE_HOOK_SET_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	PUT,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
