import { auditStatement } from '../../_shared/audit'
import type { AdminData, Env } from '../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../_shared/http'
import { slugify } from '../../_shared/tours'

interface Row { id: number; slug: string; name_en: string; name_fr: string; name_ru: string; media_id: string | null; status: string; sort_order: number; r2_key: string | null }

export const onRequestGet: PagesFunction<Env, string, AdminData> = async ({ env }) => {
  try {
    const rows = await env.DB.prepare(
      `SELECT transfer_destinations.*, media.r2_key FROM transfer_destinations
       LEFT JOIN media ON media.id = transfer_destinations.media_id ORDER BY sort_order, id`,
    ).all<Row>()
    return json({ destinations: (rows.results ?? []).map((row) => ({ ...row, image: row.r2_key ? `/media/${row.r2_key}` : null })) })
  } catch (error) {
    return errorResponse(error)
  }
}

// The whole list is saved at once: names, photo, shown/hidden and order.
export const onRequestPut: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const body = await readJson<{ destinations?: unknown }>(request)
    if (!Array.isArray(body.destinations) || body.destinations.length > 40) throw new HttpError(400, 'Invalid list')
    const clean = body.destinations.map((raw, index) => {
      const d = (raw ?? {}) as Record<string, unknown>
      const name = (field: string, label: string) => {
        const value = typeof d[field] === 'string' ? (d[field] as string).trim() : ''
        if (value.length > 120) throw new HttpError(400, `${label} is too long`)
        return value
      }
      const name_en = name('name_en', `Destination ${index + 1} name`)
      if (!name_en) throw new HttpError(400, `Destination ${index + 1} needs an English name`)
      const media_id = typeof d.media_id === 'string' && /^[0-9a-f]{24}$/.test(d.media_id) ? d.media_id : null
      return {
        id: Number.isInteger(d.id) ? (d.id as number) : null,
        slug: slugify(name_en),
        name_en, name_fr: name('name_fr', 'French name'), name_ru: name('name_ru', 'Russian name'),
        media_id, status: d.status === 'hidden' ? 'hidden' : 'published', sort_order: index * 10,
      }
    })
    const keep = clean.filter((d) => d.id !== null).map((d) => d.id as number)
    const statements = [
      keep.length
        ? env.DB.prepare(`DELETE FROM transfer_destinations WHERE id NOT IN (${keep.map((_, i) => `?${i + 1}`).join(', ')})`).bind(...keep)
        : env.DB.prepare('DELETE FROM transfer_destinations'),
      ...clean.map((d) =>
        d.id !== null
          ? env.DB.prepare('UPDATE transfer_destinations SET slug = ?1, name_en = ?2, name_fr = ?3, name_ru = ?4, media_id = ?5, status = ?6, sort_order = ?7 WHERE id = ?8')
              .bind(d.slug, d.name_en, d.name_fr, d.name_ru, d.media_id, d.status, d.sort_order, d.id)
          : env.DB.prepare('INSERT INTO transfer_destinations (slug, name_en, name_fr, name_ru, media_id, status, sort_order) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)')
              .bind(d.slug, d.name_en, d.name_fr, d.name_ru, d.media_id, d.status, d.sort_order),
      ),
      auditStatement(env, { adminId: data.admin.id, action: 'destinations.update', entityType: 'destinations', summary: `${data.admin.name} updated the transfer destinations`, after: clean, ip: data.ip }),
    ]
    if (new Set(clean.map((d) => d.slug)).size !== clean.length) throw new HttpError(400, 'Two destinations have the same name')
    await env.DB.batch(statements)
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
