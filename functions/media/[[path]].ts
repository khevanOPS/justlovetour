import type { Env } from '../_shared/env'

const TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }

// Serves photos from R2. Keys are never reused, so responses can be cached for a year.
export const onRequestGet: PagesFunction<Env, 'path'> = async ({ request, env, params }) => {
  const key = (Array.isArray(params.path) ? params.path : [params.path]).join('/')
  if (!key || key.includes('..') || !/^(seed|uploads)\//.test(key)) return new Response('Not found', { status: 404 })

  const object = await env.MEDIA.get(key, { onlyIf: request.headers, range: request.headers })
  if (!object) return new Response('Not found', { status: 404 })

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
