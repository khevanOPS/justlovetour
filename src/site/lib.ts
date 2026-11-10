import { createContext, useContext, useEffect, useState } from 'react'
import { Facebook, Instagram, Star, Youtube } from 'lucide-react'
import type { Content, Tour } from './data'
import { DATE_LOCALE, STRINGS, type Lang, type Strings } from './i18n'
import { parseRoute, pathFor, type Route } from './routes'

// ---- Routing (real addresses, so each page and tour can be found on Google)

const readRoute = () => parseRoute(window.location.pathname, window.location.search)

export function useRoute(): Route {
  const [route, setRoute] = useState(readRoute)
  useEffect(() => {
    const onPop = () => setRoute(readRoute())
    window.addEventListener('popstate', onPop)
    window.addEventListener('jlt:navigate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('jlt:navigate', onPop)
    }
  }, [])
  return route
}

export function go(route: Route, { replace = false, keepScroll = false } = {}) {
  const href = pathFor(route)
  if (href !== window.location.pathname + window.location.search) {
    window.history[replace ? 'replaceState' : 'pushState']({ keepScroll }, '', href)
  }
  window.dispatchEvent(new Event('jlt:navigate'))
  if (!keepScroll) window.scrollTo({ top: 0 })
}

// Plain left clicks on internal links stay in the app; anything else (new tab, etc.) is left to the browser.
export function linkClick(route: Route, options?: { keepScroll?: boolean }) {
  return (event: React.MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    go(route, options)
  }
}

// ---- Site context

export interface SiteState {
  lang: Lang
  t: Strings
  content: Content
  currency: Currency
  setCurrency: (currency: Currency) => void
}

export const SiteContext = createContext<SiteState | null>(null)
export function useSite(): SiteState {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite outside SiteContext')
  return value
}
export const stringsFor = (lang: Lang) => STRINGS[lang]

// ---- Currency. Prices are stored in euro cents; other currencies are shown as estimates.

export type Currency = 'EUR' | 'USD' | 'MUR'
const SYMBOL: Record<Currency, string> = { EUR: '€', USD: '$', MUR: 'Rs ' }

export function availableCurrencies(content: Content): Currency[] {
  const rates = content.settings.currency
  return ['EUR', ...(rates?.usd_per_eur ? (['USD'] as const) : []), ...(rates?.mur_per_eur ? (['MUR'] as const) : [])]
}

export function readStoredCurrency(): Currency {
  try {
    const stored = localStorage.getItem('jlt-currency')
    return stored === 'USD' || stored === 'MUR' ? stored : 'EUR'
  } catch {
    return 'EUR'
  }
}
export function storeCurrency(currency: Currency) {
  try {
    localStorage.setItem('jlt-currency', currency)
  } catch {
    // Private mode: the choice just isn't remembered.
  }
}

export function money(cents: number, currency: Currency, content: Content): string {
  const rates = content.settings.currency
  const rate = currency === 'USD' ? rates?.usd_per_eur : currency === 'MUR' ? rates?.mur_per_eur : 1
  const effective = rate ? currency : 'EUR'
  const amount = (cents / 100) * (rate ?? 1)
  // Converted amounts are rounded up to a whole number so they never look like a promise to the cent.
  const value = effective === 'EUR' ? amount : Math.ceil(amount)
  const digits = effective === 'EUR' && !Number.isInteger(value) ? 2 : 0
  return `${SYMBOL[effective]}${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`
}

export function priceLabel(tour: Tour, site: SiteState): { main: string; sub: string } {
  const { t, currency, content } = site
  if (tour.price_mode !== 'fixed' || tour.price_adult_eur === null) return { main: t.onRequest, sub: '' }
  const child = tour.price_child_eur !== null ? ` · ${money(tour.price_child_eur, currency, content)} ${t.child}` : ''
  return { main: money(tour.price_adult_eur, currency, content), sub: `${t.perAdult}${child}` }
}

// ---- WhatsApp

export function whatsappNumber(content: Content) {
  return (content.settings.contact?.whatsapp || '+23058342797').replace(/[^\d]/g, '')
}

export function whatsappUrl(content: Content, message = '') {
  const base = `https://wa.me/${whatsappNumber(content)}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function openWhatsApp(content: Content, message: string) {
  window.open(whatsappUrl(content, message), '_blank', 'noopener')
}

export const messageLines = (lines: [string, string | number | undefined | null][]) =>
  lines.filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => (label ? `${label}: ${value}` : String(value))).join('\n')

// ---- Dates

export const toIsoDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
export function formatDate(iso: string, lang: Lang, withWeekday = true) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString(DATE_LOCALE[lang], { weekday: withWeekday ? 'short' : undefined, day: 'numeric', month: 'short', year: 'numeric' })
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

// ---- Social links that are filled in under Settings

export function socialLinks(socials: Content['settings']['socials']) {
  return [
    { key: 'instagram' as const, href: socials?.instagram, icon: Instagram },
    { key: 'facebook' as const, href: socials?.facebook, icon: Facebook },
    { key: 'youtube' as const, href: socials?.youtube, icon: Youtube },
    { key: 'google' as const, href: socials?.google_reviews, icon: Star },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href))
}
