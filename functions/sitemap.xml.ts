// Every page in every language, with its translations linked, for Google Search Console.
import { pathFor, SITE_PAGES, type Lang } from '../src/site/routes'
import type { Env } from './_shared/env'
import { DEFAULT_SITE_URL, esc } from './_shared/render'
import { loadTours } from './_shared/tours'

const LANGS: Lang[] = ['en', 'fr', 'ru']

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const site = (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')
  const tours = await loadTours(env, { publishedOnly: true })
  const day = (ms: number) => new Date(ms).toISOString().slice(0, 10)
  const latest = tours.reduce((max, tour) => Math.max(max, tour.updated_at), 0)

  const entry = (path: (lang: Lang) => string, langs: Lang[], lastmod?: number) =>
    langs
      .map((lang) => {
        const links = langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(site + path(l))}"/>`)
        if (langs.includes('en')) links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${esc(site + path('en'))}"/>`)
        return `<url><loc>${esc(site + path(lang))}</loc>${lastmod ? `<lastmod>${day(lastmod)}</lastmod>` : ''}${links.join('')}</url>`
      })
      .join('\n')

  const urls = [
    ...SITE_PAGES.map((page) => entry((lang) => pathFor({ lang, page }), LANGS, page === 'home' && latest ? latest : undefined)),
    // A tour is listed in the languages it has been translated into (English always).
    ...tours.map((tour) => {
      const langs = LANGS.filter((lang) => lang === 'en' || tour.translations[lang])
      return entry((lang) => pathFor({ lang, page: 'tour', slug: tour.slug }), langs, tour.updated_at)
    }),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=3600' } })
}
