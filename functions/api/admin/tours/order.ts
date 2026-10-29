import { auditStatement } from '../../../_shared/audit'
import type { AdminData, Env } from '../../../_shared/env'
import { errorResponse, HttpError, json, readJson } from '../../../_shared/http'

export const onRequestPut: PagesFunction<Env, string, AdminData> = async ({ request, env, data }) => {
  try {
    const body = await readJson<{ ids?: unknown }>(request)
    if (!Array.isArray(body.ids) || body.ids.length > 200 || !body.ids.every((id) => Number.isInteger(id))) {
      throw new HttpError(400, 'Invalid order')
    }
    const ids = body.ids as number[]
    await env.DB.batch([
      ...ids.map((id, index) => env.DB.prepare('UPDATE tours SET sort_order = ?1 WHERE id = ?2').bind(index * 10, id)),
      auditStatement(env, { adminId: data.admin.id, action: 'tour.reorder', entityType: 'tour', summary: `${data.admin.name} changed the tour order`, after: ids, ip: data.ip }),
    ])
    return json({ ok: true })
  } catch (error) {
    return errorResponse(error)
  }
}
