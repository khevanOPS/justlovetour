import { auditStatement } from '../../_shared/audit'
import { hashPassword, sha256Hex, verifyPassword } from '../../_shared/crypto'
import type { AdminData, Env } from '../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../_shared/http'
import { takeToken } from '../../_shared/ratelimit'
import { readCookie, SESSION_COOKIE } from '../../_shared/session'

// Lets a signed-in admin replace the password they were given. Other devices are signed out.
export const onRequestPost: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const body = await readJson<{ current?: unknown; next?: unknown }>(request)
    const current = typeof body.current === 'string' ? body.current.slice(0, 200) : ''
    const next = typeof body.next === 'string' ? body.next.slice(0, 200) : ''
    if (!current || !next) throw new HttpError(400, 'Enter your current password and a new one')
    if (next.length < 10) throw new HttpError(400, 'The new password needs at least 10 characters')
    if (next === current) throw new HttpError(400, 'The new password must be different from the current one')
    if (!(await takeToken(env, `password:${data.admin.id}`, 8, 15 * 60 * 1000))) throw new HttpError(429, 'Too many attempts. Wait 15 minutes and try again.')

    const row = await env.DB.prepare('SELECT password_hash FROM admins WHERE id = ?1').bind(data.admin.id).first<{ password_hash: string }>()
    if (!row || !(await verifyPassword(current, row.password_hash))) throw new HttpError(400, 'Your current password is incorrect')

    const token = readCookie(request, SESSION_COOKIE) ?? ''
    await env.DB.batch([
      env.DB.prepare('UPDATE admins SET password_hash = ?1 WHERE id = ?2').bind(await hashPassword(next), data.admin.id),
      env.DB.prepare('DELETE FROM sessions WHERE admin_id = ?1 AND token_hash != ?2').bind(data.admin.id, await sha256Hex(token)),
      auditStatement(env, { adminId: data.admin.id, action: 'auth.password', entityType: 'admin', entityId: String(data.admin.id), summary: `${data.admin.name} changed their password`, ip: data.ip }),
    ])
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
