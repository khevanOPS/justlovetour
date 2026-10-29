import type { Env } from './env'

interface AuditEntry {
  adminId: number | null
  action: string
  entityType?: string
  entityId?: string | number
  summary: string
  before?: unknown
  after?: unknown
  ip?: string
}

export function auditStatement(env: Env, entry: AuditEntry): D1PreparedStatement {
  return env.DB.prepare(
    `INSERT INTO audit_log (admin_id, action, entity_type, entity_id, summary, before_json, after_json, ip, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
  ).bind(
    entry.adminId,
    entry.action,
    entry.entityType ?? null,
    entry.entityId === undefined ? null : String(entry.entityId),
    entry.summary,
    entry.before === undefined ? null : JSON.stringify(entry.before),
    entry.after === undefined ? null : JSON.stringify(entry.after),
    entry.ip ?? null,
    Date.now(),
  )
}

export async function audit(env: Env, entry: AuditEntry): Promise<void> {
  await auditStatement(env, entry).run()
}
