import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { t as TaxonomyRepository } from './taxonomy-D4Uc2LsZ_BcrFt9f5.mjs';
import './request-cache-dzCt8TZB_CsgDJ6ch.mjs';
import './request-context_COpWwYmK.mjs';
import { l as invalidateTermCache } from './taxonomies-WamPVA2x_leJ5kPza.mjs';
import { a as apiError, r as requireDb, b as apiSuccess, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { C as contentTermsBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as requirePerm, a as requireOwnerPerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/astro/routes/api/content/[collection]/[id]/terms/[taxonomy].ts
const prerender = false;
/**
* Get terms assigned to an entry
*/
const GET = async ({ params, locals }) => {
	const { emdash, user } = locals;
	const { collection, id, taxonomy } = params;
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	if (!collection || !id || !taxonomy) return apiError("VALIDATION_ERROR", "Collection, id, and taxonomy required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		return apiSuccess({ terms: (await new TaxonomyRepository(emdash.db).getTermsForEntry(collection, id, taxonomy)).map((t) => ({
			id: t.id,
			name: t.name,
			slug: t.slug,
			label: t.label,
			parentId: t.parentId
		})) });
	} catch (error) {
		return handleError(error, "Failed to get entry terms", "TERMS_GET_ERROR");
	}
};
/**
* Set terms for an entry (replaces existing)
*/
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { collection, id, taxonomy } = params;
	if (!collection || !id || !taxonomy) return apiError("VALIDATION_ERROR", "Collection, id, and taxonomy required", 400);
	const denied = requirePerm(user, "content:edit_own");
	if (denied) return denied;
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	if (!emdash.handleContentGet) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	const existing = await emdash.handleContentGet(collection, id);
	if (!existing.success) return apiError(existing.error?.code ?? "NOT_FOUND", existing.error?.message ?? "Content not found", existing.error?.code === "NOT_FOUND" ? 404 : 500);
	const existingData = existing.data && typeof existing.data === "object" ? existing.data : void 0;
	const existingItem = existingData?.item && typeof existingData.item === "object" ? existingData.item : existingData;
	const editDenied = requireOwnerPerm(user, typeof existingItem?.authorId === "string" ? existingItem.authorId : "", "content:edit_own", "content:edit_any");
	if (editDenied) return editDenied;
	const canonicalId = typeof existingItem?.id === "string" ? existingItem.id : id;
	try {
		const body = await parseBody(request, contentTermsBody);
		if (isParseError(body)) return body;
		const { termIds } = body;
		const repo = new TaxonomyRepository(emdash.db);
		for (const termId of termIds) {
			const term = await repo.findById(termId);
			if (!term) return apiError("NOT_FOUND", `Term ID '${termId}' not found`, 404);
			if (term.name !== taxonomy) return apiError("VALIDATION_ERROR", `Term ID '${termId}' does not belong to taxonomy '${taxonomy}'`, 400);
		}
		await repo.setTermsForEntry(collection, canonicalId, taxonomy, termIds);
		/* @__PURE__ */ invalidateTermCache();
		return apiSuccess({ terms: (await repo.getTermsForEntry(collection, canonicalId, taxonomy)).map((t) => ({
			id: t.id,
			name: t.name,
			slug: t.slug,
			label: t.label,
			parentId: t.parentId
		})) });
	} catch (error) {
		return handleError(error, "Failed to set entry terms", "TERMS_SET_ERROR");
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
