import { auditStatement } from '../../../_shared/audit'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json, parseId, readJson } from '../../../_shared/http'
import { childStatements, loadTours, validateTour } from '../../../_shared/tours'

const STATUS_WORDS: Record<string, string> = { draft: 'saved as draft', published: 'published', archived: 'archived' }

export const onRequestGet: PagesFunction<Env, 'id', AdminData> = async ({ env, params }) => {
  try {
    const [tour] = await loadTours(env, { id: parseId(params.id) })
    if (!tour) throw new HttpError(404, 'Tour not found')
    return json({ tour })
  } catch (error) {
    return errorResponse(error)
  }
}

export const onRequestPut: PagesFunction<Env, 'id', AdminData> = async ({ request, env, data, params }) => {
  try {
    const id = parseId(params.id)
    const [before] = await loadTours(env, { id })
    if (!before) throw new HttpError(404, 'Tour not found')
    const input = validateTour(await readJson<Record<string, unknown>>(request))
    const taken = await env.DB.prepare('SELECT id FROM tours WHERE slug = ?1 AND id != ?2').bind(input.slug, id).first()
    if (taken) throw new HttpError(409, 'Another tour already uses this web address')

    const name = input.translations.en?.name
    const verb = before.status !== input.status ? STATUS_WORDS[input.status] : 'edited'
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE tours SET slug = ?1, category = ?2, status = ?3, price_mode = ?4, price_adult_eur = ?5, price_child_eur = ?6,
         start_time = ?7, end_time = ?8, cover_media_id = ?9, updated_at = ?10, updated_by = ?11 WHERE id = ?12`,
      ).bind(input.slug, input.category, input.status, input.price_mode, input.price_adult_eur, input.price_child_eur, input.start_time, input.end_time, input.media_ids[0] ?? null, Date.now(), data.admin.id, id),
      ...(await childStatements(env, id, input)),
      auditStatement(env, {
        adminId: data.admin.id, action: 'tour.update', entityType: 'tour', entityId: id,
        summary: `${data.admin.name} ${verb} "${name}"`, before, after: input, ip: data.ip,
      }),
    ])
    const [tour] = await loadTours(env, { id })
    return json({ tour })
  } catch (error) {
    return errorResponse(error)
  }
}

// Tours are archived, never hard-deleted, so the history stays readable and mistakes can be undone.
export const onRequestDelete: PagesFunction<Env, 'id', AdminData> = async ({ env, data, params }) => {
  try {
    const id = parseId(params.id)
    const [before] = await loadTours(env, { id })
    if (!before) throw new HttpError(404, 'Tour not found')
    await env.DB.batch([
      env.DB.prepare("UPDATE tours SET status = 'archived', updated_at = ?1, updated_by = ?2 WHERE id = ?3").bind(Date.now(), data.admin.id, id),
      auditStatement(env, {
        adminId: data.admin.id, action: 'tour.archive', entityType: 'tour', entityId: id,
        summary: `${data.admin.name} removed "${before.translations.en?.name}" from the site`, before, ip: data.ip,
      }),
    ])
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
