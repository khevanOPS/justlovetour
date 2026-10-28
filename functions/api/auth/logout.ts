import type { Env } from '../../_shared/env'
import { errorResponse, HttpError, json } from '../../_shared/http'
import { destroySession, sameOrigin, sessionCookie } from '../../_shared/session'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!sameOrigin(request)) throw new HttpError(403, 'Not allowed')
    await destroySession(env, request)
    return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie('', 0) } })
  } catch (error) {
    return errorResponse(error)
  }
}
