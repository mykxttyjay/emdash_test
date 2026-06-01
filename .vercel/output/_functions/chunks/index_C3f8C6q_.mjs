import './types-ByV5sgsv_DJ3e8Y6Y.mjs';
import './request-context_COpWwYmK.mjs';
import { b as apiSuccess, h as handleError, a as apiError } from './error-CPh_8eLq_J-oZhpsQ.mjs';
import { p as parseBody, i as isParseError } from './parse-3-caTKgt_f17NjlEd.mjs';
import { as as createWidgetAreaBody } from './setup-Cf_TyOv5_Da69AHYi.mjs';
import { r as rowToWidget } from './widgets-lShIQXU5_pSVBhwGU.mjs';
import { r as requirePerm } from './authorize-Bkwe8kuL_CyCbUGQn.mjs';
import { ulid } from 'ulidx';

//#region src/astro/routes/api/widget-areas/index.ts
const prerender = false;
const GET = async ({ locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const denied = requirePerm(user, "widgets:read");
	if (denied) return denied;
	try {
		const areas = await db.selectFrom("_emdash_widget_areas").selectAll().orderBy("name", "asc").execute();
		return apiSuccess({ items: await Promise.all(areas.map(async (area) => {
			const widgets = await db.selectFrom("_emdash_widgets").selectAll().$castTo().where("area_id", "=", area.id).orderBy("sort_order", "asc").execute();
			return {
				...area,
				widgets: widgets.map((row) => rowToWidget(row)),
				widgetCount: widgets.length
			};
		})) });
	} catch (error) {
		return handleError(error, "Failed to fetch widget areas", "WIDGET_AREA_LIST_ERROR");
	}
};
const POST = async ({ request, locals }) => {
	const { emdash, user } = locals;
	const db = emdash.db;
	const denied = requirePerm(user, "widgets:manage");
	if (denied) return denied;
	try {
		const body = await parseBody(request, createWidgetAreaBody);
		if (isParseError(body)) return body;
		if (await db.selectFrom("_emdash_widget_areas").select("id").where("name", "=", body.name).executeTakeFirst()) return apiError("CONFLICT", `Widget area with name "${body.name}" already exists`, 409);
		const id = ulid();
		await db.insertInto("_emdash_widget_areas").values({
			id,
			name: body.name,
			label: body.label,
			description: body.description ?? null
		}).execute();
		return apiSuccess(await db.selectFrom("_emdash_widget_areas").selectAll().where("id", "=", id).executeTakeFirstOrThrow(), 201);
	} catch (error) {
		return handleError(error, "Failed to create widget area", "WIDGET_AREA_CREATE_ERROR");
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
