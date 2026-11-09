import type { Env } from '../_shared/env'
import seedMedia from '../../scripts/seed-media.json'

// Seed photos also ship as static files, so a seed key that is not in R2 yet
// (for example on a preview before the upload script has run) still shows.
const SEED_FILES = new Map((seedMedia as { file: string; key: string }[]).map(({ file, key }) => [key, file.replace(/^public/, '')]))

const TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }

// Serves photos from R2. Keys are never reused, so responses can be cached for a year.
export const onRequestGet: PagesFunction<Env, 'path'> = async ({ request, env, params }) => {
  const key = (Array.isArray(params.path) ? params.path : [params.path]).join('/')
  if (!key || key.includes('..') || !/^(seed|uploads)\//.test(key)) return new Response('Not found', { status: 404 })

  const object = await env.MEDIA.get(key, { onlyIf: request.headers, range: request.headers })
  if (!object) {
    const file = SEED_FILES.get(key)
    if (!file) return new Response('Not found', { status: 404 })
    const url = new URL(request.url)
    url.pathname = file.split('/').map(encodeURIComponent).join('/')
    const res = await env.ASSETS.fetch(new Request(url, { headers: request.headers }))
    if (!res.ok) return res
    const out = new Response(res.body, res)
    out.headers.set('Cache-Control', 'public, max-age=86400')
    return out
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('ETag', object.httpEtag)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('X-Content-Type-Options', 'nosniff')
  if (!('body' in object) || !object.body) return new Response(null, { status: 304, headers })
  if (!headers.has('Content-Type')) headers.set('Content-Type', TYPES[key.split('.').pop() ?? ''] ?? 'application/octet-stream')
  if (request.headers.has('Range') && object.range && 'offset' in object.range) {
    const { offset = 0, length = object.size - offset } = object.range as { offset?: number; length?: number }
    headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${object.size}`)
    return new Response(object.body, { status: 206, headers })
  }
  return new Response(object.body, { headers })
}
