import { auditStatement } from '../../../_shared/audit'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json, parseId, readJson } from '../../../_shared/http'

// Show or hide a gallery photo, or tag it with a tour.
export const onRequestPatch: PagesFunction<Env, 'id', AdminData> = async ({ request, env, data, params }) => {
  try {
    const id = parseId(params.id)
    const body = await readJson<{ status?: unknown; tour_id?: unknown }>(request)
    const status = body.status === 'hidden' ? 'hidden' : 'published'
    const tourId = Number.isInteger(body.tour_id) ? (body.tour_id as number) : null
    const result = await env.DB.batch([
      env.DB.prepare('UPDATE gallery_items SET status = ?1, tour_id = ?2 WHERE id = ?3').bind(status, tourId, id),
      auditStatement(env, { adminId: data.admin.id, action: 'gallery.update', entityType: 'gallery', entityId: id, summary: `${data.admin.name} ${status === 'hidden' ? 'hid' : 'updated'} a gallery photo`, ip: data.ip }),
    ])
    if (!result[0].meta.changes) throw new HttpError(404, 'Photo not found')
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}

// Removes the photo from the gallery only; the file stays in Photos until deleted there.
export const onRequestDelete: PagesFunction<Env, 'id', AdminData> = async ({ env, data, params }) => {
  try {
    const id = parseId(params.id)
    await env.DB.batch([
      env.DB.prepare('DELETE FROM gallery_items WHERE id = ?1').bind(id),
      auditStatement(env, { adminId: data.admin.id, action: 'gallery.remove', entityType: 'gallery', entityId: id, summary: `${data.admin.name} removed a photo from the gallery`, ip: data.ip }),
    ])
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
