import { v as validateIdentifier } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { C as CommentRepository } from './comment-_yzlBYPx_CEy8OX5F.mjs';
import { a as apiError, r as requireDb, u as unwrapResult, h as handleError, b as apiSuccess } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { x as createCommentBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { e as extractRequestMeta } from './request-meta-C_Cjii-T_DOD2oc_A.mjs';
import { r as resolveSecretsCached } from './secrets-rPdhEBkD_BN1YxHO5.mjs';
import { e as handleCommentList, f as hashIp, g as checkRateLimit } from './comments-DxID-rsd_Cr2w6gBY.mjs';
import { g as getSiteBaseUrl } from './site-url-xkhw1tcz_TABJtqpK.mjs';
import { c as createComment, s as sendCommentNotification } from './service-BuuTdGAT_CRN1mW5D.mjs';

//#region src/astro/routes/api/comments/[collection]/[contentId]/index.ts
const prerender = false;
/**
* List approved comments for a content item (public, no auth required)
*/
const GET = async ({ params, url, locals }) => {
	const { emdash } = locals;
	const { collection, contentId } = params;
	if (!collection || !contentId) return apiError("VALIDATION_ERROR", "Collection and content ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		const limit = Math.min(Number(url.searchParams.get("limit") || 50), 100);
		const cursor = url.searchParams.get("cursor") ?? void 0;
		const threaded = url.searchParams.get("threaded") === "true";
		const collectionRow = await emdash.db.selectFrom("_emdash_collections").select(["comments_enabled"]).where("slug", "=", collection).executeTakeFirst();
		if (!collectionRow) return apiError("NOT_FOUND", `Collection '${collection}' not found`, 404);
		if (!collectionRow.comments_enabled) return apiError("COMMENTS_DISABLED", "Comments are not enabled for this collection", 403);
		return unwrapResult(await handleCommentList(emdash.db, collection, contentId, {
			limit,
			cursor,
			threaded
		}));
	} catch (error) {
		return handleError(error, "Failed to list comments", "COMMENT_LIST_ERROR");
	}
};
/**
* Submit a comment (public, gated by anti-spam checks)
*/
const POST = async ({ params, request, locals }) => {
	const { emdash, user } = locals;
	const { collection, contentId } = params;
	if (!collection || !contentId) return apiError("VALIDATION_ERROR", "Collection and content ID required", 400);
	const dbErr = requireDb(emdash?.db);
	if (dbErr) return dbErr;
	try {
		const body = await parseBody(request, createCommentBody);
		if (isParseError(body)) return body;
		const collectionRow = await emdash.db.selectFrom("_emdash_collections").select([
			"comments_enabled",
			"comments_moderation",
			"comments_closed_after_days",
			"comments_auto_approve_users"
		]).where("slug", "=", collection).executeTakeFirst();
		if (!collectionRow) return apiError("NOT_FOUND", `Collection '${collection}' not found`, 404);
		if (!collectionRow.comments_enabled) return apiError("COMMENTS_DISABLED", "Comments are not enabled for this collection", 403);
		validateIdentifier(collection, "collection");
		const contentRow = await emdash.db.selectFrom(`ec_${collection}`).select([
			"id",
			"slug",
			"author_id",
			"published_at"
		]).where("id", "=", contentId).where("status", "=", "published").where("deleted_at", "is", null).executeTakeFirst();
		if (!contentRow) return apiError("NOT_FOUND", "Content not found", 404);
		if (collectionRow.comments_closed_after_days > 0) {
			const publishedAt = contentRow.published_at;
			if (publishedAt) {
				const closedDate = new Date(publishedAt);
				closedDate.setDate(closedDate.getDate() + collectionRow.comments_closed_after_days);
				if (/* @__PURE__ */ new Date() > closedDate) return apiError("COMMENTS_CLOSED", "Comments are closed for this content", 403);
			}
		}
		if (body.website_url) return apiSuccess({
			status: "pending",
			message: "Comment submitted for review"
		});
		const meta = extractRequestMeta(request, emdash.config);
		const { ipSalt } = await resolveSecretsCached(emdash.db);
		let ipHash;
		if (meta.ip) ipHash = await hashIp(meta.ip, ipSalt);
		else ipHash = "unknown";
		const unknownBucketLimit = ipHash === "unknown" ? 20 : void 0;
		if (await checkRateLimit(emdash.db, ipHash, unknownBucketLimit)) return apiError("RATE_LIMITED", "Too many comments. Please try again later.", 429);
		const collectionSettings = {
			commentsEnabled: collectionRow.comments_enabled === 1,
			commentsModeration: collectionRow.comments_moderation,
			commentsClosedAfterDays: collectionRow.comments_closed_after_days,
			commentsAutoApproveUsers: collectionRow.comments_auto_approve_users === 1
		};
		let authorName = body.authorName;
		let authorEmail = body.authorEmail;
		let authorUserId = null;
		if (user) {
			authorName = user.name || authorName;
			authorEmail = user.email;
			authorUserId = user.id;
		}
		let resolvedParentId = body.parentId ?? null;
		if (body.parentId) {
			const parent = await new CommentRepository(emdash.db).findById(body.parentId);
			if (!parent) return apiError("VALIDATION_ERROR", "Parent comment not found", 400);
			if (parent.collection !== collection || parent.contentId !== contentId) return apiError("VALIDATION_ERROR", "Parent comment belongs to different content", 400);
			resolvedParentId = parent.parentId ?? parent.id;
		}
		const hookRunner = {
			async runBeforeCreate(event) {
				return emdash.hooks.runCommentBeforeCreate(event);
			},
			async runModerate(event) {
				const result = await emdash.hooks.invokeExclusiveHook("comment:moderate", event);
				if (!result) return {
					status: "pending",
					reason: "No moderator configured"
				};
				if (result.error) {
					console.error(`[comments] Moderation error (${result.pluginId}):`, result.error.message);
					return {
						status: "pending",
						reason: "Moderation error"
					};
				}
				return result.result;
			},
			fireAfterCreate(event) {
				emdash.hooks.runCommentAfterCreate(event).catch((err) => console.error("[comments] afterCreate error:", err instanceof Error ? err.message : err));
			},
			fireAfterModerate(event) {
				emdash.hooks.runCommentAfterModerate(event).catch((err) => console.error("[comments] afterModerate error:", err instanceof Error ? err.message : err));
			}
		};
		const typedContent = contentRow;
		let contentAuthor;
		if (typedContent.author_id) {
			const authorRow = await emdash.db.selectFrom("users").select([
				"id",
				"name",
				"email",
				"email_verified"
			]).where("id", "=", typedContent.author_id).executeTakeFirst();
			if (authorRow && authorRow.email_verified) contentAuthor = {
				id: authorRow.id,
				name: authorRow.name,
				email: authorRow.email
			};
		}
		const result = await createComment(emdash.db, {
			collection,
			contentId,
			parentId: resolvedParentId,
			authorName,
			authorEmail,
			authorUserId,
			body: body.body,
			ipHash,
			userAgent: meta.userAgent
		}, collectionSettings, hookRunner, {
			id: typedContent.id,
			collection,
			slug: typedContent.slug,
			author: contentAuthor
		});
		if (!result) return apiError("COMMENT_REJECTED", "Comment was rejected", 403);
		if (result.comment.status === "approved" && emdash.email && contentAuthor) try {
			const adminBaseUrl = await getSiteBaseUrl(emdash.db, request);
			await sendCommentNotification({
				email: emdash.email,
				comment: result.comment,
				contentAuthor,
				adminBaseUrl
			});
		} catch (err) {
			console.error("[comments] notification error:", err instanceof Error ? err.message : err);
		}
		return apiSuccess({
			id: result.comment.id,
			status: result.comment.status,
			message: result.comment.status === "approved" ? "Comment published" : "Comment submitted for review"
		}, 201);
	} catch (error) {
		return handleError(error, "Failed to submit comment", "COMMENT_CREATE_ERROR");
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
