// Builds what Google reads for each page: meta tags, hreflang, structured data and the page text as plain HTML.
// The browser app replaces the HTML as soon as it starts, so this stays simple on purpose.
import type { Content, Tour } from '../../src/site/types'
import { STRINGS, type Lang } from '../../src/site/i18n'
import { pathFor, SITE_PAGES, type Route } from '../../src/site/routes'
import type { PageMeta } from '../../src/site/seo'

export const DEFAULT_SITE_URL = 'https://www.justlovetour.com'

export const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// JSON inside a <script> tag must not be able to close the tag.
export const scriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16)}`)

const OG_LOCALE: Record<Lang, string> = { en: 'en_GB', fr: 'fr_FR', ru: 'ru_RU' }
const euros = (cents: number) => (cents / 100).toFixed(2)

export function headTags(site: string, route: Route, meta: PageMeta, content: Content, noindex: boolean): string {
  const canonical = site + pathFor({ ...route, lang: meta.canonicalLang })
  const image = meta.tour?.images[0]?.url ? site + meta.tour.images[0].url : `${site}/og-image.jpg`
  const tags = [
    `<link rel="canonical" href="${esc(canonical)}">`,
    ...meta.alternates.map((lang) => `<link rel="alternate" hreflang="${lang}" href="${esc(site + pathFor({ ...route, lang }))}">`),
    meta.alternates.includes('en') ? `<link rel="alternate" hreflang="x-default" href="${esc(site + pathFor({ ...route, lang: 'en' }))}">` : '',
    noindex || meta.status === 404 ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">',
    `<meta property="og:type" content="${meta.tour ? 'product' : 'website'}">`,
    `<meta property="og:site_name" content="Just Love Tour">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:locale" content="${OG_LOCALE[route.lang]}">`,
    ...meta.alternates.filter((lang) => lang !== route.lang).map((lang) => `<meta property="og:locale:alternate" content="${OG_LOCALE[lang]}">`),
    '<meta name="twitter:card" content="summary_large_image">',
  ]
  // Start downloading the first photo early: it is the largest thing on screen.
  const lcp = meta.tour?.images[0] ?? (route.page === 'home' ? content.tours.find((tour) => tour.images[0])?.images[0] : undefined)
  if (lcp) tags.push(`<link rel="preload" as="image" href="${esc(lcp.url)}" fetchpriority="high">`)
  for (const data of structuredData(site, route, meta, content)) tags.push(`<script type="application/ld+json">${scriptJson(data)}</script>`)
  return tags.filter(Boolean).join('\n')
}

function business(site: string, content: Content) {
  const contact = content.settings.contact
  const socials = content.settings.socials
  return {
    '@type': 'TravelAgency',
    '@id': `${site}/#business`,
    name: 'Just Love Tour',
    url: `${site}/`,
    logo: `${site}/logo-512.jpg`,
    image: `${site}/og-image.jpg`,
    telephone: contact?.whatsapp || undefined,
    email: contact?.email || undefined,
    address: { '@type': 'PostalAddress', streetAddress: contact?.location || undefined, addressCountry: 'MU' },
    areaServed: { '@type': 'Country', name: 'Mauritius' },
    sameAs: [socials?.instagram, socials?.facebook, socials?.youtube].filter(Boolean),
  }
}

function structuredData(site: string, route: Route, meta: PageMeta, content: Content): object[] {
  if (meta.status === 404) return []
  const t = STRINGS[route.lang]
  const home = `${site}${pathFor({ lang: route.lang, page: 'home' })}`
  if (route.page === 'home') {
    const faq = (content.blocks.faq ?? []).filter((item) => item.q && item.a)
    const graph: object[] = [
      business(site, content),
      { '@type': 'WebSite', '@id': `${site}/#website`, name: 'Just Love Tour', url: `${site}/`, inLanguage: ['en', 'fr', 'ru'], publisher: { '@id': `${site}/#business` } },
      {
        '@type': 'ItemList',
        name: t.experiencesTitle,
        itemListElement: content.tours.map((tour, index) => ({ '@type': 'ListItem', position: index + 1, url: site + pathFor({ lang: route.lang, page: 'tour', slug: tour.slug }), name: tour.name })),
      },
    ]
    if (faq.length) graph.push({ '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) })
    return [{ '@context': 'https://schema.org', '@graph': graph }]
  }
  const pageName = meta.tour?.name ?? meta.title.split(' | ')[0]
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.nav.home, item: home },
      { '@type': 'ListItem', position: 2, name: pageName, item: site + meta.path },
    ],
  }
  if (meta.tour) return [{ '@context': 'https://schema.org', '@graph': [tourData(site, route.lang, meta.tour), breadcrumb, business(site, content)] }]
  return [{ '@context': 'https://schema.org', '@graph': [breadcrumb, business(site, content)] }]
}

