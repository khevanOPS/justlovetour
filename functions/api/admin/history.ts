import type { AdminData, Env } from '../../_shared/env'
import { errorResponse, json } from '../../_shared/http'

const PAGE = 50

export const onRequestGet: PagesFunction<Env, string, AdminData> = async ({ request, env }) => {
  try {
    const before = Number(new URL(request.url).searchParams.get('before')) || Number.MAX_SAFE_INTEGER
    const rows = await env.DB.prepare(
      `SELECT audit_log.id, audit_log.action, audit_log.entity_type, audit_log.entity_id, audit_log.summary,
              audit_log.created_at, admins.name AS admin_name
       FROM audit_log LEFT JOIN admins ON admins.id = audit_log.admin_id
       WHERE audit_log.id < ?1 ORDER BY audit_log.id DESC LIMIT ?2`,
    ).bind(before, PAGE + 1).all<{ id: number }>()
    const entries = rows.results ?? []
    return json({ entries: entries.slice(0, PAGE), next: entries.length > PAGE ? entries[PAGE - 1].id : null })
  } catch (error) {
    return errorResponse(error)
  }
}
