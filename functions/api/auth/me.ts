import type { Env } from '../../_shared/env'
import { errorResponse, json } from '../../_shared/http'
import { sessionAdmin } from '../../_shared/session'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const admin = await sessionAdmin(env, request)
    if (!admin) return json({ error: 'Signed out' }, { status: 401 })
    return json({ admin })
  } catch (error) {
    return errorResponse(error)
  }
}
