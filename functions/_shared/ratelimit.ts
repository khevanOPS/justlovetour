import type { Env } from './env'

// Fixed-window counter in D1. Returns false once `limit` hits are used up in the window.
export async function takeToken(env: Env, key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now()
  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (key, window_start, count) VALUES (?1, ?2, 1)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN rate_limits.window_start <= ?2 - ?3 THEN 1 ELSE rate_limits.count + 1 END,
       window_start = CASE WHEN rate_limits.window_start <= ?2 - ?3 THEN ?2 ELSE rate_limits.window_start END
     RETURNING count`,
  )
    .bind(key, now, windowMs)
    .first<{ count: number }>()
  return (row?.count ?? 1) <= limit
}

export async function clearTokens(env: Env, key: string): Promise<void> {
  await env.DB.prepare('DELETE FROM rate_limits WHERE key = ?1').bind(key).run()
}
