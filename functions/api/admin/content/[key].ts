import { auditStatement } from '../../../_shared/audit'
import { CONTENT_BLOCKS } from '../../../_shared/content'
import { type AdminData, type Env, isLang } from '../../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../../_shared/http'

const LABELS: Record<string, string> = { hero: 'the top of the home page', why: 'Why Just Love Tour', about: 'the About page', faq: 'the FAQ' }

const blockKey = (value: string | string[] | undefined) => {
  const key = Array.isArray(value) ? value[0] : value
  if (!key || !(key in CONTENT_BLOCKS)) throw new HttpError(404, 'Unknown section')
  return key
}

export const onRequestGet: PagesFunction<Env, 'key', AdminData> = async ({ env, params }) => {
  try {
    const key = blockKey(params.key)
    const rows = await env.DB.prepare('SELECT lang, value, updated_at FROM content_blocks WHERE key = ?1').bind(key).all<{ lang: string; value: string; updated_at: number }>()
    return json({ key, values: Object.fromEntries((rows.results ?? []).map((row) => [row.lang, JSON.parse(row.value)])) })
  } catch (error) {
    return errorResponse(error)
  }
}

export const onRequestPut: PagesFunction<Env, 'key', AdminData> = async ({ request, env, data, params }) => {
  try {
    const key = blockKey(params.key)
    const body = await readJson<{ lang?: unknown; value?: unknown }>(request)
    if (!isLang(body.lang)) throw new HttpError(400, 'Choose a language')
    const value = CONTENT_BLOCKS[key](body.value)
    const before = await env.DB.prepare('SELECT value FROM content_blocks WHERE key = ?1 AND lang = ?2').bind(key, body.lang).first<{ value: string }>()
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO content_blocks (key, lang, value, updated_at, updated_by) VALUES (?1, ?2, ?3, ?4, ?5)
         ON CONFLICT(key, lang) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
      ).bind(key, body.lang, JSON.stringify(value), Date.now(), data.admin.id),
      auditStatement(env, {
        adminId: data.admin.id, action: 'content.update', entityType: 'content', entityId: `${key}:${body.lang}`,
        summary: `${data.admin.name} edited ${LABELS[key] ?? key} (${body.lang.toUpperCase()})`,
        before: before ? JSON.parse(before.value) : null, after: value, ip: data.ip,
      }),
    ])
    return json({ value })
  } catch (error) {
    return errorResponse(error)
  }
}
