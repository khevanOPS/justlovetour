import { useEffect, useMemo, useState } from 'react'
import { useContent } from './data'
import { STRINGS } from './i18n'
import { Shell } from './Layout'
import { availableCurrencies, linkClick, readStoredCurrency, SiteContext, storeCurrency, useRoute, type Currency, type SiteState } from './lib'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import Planner from './pages/Planner'
import TourSheet from './pages/TourSheet'
import Transfers from './pages/Transfers'
import { pathFor } from './routes'
import { pageMeta } from './seo'
import { PageHeader } from './ui'

export default function Site() {
  const route = useRoute()
  const content = useContent(route.lang)
  const [currency, setCurrencyState] = useState<Currency>(readStoredCurrency)

  const site = useMemo<SiteState | null>(() => {
    if (!content) return null
    const offered = availableCurrencies(content)
    return {
      lang: route.lang,
      t: STRINGS[route.lang],
      content,
      currency: offered.includes(currency) ? currency : 'EUR',
      setCurrency: (next) => {
        storeCurrency(next)
        setCurrencyState(next)
      },
    }
  }, [content, route.lang, currency])

  useEffect(() => {
    document.documentElement.lang = route.lang
    if (content) document.title = pageMeta(route, content).title
  }, [route, content])

  if (!site) {
    return <div className="flex min-h-screen items-center justify-center bg-[#134e4a] text-white">{STRINGS[route.lang].loading}</div>
  }

  let page
  if (route.page === 'home' || route.page === 'tour') page = <Home />
  else if (route.page === 'planner') page = <Planner />
  else if (route.page === 'transfers') page = <Transfers />
  else if (route.page === 'gallery') page = <Gallery page={route.galleryPage ?? 1} />
  else if (route.page === 'about') page = <About />
  else if (route.page === 'contact') page = <Contact />
  else page = <NotFound />

  return (
    <SiteContext.Provider value={site}>
      <Shell route={route}>
        {page}
        {route.page === 'tour' && route.slug && <TourSheet key={route.slug} slug={route.slug} />}
      </Shell>
    </SiteContext.Provider>
  )
}

function NotFound() {
  const route = useRoute()
  const t = STRINGS[route.lang]
  const home = { lang: route.lang, page: 'home' as const }
  return (
    <>
      <PageHeader title={t.notFoundTitle} intro={t.notFoundText} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <a href={pathFor(home)} onClick={linkClick(home)} className="inline-flex h-12 items-center rounded-xl bg-teal-600 px-5 font-semibold text-white">
          {t.goHome}
        </a>
      </div>
    </>
  )
}
