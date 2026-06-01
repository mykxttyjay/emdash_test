import { t as ContentRepository } from './content-C0ooIs-f_Bwo8eX_E.mjs';
import { v as validateIdentifier } from './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import { M as MediaRepository } from './media-oqRcNiQf_LipfpTx8.mjs';
import { U as UserRepository } from './user-D3BD5zdT_BXs4wDjl.mjs';
import { sql } from 'kysely';
import { a as apiError, u as unwrapResult, h as handleError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';

//#region src/api/handlers/dashboard.ts
/**
* Dashboard stats handler
*
* Returns summary data for the admin dashboard in a single request:
* collection content counts, media count, user count, and recent
* content across all collections.
*/
/**
* Fetch dashboard statistics.
*
* Queries are intentionally lightweight — counts use indexed columns,
* and recent items are capped at 10.
*/
async function handleDashboardStats(db) {
	try {
		const collections = await db.selectFrom("_emdash_collections").select(["slug", "label"]).orderBy("slug", "asc").execute();
		const contentRepo = new ContentRepository(db);
		const collectionStats = await Promise.all(collections.map(async (col) => {
			const stats = await contentRepo.getStats(col.slug);
			return {
				slug: col.slug,
				label: col.label,
				total: stats.total,
				published: stats.published,
				draft: stats.draft
			};
		}));
		const mediaRepo = new MediaRepository(db);
		const userRepo = new UserRepository(db);
		const [mediaCount, userCount] = await Promise.all([mediaRepo.count(), userRepo.count()]);
		return {
			success: true,
			data: {
				collections: collectionStats,
				mediaCount,
				userCount,
				recentItems: await fetchRecentItems(db, collections)
			}
		};
	} catch (error) {
		console.error("Dashboard stats error:", error);
		return {
			success: false,
			error: {
				code: "DASHBOARD_STATS_ERROR",
				message: "Failed to load dashboard statistics"
			}
		};
	}
}
/**
* Fetch the 10 most recently updated items across all collections.
*
* Uses UNION ALL over each ec_* table. The query is safe because
* collection slugs come from the system table and are validated.
*
* `title` is not a standard column — it's a user-defined field. We query
* `_emdash_fields` to discover which collections have one and fall back
* to `slug` (which is always present) otherwise.
*/
async function fetchRecentItems(db, collections) {
	if (collections.length === 0) return [];
	const titleFields = await db.selectFrom("_emdash_fields as f").innerJoin("_emdash_collections as c", "c.id", "f.collection_id").select(["c.slug as collection_slug"]).where("f.slug", "=", "title").execute();
	const collectionsWithTitle = new Set(titleFields.map((r) => r.collection_slug));
	return (await Promise.all(collections.map(async (col) => {
		validateIdentifier(col.slug);
		const table = `ec_${col.slug}`;
		const titleExpr = collectionsWithTitle.has(col.slug) ? sql`COALESCE(title, slug, id)` : sql`COALESCE(slug, id)`;
		return (await sql`
				SELECT
					id,
					${sql.lit(col.slug)} AS collection,
					${sql.lit(col.label)} AS collection_label,
					${titleExpr} AS title,
					slug,
					status,
					updated_at,
					author_id
				FROM ${sql.ref(table)}
				WHERE deleted_at IS NULL
				ORDER BY updated_at DESC
				LIMIT 10
			`.execute(db)).rows;
	}))).flat().toSorted((a, b) => a.updated_at < b.updated_at ? 1 : a.updated_at > b.updated_at ? -1 : 0).slice(0, 10).map((row) => ({
		id: row.id,
		collection: row.collection,
		collectionLabel: row.collection_label,
		title: row.title,
		slug: row.slug,
		status: row.status,
		updatedAt: row.updated_at,
		authorId: row.author_id
	}));
}

//#region src/astro/routes/api/dashboard.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const denied = requirePerm(user, "content:read");
	if (denied) return denied;
	if (!emdash?.db) return apiError("NOT_CONFIGURED", "EmDash is not initialized", 500);
	try {
		return unwrapResult(await handleDashboardStats(emdash.db));
	} catch (error) {
		return handleError(error, "Failed to load dashboard", "DASHBOARD_ERROR");
	}
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
