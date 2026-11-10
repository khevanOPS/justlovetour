// Every public page goes through here: the app's HTML gets the right title, Google tags,
// structured data and the page text, so search engines see real content without running the app.
import type { Content } from '../src/site/types'
import { parseRoute, pathFor } from '../src/site/routes'
import { pageMeta } from '../src/site/seo'
import type { Env } from './_shared/env'
import { publicContent, publicGallery } from './_shared/public'
import { bodyHtml, DEFAULT_SITE_URL, headTags, scriptJson, type GalleryItem } from './_shared/render'

const EDGE_CACHE_SECONDS = 60

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)

  // Files (and the admin) are served as they are.
  if (/\.[a-z0-9]+$/i.test(url.pathname) || url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return env.ASSETS.fetch(request)

  // One address per page: no trailing slash, except the language home pages (/fr/, /ru/).
  const route = parseRoute(url.pathname, url.search)
  if (route.page !== 'notfound') {
    const wanted = pathFor(route).split('?')[0]
    if (url.pathname !== wanted) return Response.redirect(new URL(wanted + url.search, url).toString(), 301)
  }

  const cache = caches.default
  const cacheKey = new Request(`${url.origin}${url.pathname}${route.page === 'gallery' ? url.search : ''}`, { method: 'GET' })
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const site = (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
  // Preview copies (*.pages.dev) must not compete with the real site on Google.
  const noindex = url.origin !== site && !url.hostname.endsWith('justlovetour.com')

  const [content, shell] = await Promise.all([
    publicContent(env, route.lang) as unknown as Promise<Content>,
    env.ASSETS.fetch(new Request(new URL('/', url), { headers: { Accept: 'text/html' } })),
  ])
  const meta = pageMeta(route, content)
  let gallery: GalleryItem[] = []
  if (route.page === 'gallery') gallery = (await publicGallery(env, route.lang, route.galleryPage ?? 1, 10)).items

  const rewritten = new HTMLRewriter()
    .on('html', { element: (el) => void el.setAttribute('lang', route.lang) })
    .on('title', { element: (el) => void el.setInnerContent(meta.title) })
    .on('meta[name="description"]', { element: (el) => void el.setAttribute('content', meta.description) })
    .on('head', { element: (el) => void el.append(headTags(site, route, meta, content, noindex), { html: true }) })
    .on('div#root', { element: (el) => void el.setInnerContent(bodyHtml(route, meta, content, gallery), { html: true }) })
    // The app starts with this content instead of asking for it again.
    .on('body', { element: (el) => void el.append(`<script>window.__JLT__=${scriptJson(content)}</script>`, { html: true }) })
    .transform(shell)

  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': `public, max-age=0, s-maxage=${EDGE_CACHE_SECONDS}`,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Language': route.lang,
  })
  if (noindex) headers.set('X-Robots-Tag', 'noindex')
  const response = new Response(await rewritten.text(), { status: meta.status, headers })
  if (meta.status === 200) context.waitUntil(cache.put(cacheKey, response.clone()))
  return response
}
