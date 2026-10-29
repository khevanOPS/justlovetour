import { type Env, isLang } from '../_shared/env'
import { errorResponse, json } from '../_shared/http'
import { publicGallery } from '../_shared/public'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const params = new URL(request.url).searchParams
    const lang = isLang(params.get('lang')) ? (params.get('lang') as 'en' | 'fr' | 'ru') : 'en'
    const page = Math.max(1, Math.min(1000, Number(params.get('page')) || 1))
    const perPage = Math.max(1, Math.min(60, Number(params.get('per_page')) || 10))
    return json(await publicGallery(env, lang, page, perPage), { headers: { 'Cache-Control': 'public, max-age=60' } })
  } catch (error) {
    return errorResponse(error)
  }
}
