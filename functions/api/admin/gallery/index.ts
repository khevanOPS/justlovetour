import { auditStatement } from '../../../_shared/audit'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../../_shared/http'
import { mediaView, type MediaRef } from '../../../_shared/tours'

export const onRequestGet: PagesFunction<Env, string, AdminData> = async ({ env }) => {
  try {
    const rows = await env.DB.prepare(
      `SELECT gallery_items.id AS item_id, gallery_items.tour_id, gallery_items.status, gallery_items.sort_order,
              media.id, media.r2_key, media.width, media.height, media.alt_en, media.alt_fr, media.alt_ru
       FROM gallery_items JOIN media ON media.id = gallery_items.media_id ORDER BY gallery_items.sort_order, gallery_items.id`,
    ).all<MediaRef & { item_id: number; tour_id: number | null; status: string; sort_order: number }>()
    return json({
      items: (rows.results ?? []).map((row) => ({ id: row.item_id, tour_id: row.tour_id, status: row.status, media: mediaView(row) })),
    })
  } catch (error) {
    return errorResponse(error)
  }
}

// Add uploaded photos to the gallery, at the top.
export const onRequestPost: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const body = await readJson<{ media_ids?: unknown; tour_id?: unknown }>(request)
    const ids = Array.isArray(body.media_ids) ? body.media_ids.filter((id): id is string => typeof id === 'string' && /^[0-9a-f]{24}$/.test(id)).slice(0, 50) : []
    if (!ids.length) throw new HttpError(400, 'No photos selected')
    const tourId = Number.isInteger(body.tour_id) ? (body.tour_id as number) : null
    const top = await env.DB.prepare('SELECT COALESCE(MIN(sort_order), 0) AS min FROM gallery_items').first<{ min: number }>()
    const start = (top?.min ?? 0) - ids.length * 10
    await env.DB.batch([
      ...ids.map((id, index) =>
        env.DB.prepare('INSERT OR IGNORE INTO gallery_items (media_id, tour_id, sort_order, created_at) VALUES (?1, ?2, ?3, ?4)').bind(id, tourId, start + index * 10, Date.now()),
      ),
      auditStatement(env, { adminId: data.admin.id, action: 'gallery.add', entityType: 'gallery', summary: `${data.admin.name} added ${ids.length} photo${ids.length > 1 ? 's' : ''} to the gallery`, after: ids, ip: data.ip }),
    ])
    return json({ ok: true }, { status: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}

// Save the gallery order in one go.
export const onRequestPut: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const body = await readJson<{ ids?: unknown }>(request)
    if (!Array.isArray(body.ids) || body.ids.length > 2000 || !body.ids.every((id) => Number.isInteger(id))) throw new HttpError(400, 'Invalid order')
    await env.DB.batch([
      ...(body.ids as number[]).map((id, index) => env.DB.prepare('UPDATE gallery_items SET sort_order = ?1 WHERE id = ?2').bind(index * 10, id)),
      auditStatement(env, { adminId: data.admin.id, action: 'gallery.reorder', entityType: 'gallery', summary: `${data.admin.name} changed the gallery order`, ip: data.ip }),
    ])
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
