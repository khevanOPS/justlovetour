import type { Env } from './env'

export async function storageUsage(env: Env) {
  const row = await env.DB.prepare('SELECT COALESCE(SUM(bytes), 0) AS used, COUNT(*) AS files FROM media').first<{ used: number; files: number }>()
  return { used: row?.used ?? 0, files: row?.files ?? 0, quota: Number(env.MEDIA_QUOTA_BYTES ?? 10737418240) }
}

// Alt text arrives URI-encoded in a header so it can carry accents.
export function headerText(value: string | null, max: number): string {
  if (!value) return ''
  try {
    return decodeURIComponent(value).trim().slice(0, max)
  } catch {
    return ''
  }
}
