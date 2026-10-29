import { auditStatement } from '../../../_shared/audit'
import { randomBytes, toHex } from '../../../_shared/crypto'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json } from '../../../_shared/http'
import { headerText, storageUsage } from '../../../_shared/media'
import { mediaView, type MediaRef } from '../../../_shared/tours'

const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_BYTES = 15 * 1024 * 1024

export const onRequestGet: PagesFunction<Env, string, AdminData> = async ({ env }) => {
  try {
    const rows = await env.DB.prepare(
      'SELECT id, r2_key, mime, bytes, width, height, alt_en, alt_fr, alt_ru, created_at FROM media ORDER BY created_at DESC LIMIT 500',
    ).all<MediaRef & { bytes: number; mime: string; created_at: number }>()
    return json({
      media: (rows.results ?? []).map((row) => ({ ...mediaView(row), bytes: row.bytes, mime: row.mime, created_at: row.created_at })),
      usage: await storageUsage(env),
    })
  } catch (error) {
    return errorResponse(error)
  }
}

// The admin page resizes and compresses photos before sending them, then streams the bytes here.
export const onRequestPost: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const mime = (request.headers.get('Content-Type') ?? '').split(';')[0].trim()
    const extension = TYPES[mime]
    if (!extension) throw new HttpError(415, 'Only JPG, PNG or WebP photos can be uploaded')
    const length = Number(request.headers.get('Content-Length'))
    if (!Number.isFinite(length) || length <= 0) throw new HttpError(411, 'Photo size is missing')
    if (length > MAX_BYTES) throw new HttpError(413, 'This photo is larger than 15 MB')
    if (!request.body) throw new HttpError(400, 'No photo received')

    const usage = await storageUsage(env)
    if (usage.used + length > usage.quota) throw new HttpError(507, 'Storage is full. Delete some photos first.')

    const width = Number(request.headers.get('X-Image-Width')) || null
    const height = Number(request.headers.get('X-Image-Height')) || null
    const alt = headerText(request.headers.get('X-Image-Alt'), 200)
    const id = toHex(randomBytes(12))
    const key = `uploads/${new Date().toISOString().slice(0, 7)}/${id}.${extension}`

    const stream = new FixedLengthStream(length)
    const piped = request.body.pipeTo(stream.writable)
    const stored = await env.MEDIA.put(key, stream.readable, { httpMetadata: { contentType: mime, cacheControl: 'public, max-age=31536000, immutable' } })
    await piped

    await env.DB.batch([
      env.DB.prepare('INSERT INTO media (id, r2_key, mime, bytes, width, height, alt_en, created_at, created_by) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)')
        .bind(id, key, mime, stored?.size ?? length, width, height, alt, Date.now(), data.admin.id),
      auditStatement(env, { adminId: data.admin.id, action: 'media.upload', entityType: 'media', entityId: id, summary: `${data.admin.name} uploaded a photo`, ip: data.ip }),
    ])
    return json(
      { media: { ...mediaView({ id, r2_key: key, width, height, alt_en: alt, alt_fr: '', alt_ru: '' }), bytes: stored?.size ?? length, mime } },
      { status: 201 },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