function tourData(site: string, lang: Lang, tour: Tour) {
  const url = site + pathFor({ lang, page: 'tour', slug: tour.slug })
  return {
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: tour.name,
    description: tour.meta_description || tour.summary || tour.description || undefined,
    url,
    image: tour.images.map((image) => site + image.url),
    inLanguage: lang,
    provider: { '@id': `${site}/#business` },
    touristType: tour.category === 'adventure' ? 'Adventure' : undefined,
    itinerary: tour.stops.length
      ? { '@type': 'ItemList', itemListElement: tour.stops.map((stop, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'TouristAttraction', name: stop } })) }
      : undefined,
    offers:
      tour.price_mode === 'fixed' && tour.price_adult_eur !== null
        ? [
            { '@type': 'Offer', name: STRINGS.en.adults, price: euros(tour.price_adult_eur), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url },
            ...(tour.price_child_eur !== null ? [{ '@type': 'Offer', name: STRINGS.en.children, price: euros(tour.price_child_eur), priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url }] : []),
          ]
        : undefined,
  }
}

// ---- Page text as plain HTML. Classes match the app's header and first band so the switch is not noticeable.

const link = (href: string, text: string, cls = '') => `<a href="${esc(href)}"${cls ? ` class="${cls}"` : ''}>${esc(text)}</a>`
const list = (items: string[]) => (items.length ? `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>` : '')

function priceText(tour: Tour, lang: Lang) {
  const t = STRINGS[lang]
  if (tour.price_mode !== 'fixed' || tour.price_adult_eur === null) return t.onRequest
  return `€${tour.price_adult_eur / 100} ${t.perAdultLong}${tour.price_child_eur !== null ? ` · €${tour.price_child_eur / 100} ${t.perChild}` : ''}`
}

export interface GalleryItem {
  url: string
  alt: string
}

