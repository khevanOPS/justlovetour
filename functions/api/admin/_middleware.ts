import type { AdminData, Env } from '../../_shared/env'
import { clientIp, errorResponse, HttpError } from '../../_shared/http'
import { sameOrigin, sessionAdmin } from '../../_shared/session'

// Every /api/admin route needs a live session; writes must also come from this site.
export const onRequest: PagesFunction<Env, string, AdminData> = async (context) => {
  try {
    const { request, env, data } = context
    const admin = await sessionAdmin(env, request)
    if (!admin) throw new HttpError(401, 'Your session has ended. Please sign in again.')
    if (request.method !== 'GET' && request.method !== 'HEAD' && !sameOrigin(request)) {
      throw new HttpError(403, 'Not allowed')
    }
    data.admin = admin
    data.ip = clientIp(request)
    const response = await context.next()
    return response
  } catch (error) {
    return errorResponse(error)
  }
}
