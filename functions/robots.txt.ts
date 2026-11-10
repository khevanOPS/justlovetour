import type { Env } from './_shared/env'
import { DEFAULT_SITE_URL } from './_shared/render'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const site = (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
  const host = new URL(request.url).hostname
  // Preview copies on *.pages.dev stay out of Google.
  const body = host.endsWith('justlovetour.com')
    ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n'
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