export function bodyHtml(route: Route, meta: PageMeta, content: Content, gallery: GalleryItem[]): string {
  const { lang } = route
  const t = STRINGS[lang]
  const p = (page: Route['page'], slug?: string) => pathFor({ lang, page, slug })
  const navNames: Record<(typeof SITE_PAGES)[number], string> = { home: t.nav.home, planner: t.nav.planner, transfers: t.nav.transfers, gallery: t.nav.gallery, about: t.nav.about, contact: t.nav.contact }
  const header = `<header class="sticky top-0 z-40 bg-[#134e4a] text-white"><div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">${link(p('home'), '♥ Just Love Tour', 'flex h-11 items-center gap-2 text-[17px] font-semibold text-white')}<nav aria-label="Main" class="hidden gap-3 text-sm lg:flex">${SITE_PAGES.map((page) => link(p(page), navNames[page])).join('')}</nav><nav aria-label="Language" class="flex gap-2 text-sm font-semibold">${(['en', 'fr', 'ru'] as Lang[]).map((l) => `<a href="${esc(pathFor({ ...route, lang: l, page: route.page === 'notfound' ? 'home' : route.page }))}" hreflang="${l}">${l.toUpperCase()}</a>`).join('')}</nav></div></header>`
  const band = (title: string, intro = '', eyebrow = '') =>
    `<div class="bg-[#134e4a] px-4 pb-10 pt-6 text-white md:pb-14 md:pt-10"><div class="mx-auto max-w-6xl">${eyebrow ? `<p class="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">${esc(eyebrow)}</p>` : ''}<h1 class="font-serif text-[34px] font-bold leading-tight md:text-5xl">${esc(title)}</h1>${intro ? `<p class="mt-2 max-w-xl text-[15px] text-white/85 md:text-lg">${esc(intro)}</p>` : ''}</div></div>`
  const tourCard = (tour: Tour) =>
    `<li><article><h2>${link(p('tour', tour.slug), tour.name)}</h2><p>${esc(t.categoryOne[tour.category])} · ${esc(priceText(tour, lang))}</p>${tour.summary ? `<p>${esc(tour.summary)}</p>` : ''}${tour.images[0] ? `<img src="${esc(tour.images[0].url)}" alt="${esc(tour.images[0].alt)}" width="${tour.images[0].width ?? ''}" height="${tour.images[0].height ?? ''}" loading="lazy">` : ''}</article></li>`

  let main = ''
  if (meta.status === 404) {
    main = band(t.notFoundTitle, t.notFoundText) + `<p class="px-4 py-6">${link(p('home'), t.goHome)}</p>`
  } else if (route.page === 'home' || (route.page === 'tour' && !meta.tour)) {
    const hero = content.blocks.hero
    const faq = (content.blocks.faq ?? []).filter((item) => item.q && item.a)
    main =
      band(hero?.title || t.heroTitle, hero?.travellers ? `${t.travellers(hero.travellers)} Google` : '', hero?.eyebrow || t.heroEyebrow) +
      `<div class="mx-auto max-w-6xl px-4 py-8"><section id="activities"><h2>${esc(t.experiencesTitle)}</h2><ul>${content.tours.map(tourCard).join('')}</ul></section>` +
      (content.blocks.why?.length ? `<section><h2>${esc(t.whyEyebrow)}</h2><ul>${content.blocks.why.map((w) => `<li><strong>${esc(w.title)}</strong> ${esc(w.text)}</li>`).join('')}</ul></section>` : '') +
      `<section><h2>${esc(t.planEyebrow)}</h2><p>${link(p('planner'), t.planTrip)} · ${link(p('transfers'), t.transferCardTitle)}</p></section>` +
      (faq.length ? `<section><h2>${esc(t.faqTitle)}</h2>${faq.map((item) => `<h3>${esc(item.q)}</h3><p>${esc(item.a)}</p>`).join('')}</section>` : '') +
      `</div>`
  } else if (meta.tour) {
    const tour = meta.tour
    const timing = tour.start_time && tour.end_time ? `${t.fullDay} · ${tour.start_time}–${tour.end_time}` : ''
    main =
      band(tour.name, [t.categoryOne[tour.category], timing].filter(Boolean).join(' · ')) +
      `<article class="mx-auto max-w-6xl px-4 py-8"><p><strong>${esc(priceText(tour, lang))}</strong></p>${tour.summary ? `<p>${esc(tour.summary)}</p>` : ''}` +
      (tour.stops.length ? `<h2>${esc(t.theStops)}</h2><ol>${tour.stops.map((stop) => `<li>${esc(stop)}</li>`).join('')}</ol>` : '') +
      (tour.included.length ? `<h2>${esc(t.included)}</h2>${list(tour.included)}` : '') +
      (tour.extras.length ? `<h2>${esc(t.extras)}</h2>${list(tour.extras)}` : '') +
      (tour.description ? `<h2>${esc(t.aboutTour)}</h2>${tour.description.split(/\n+/).map((para) => `<p>${esc(para)}</p>`).join('')}` : '') +
      tour.images.map((image) => `<img src="${esc(image.url)}" alt="${esc(image.alt)}" width="${image.width ?? ''}" height="${image.height ?? ''}" loading="lazy">`).join('') +
      `<p>${link(p('home'), t.backToTours)}</p></article>`
  } else if (route.page === 'planner') {
    main = band(t.plannerTitle, t.plannerIntro) + `<div class="mx-auto max-w-6xl px-4 py-8"><ul>${content.tours.map(tourCard).join('')}</ul></div>`
  } else if (route.page === 'transfers') {
    main =
      band(t.transfersTitle, t.transfersIntro) +
      `<div class="mx-auto max-w-6xl px-4 py-8"><h2>${esc(t.popularDestinations)}</h2>${list(content.destinations.map((d) => d.name))}<h2>${esc(t.interHotelTitle)}</h2><p>${esc(t.interHotelText)}</p></div>`
  } else if (route.page === 'gallery') {
    main =
      band(t.galleryPageTitle, t.galleryIntro) +
      `<div class="mx-auto max-w-6xl px-4 py-8"><ul>${gallery.map((item) => `<li><img src="${esc(item.url)}" alt="${esc(item.alt)}" loading="lazy"></li>`).join('')}</ul></div>`
  } else if (route.page === 'about') {
    const about = content.blocks.about
    main = band(t.aboutTitle) + `<div class="mx-auto max-w-6xl px-4 py-8">${about?.title ? `<h2>${esc(about.title)}</h2>` : ''}${(about?.paragraphs ?? []).map((para) => `<p>${esc(para)}</p>`).join('')}</div>`
  } else if (route.page === 'contact') {
    main = band(t.contactTitle, t.contactIntro) + `<div class="mx-auto max-w-6xl px-4 py-8">${contactHtml(content)}</div>`
  }

  const footer = `<footer class="bg-slate-900 px-4 py-10 text-slate-300"><nav aria-label="Footer">${SITE_PAGES.map((page) => link(p(page), navNames[page])).join(' · ')}</nav>${contactHtml(content)}<p>© ${new Date().getFullYear()} All rights reserved Just Love Tour. Developed by <a href="https://share.google/t3i4bB7dDgzouBM7c" target="_blank" rel="noopener noreferrer">KPM Studios Ltd</a>.</p></footer>`
  return `<div class="flex min-h-screen flex-col bg-[#f6f8f5] text-slate-900">${header}<main id="main" class="flex-1">${main}</main>${footer}</div>`
}

function contactHtml(content: Content) {
  const contact = content.settings.contact
  if (!contact) return ''
  return `<address class="not-italic">${[
    contact.phone_display ? `<a href="tel:${esc(contact.whatsapp)}">${esc(contact.phone_display)}</a>` : '',
    contact.email ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>` : '',
    contact.location ? esc(contact.location) : '',
  ]
    .filter(Boolean)
    .join(' · ')}</address>`
}
