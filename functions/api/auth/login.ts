import { audit } from '../../_shared/audit'
import { DUMMY_HASH, verifyPassword } from '../../_shared/crypto'
import type { Env } from '../../_shared/env'
import { clientIp, errorResponse, HttpError, json, readJson } from '../../_shared/http'
import { clearTokens, takeToken } from '../../_shared/ratelimit'
import { createSession, sameOrigin, SESSION_TTL_MS, sessionCookie } from '../../_shared/session'

const WINDOW_MS = 15 * 60 * 1000

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!sameOrigin(request)) throw new HttpError(403, 'Not allowed')
    const body = await readJson<{ email?: unknown; password?: unknown }>(request)
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : ''
    const password = typeof body.password === 'string' ? body.password.slice(0, 200) : ''
    if (!email || !password) throw new HttpError(400, 'Enter your email and password')

    const ip = clientIp(request)
    const ipAllowed = await takeToken(env, `login-ip:${ip}`, 20, WINDOW_MS)
    const emailAllowed = await takeToken(env, `login-email:${email}`, 8, WINDOW_MS)
    if (!ipAllowed || !emailAllowed) {
      throw new HttpError(429, 'Too many attempts. Wait 15 minutes and try again.')
    }

    const admin = await env.DB.prepare(
      "SELECT id, name, password_hash FROM admins WHERE email = ?1 AND status = 'active'",
    )
      .bind(email)
      .first<{ id: number; name: string; password_hash: string }>()
    const valid = await verifyPassword(password, admin?.password_hash ?? DUMMY_HASH)
    if (!admin || !valid) {
      await audit(env, { adminId: admin?.id ?? null, action: 'auth.failed', summary: `Failed sign-in for ${email}`, ip })
      throw new HttpError(401, 'Email or password is incorrect')
    }

    const token = await createSession(env, admin.id, request)
    await clearTokens(env, `login-email:${email}`)
    await env.DB.prepare('UPDATE admins SET last_login_at = ?1 WHERE id = ?2').bind(Date.now(), admin.id).run()
    await audit(env, { adminId: admin.id, action: 'auth.login', summary: `${admin.name} signed in`, ip })

    return json(
      { ok: true, name: admin.name },
      { headers: { 'Set-Cookie': sessionCookie(token, SESSION_TTL_MS / 1000) } },
    )
  } catch (error) {
    return errorResponse(error)
  }
}
