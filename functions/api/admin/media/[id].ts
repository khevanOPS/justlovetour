import { auditStatement } from '../../../_shared/audit'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../../_shared/http'

const mediaId = (value: string | string[] | undefined) => {
  const id = Array.isArray(value) ? value[0] : value
  if (!id || !/^[0-9a-f]{24}$/.test(id)) throw new HttpError(404, 'Photo not found')
  return id
}

// Update the photo's description (alt text), which Google and screen readers use.
export const onRequestPatch: PagesFunction<Env, 'id', AdminData> = async ({ request, env, data, params }) => {
  try {
    const id = mediaId(params.id)
    const body = await readJson<{ alt?: Record<string, unknown> }>(request)
    const alt = (lang: string) => (typeof body.alt?.[lang] === 'string' ? (body.alt[lang] as string).trim().slice(0, 200) : '')
    const result = await env.DB.batch([
      env.DB.prepare('UPDATE media SET alt_en = ?1, alt_fr = ?2, alt_ru = ?3 WHERE id = ?4').bind(alt('en'), alt('fr'), alt('ru'), id),
      auditStatement(env, { adminId: data.admin.id, action: 'media.update', entityType: 'media', entityId: id, summary: `${data.admin.name} edited a photo description`, ip: data.ip }),
    ])
    if (!result[0].meta.changes) throw new HttpError(404, 'Photo not found')
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}

export const onRequestDelete: PagesFunction<Env, 'id', AdminData> = async ({ env, data, params }) => {
  try {
    const id = mediaId(params.id)
    const row = await env.DB.prepare('SELECT r2_key FROM media WHERE id = ?1').bind(id).first<{ r2_key: string }>()
    if (!row) throw new HttpError(404, 'Photo not found')
    const use = await env.DB.prepare(
      `SELECT translations.name FROM tour_media JOIN tours ON tours.id = tour_media.tour_id
       JOIN tour_translations translations ON translations.tour_id = tours.id AND translations.lang = 'en'
       WHERE tour_media.media_id = ?1 AND tours.status != 'archived' LIMIT 1`,
    ).bind(id).first<{ name: string }>()
    if (use) throw new HttpError(409, `This photo is used by "${use.name}". Remove it from that tour first.`)

    await env.DB.batch([
      env.DB.prepare('DELETE FROM media WHERE id = ?1').bind(id),
      auditStatement(env, { adminId: data.admin.id, action: 'media.delete', entityType: 'media', entityId: id, summary: `${data.admin.name} deleted a photo`, before: row, ip: data.ip }),
    ])
    await env.MEDIA.delete(row.r2_key)
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
