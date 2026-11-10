import { auditStatement } from '../../../_shared/audit'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../../_shared/http'
import { childStatements, loadTours, validateTour } from '../../../_shared/tours'

export const onRequestGet: PagesFunction<Env, string, AdminData> = async ({ env }) => {
  try {
    return json({ tours: await loadTours(env, { includeArchived: true }) })
  } catch (error) {
    return errorResponse(error)
  }
}

export const onRequestPost: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const input = validateTour(await readJson<Record<string, unknown>>(request))
    const taken = await env.DB.prepare('SELECT id FROM tours WHERE slug = ?1').bind(input.slug).first()
    if (taken) throw new HttpError(409, 'Another tour already uses this web address')

    const now = Date.now()
    const created = await env.DB.prepare(
      `INSERT INTO tours (slug, category, status, sort_order, price_mode, price_adult_eur, price_child_eur, start_time, end_time, cover_media_id, created_at, updated_at, updated_by)
       VALUES (?1, ?2, ?3, (SELECT COALESCE(MAX(sort_order), 0) + 10 FROM tours), ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?10, ?11) RETURNING id`,
    )
      .bind(input.slug, input.category, input.status, input.price_mode, input.price_adult_eur, input.price_child_eur, input.start_time, input.end_time, input.media_ids[0] ?? null, now, data.admin.id)
      .first<{ id: number }>()
    if (!created) throw new HttpError(500, 'Could not create the tour')

    await env.DB.batch([
      ...(await childStatements(env, created.id, input)),
      auditStatement(env, {
        adminId: data.admin.id, action: 'tour.create', entityType: 'tour', entityId: created.id,
        summary: `${data.admin.name} created "${input.translations.en?.name}"`, after: input, ip: data.ip,
      }),
    ])
    const [tour] = await loadTours(env, { id: created.id })
    return json({ tour }, { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
