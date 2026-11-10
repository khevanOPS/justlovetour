import { randomBytes, sha256Hex, toHex } from './crypto'
import type { Admin, Env } from './env'

export const SESSION_COOKIE = '__Host-jlt_admin'
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return rest.join('=')
  }
  return null
}

export function sessionCookie(token: string, maxAgeSeconds: number): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`
}

export async function createSession(env: Env, adminId: number, request: Request): Promise<string> {
  const token = toHex(randomBytes(32))
  const now = Date.now()
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?1').bind(now),
    env.DB.prepare(
      'INSERT INTO sessions (admin_id, token_hash, created_at, expires_at, ip, user_agent) VALUES (?1, ?2, ?3, ?4, ?5, ?6)',
    ).bind(
      adminId,
      await sha256Hex(token),
      now,
      now + SESSION_TTL_MS,
      request.headers.get('CF-Connecting-IP'),
      (request.headers.get('User-Agent') ?? '').slice(0, 200),
    ),
  ])
  return token
}

export async function sessionAdmin(env: Env, request: Request): Promise<Admin | null> {
  const token = readCookie(request, SESSION_COOKIE)
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null
  return env.DB.prepare(
    `SELECT admins.id, admins.email, admins.name FROM sessions
     JOIN admins ON admins.id = sessions.admin_id
     WHERE sessions.token_hash = ?1 AND sessions.expires_at > ?2 AND admins.status = 'active'`,
  )
    .bind(await sha256Hex(token), Date.now())
    .first<Admin>()
}

export async function destroySession(env: Env, request: Request): Promise<void> {
  const token = readCookie(request, SESSION_COOKIE)
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return
  await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1').bind(await sha256Hex(token)).run()
}

// Mutating admin requests must come from this site's own pages.
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin')
  if (!origin) return false
  return origin === new URL(request.url).origin
}
