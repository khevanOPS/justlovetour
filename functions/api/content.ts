import { type Env, isLang } from '../_shared/env'
import { errorResponse, json } from '../_shared/http'
import { publicContent } from '../_shared/public'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const requested = new URL(request.url).searchParams.get('lang')
    const lang = isLang(requested) ? requested : 'en'
    return json(await publicContent(env, lang), { headers: { 'Cache-Control': 'public, max-age=60' } })
  } catch (error) {
    return errorResponse(error)
  }
}
