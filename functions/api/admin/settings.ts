import { auditStatement } from '../../_shared/audit'
import { SETTINGS } from '../../_shared/content'
import type { AdminData, Env } from '../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../_shared/http'

export const onRequestGet: PagesFunction<Env, string, AdminData> = async ({ env }) => {
  try {
    const rows = await env.DB.prepare('SELECT key, value FROM settings').all<{ key: string; value: string }>()
    return json({ settings: Object.fromEntries((rows.results ?? []).map((row) => [row.key, JSON.parse(row.value)])) })
  } catch (error) {
    return errorResponse(error)
  }
}

export const onRequestPut: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const body = await readJson<{ key?: unknown; value?: unknown }>(request)
    const key = typeof body.key === 'string' ? body.key : ''
    if (!(key in SETTINGS)) throw new HttpError(404, 'Unknown setting')
    const value = SETTINGS[key](body.value)
    const before = await env.DB.prepare('SELECT value FROM settings WHERE key = ?1').bind(key).first<{ value: string }>()
    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO settings (key, value, updated_at, updated_by) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at, updated_by = excluded.updated_by`,
      ).bind(key, JSON.stringify(value), Date.now(), data.admin.id),
      auditStatement(env, {
        adminId: data.admin.id, action: 'settings.update', entityType: 'settings', entityId: key,
        summary: `${data.admin.name} changed the ${{ contact: 'contact details', socials: 'social links', currency: 'exchange rates' }[key] ?? key}`, before: before ? JSON.parse(before.value) : null, after: value, ip: data.ip,
      }),
    ])
    return json({ value })
  } catch (error) {
    return errorResponse(error)
  }
}
