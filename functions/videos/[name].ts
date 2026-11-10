import type { Env } from '../_shared/env'

// Serves the background videos with byte-range support. Safari (Mac and iPhone) will only play
// an mp4 when the server answers range requests, and the plain asset server does not always do that.
export const onRequestGet: PagesFunction<Env, 'name'> = async ({ request, env }) => {
  const asset = await env.ASSETS.fetch(new Request(new URL(request.url).toString()))
  if (!asset.ok || asset.status === 206) return asset

  const headers = new Headers(asset.headers)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', 'public, max-age=604800')
  const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') ?? '')
  if (!match) return new Response(asset.body, { headers })

  const data = await asset.arrayBuffer()
  const size = data.byteLength
  let start = match[1] ? Number(match[1]) : size - Number(match[2])
  let end = match[1] && match[2] ? Number(match[2]) : size - 1
  start = Math.max(0, start)
  end = Math.min(end, size - 1)
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })

  headers.set('Content-Range', `bytes ${start}-${end}/${size}`)
  headers.set('Content-Length', String(end - start + 1))
  return new Response(data.slice(start, end + 1), { status: 206, headers })
}
