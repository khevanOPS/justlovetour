import { useEffect, useState, type ReactNode } from 'react'
import { Heart, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { BackgroundVideo, VIDEO_CREDIT_URL } from './ui'
import { availableCurrencies, go, linkClick, socialLinks, useSite, whatsappUrl, type Currency } from './lib'
import { LANG_LABEL, LANG_NAME, LANGS, type Lang } from './i18n'
import { parseRoute, pathFor, type Page, type Route } from './routes'
import { normalizeBanner } from './banner'

const NAV: { page: Page; key: keyof ReturnType<typeof useSite>['t']['nav'] }[] = [
  { page: 'home', key: 'home' },
  { page: 'home', key: 'activities' },
  { page: 'planner', key: 'planner' },
  { page: 'transfers', key: 'transfers' },
  { page: 'gallery', key: 'gallery' },
  { page: 'about', key: 'about' },
  { page: 'contact', key: 'contact' },
]

function NavLink({ item, current, onNavigate, className }: { item: (typeof NAV)[number]; current: Route; onNavigate?: () => void; className: string }) {
  const { lang, t } = useSite()
  const route: Route = { lang, page: item.page }
  const href = pathFor(route) + (item.key === 'activities' ? '#activities' : '')
  const active = item.key !== 'activities' && (current.page === item.page || (item.page === 'home' && current.page === 'tour'))
  return (
    <a
      href={href}
      aria-current={active ? 'page' : undefined}
      className={className}
      onClick={(event) => {
        onNavigate?.()
        if (item.key !== 'activities') return linkClick(route)(event)
        if (event.button !== 0 || event.metaKey || event.ctrlKey) return
        event.preventDefault()
        if (current.page !== 'home') go(route)
        requestAnimationFrame(() => document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' }))
      }}
    >
      {t.nav[item.key]}
    </a>
  )
}

function Pickers({ route, dark = true, onDone }: { route: Route; dark?: boolean; onDone?: () => void }) {
  const { lang, t, content, currency, setCurrency } = useSite()
  const currencies = availableCurrencies(content)
  const select = `h-11 cursor-pointer appearance-none rounded-lg bg-transparent px-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 ${dark ? 'text-white focus-visible:ring-white/60 [&>option]:text-slate-900' : 'border border-slate-300 px-3 text-slate-900'}`
  const switchLang = (next: Lang) => {
    onDone?.()
    // Tours keep their address in every language; the planner etc. too.
    go({ ...route, lang: next, page: route.page === 'notfound' ? 'home' : route.page }, { keepScroll: true })
  }
  return (
    <div className="flex items-center gap-1">
      {currencies.length > 1 && (
        <select aria-label={t.currency} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={select}>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
      <select aria-label={t.language} value={lang} onChange={(e) => switchLang(e.target.value as Lang)} className={select}>
        {LANGS.map((l) => (
          <option key={l} value={l}>
            {dark ? LANG_LABEL[l] : LANG_NAME[l]}
          </option>
        ))}
      </select>
    </div>
  )
}

function Logo() {
  const { lang } = useSite()
  const route: Route = { lang, page: 'home' }
  return (
    <a href={pathFor(route)} onClick={linkClick(route)} className="flex h-11 items-center gap-2 text-[17px] font-semibold text-white">
      <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
      Just Love Tour
    </a>
  )
}

export function Header({ route }: { route: Route }) {
  const { t, content } = useSite()
  const [menuOpen, setMenuOpen] = useState(false)
  // On the home page the header floats over the hero's light show, and turns solid once the page scrolls.
  const overlay = route.page === 'home'
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])
  const solid = !overlay || scrolled
  return (
    <header className={`sticky top-0 z-40 text-white transition-[background-color,box-shadow,backdrop-filter] duration-300 ${solid ? 'bg-[#134e4a]/95 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.key} item={item} current={route} className="rounded-lg px-3 py-2 text-sm font-medium text-white/85 hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white" />
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Pickers route={route} />
          <a href={whatsappUrl(content)} target="_blank" rel="noopener" className="ml-2 hidden h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50 lg:flex">
            {t.bookWhatsApp}
          </a>
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger aria-label={t.menu} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10 lg:hidden">
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
              <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-[#134e4a] p-4 text-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-[17px] font-semibold">{t.menu}</Dialog.Title>
                  <Dialog.Close aria-label={t.closeMenu} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/10">
                    <X className="h-6 w-6" aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <nav aria-label="Main" className="mt-4 flex flex-col">
                  {NAV.map((item) => (
                    <NavLink key={item.key} item={item} current={route} onNavigate={() => setMenuOpen(false)} className="flex h-12 items-center rounded-xl px-3 font-serif text-xl hover:bg-white/10 aria-[current=page]:bg-white/15" />
                  ))}
                </nav>
                <a href={whatsappUrl(content)} target="_blank" rel="noopener" className="mt-auto flex h-12 items-center justify-center rounded-xl bg-white font-semibold text-teal-800">
                  {t.bookWhatsApp}
                </a>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}

// Scrolling strip along the bottom of every page, written by the admins under Banner. It can't be closed.
function BottomBanner() {
  const { lang, t, content } = useSite()
  const banner = normalizeBanner(content.settings.banner)
  const messages = banner.enabled ? banner.messages.filter((m) => m.enabled && m.text.en) : []
  const visible = messages.length > 0

  // Lifts the WhatsApp button and leaves room under the footer while the strip is showing.
  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', visible ? '44px' : '0px')
  }, [visible])

  if (!visible) return null

  // A page of this site opens in the visitor's language unless the link names one.
  const resolve = (href: string) => {
    if (!href.startsWith('/')) return { href, route: null }
    const url = new URL(href, window.location.origin)
    const parsed = parseRoute(url.pathname, url.search)
    const route = /^\/(fr|ru)(\/|$)/.test(url.pathname) ? parsed : { ...parsed, lang }
    return { href: pathFor(route), route }
  }
  const item = (m: (typeof messages)[number], copy: number) => {
    const label = <span className="px-5">{m.text[lang] || m.text.en}</span>
    if (!m.link) return label
    const { href, route } = resolve(m.link)
    return (
      <a
        href={href}
        tabIndex={copy > 0 ? -1 : undefined}
        {...(route || href.startsWith('tel:') ? {} : { target: '_blank', rel: 'noopener' })}
        onClick={route ? (event) => { event.preventDefault(); go(route) } : undefined}
        className="underline decoration-white/40 underline-offset-4 hover:decoration-white"
      >
        {label}
      </a>
    )
  }
  const run = (copy: number) => (
    <span key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
      {messages.map((m) => (
        <span key={m.id} className="flex items-center whitespace-nowrap">
          {item(m, copy)}
          <Heart className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
        </span>
      ))}
    </span>
  )
  const length = messages.reduce((sum, m) => sum + (m.text[lang] || m.text.en).length + 6, 0)
  // Identical halves scroll by half their width, so the loop never shows a seam.
  const copies = messages.length < 3 ? 4 : 2
  const button = banner.button
  const number = content.settings.contact?.whatsapp ?? ''
  const buttonHref = button.action === 'whatsapp' ? whatsappUrl(content) : number ? `tel:${number.replace(/[^\d+]/g, '')}` : ''
  const buttonLabel = button.label[lang] || button.label.en
  return (
    <>
      <div aria-hidden="true" className="h-11" />
      <aside aria-label={t.bannerLabel} className="fixed inset-x-0 bottom-0 z-40 flex h-11 items-center bg-gradient-to-r from-[#0f3d3a] via-[#134e4a] to-[#0e7490] pb-[env(safe-area-inset-bottom)] text-[13px] font-medium text-white shadow-[0_-6px_20px_rgba(0,0,0,0.18)]">
        <div className="jlt-marquee-wrap relative h-full flex-1 overflow-hidden">
          <span aria-hidden="true" className="jlt-sweep pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          <div className="flex h-full items-center">
            <span className="jlt-marquee flex w-max" style={{ ['--marquee-duration' as string]: `${Math.max(18, length * 0.3 * (copies / 2))}s` }}>
              {Array.from({ length: copies }, (_, i) => run(i))}
            </span>
          </div>
        </div>
        {button.enabled && buttonHref && buttonLabel && (
          <a
            href={buttonHref}
            {...(button.action === 'whatsapp' ? { target: '_blank', rel: 'noopener' } : {})}
            className="jlt-glow relative mx-2 flex h-8 shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-amber-300 px-3.5 text-[13px] font-bold text-[#0f3d3a] hover:bg-amber-200"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {buttonLabel}
            <span aria-hidden="true" className="jlt-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </a>
        )}
      </aside>
    </>
  )
}

export function WhatsAppFloat() {
  const { t, content } = useSite()
  return (
    <a
      href={whatsappUrl(content)}
      target="_blank"
      rel="noopener"
      aria-label={t.whatsappFloat}
      className="fixed bottom-[calc(1rem+var(--banner-h,0px))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-105 md:bottom-[calc(1.5rem+var(--banner-h,0px))] md:right-6"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.3 11.3 0 0 0 12.05.7C5.79.7.7 5.79.7 12.05c0 2 .52 3.95 1.52 5.67L.6 23.3l5.72-1.5a11.3 11.3 0 0 0 5.42 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02" />
      </svg>
    </a>
  )
}

export function Footer({ route }: { route: Route }) {
  const { t, content } = useSite()
  const contact = content.settings.contact
  return (
    <footer className="relative isolate overflow-hidden bg-slate-900 pb-24 pt-10 text-slate-300 md:pb-10">
      <BackgroundVideo className="absolute inset-0 -z-20 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/60 via-slate-950/70 to-slate-950/90" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-[17px] font-semibold text-white">
            <Heart className="h-5 w-5 fill-white" aria-hidden="true" /> Just Love Tour
          </p>
          <p className="max-w-xs text-sm leading-relaxed">{t.footerTagline}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-4 text-sm md:grid-cols-1">
          {NAV.map((item) => (
            <NavLink key={item.key} item={item} current={route} className="flex min-h-10 items-center hover:text-white" />
          ))}
        </nav>
        <div className="space-y-2 text-sm">
          {contact?.phone_display && (
            <a href={`tel:${contact.whatsapp}`} className="flex min-h-10 items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" aria-hidden="true" /> {contact.phone_display}
            </a>
          )}
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="flex min-h-10 items-center gap-2 break-all hover:text-white">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> {contact.email}
            </a>
          )}
          {contact?.location && (
            <p className="flex min-h-10 items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {contact.location}
            </p>
          )}
          <p className="pt-2 text-xs uppercase tracking-[0.16em] text-slate-400">{t.followUs}</p>
          <div className="flex gap-2">
            {socialLinks(content.settings.socials).map(({ key, href, icon: Icon }) => (
              <a key={key} href={href} target="_blank" rel="noopener" aria-label={t.social[key][0]} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} All rights reserved Just Love Tour. Developed by{' '}
        <a href="https://share.google/t3i4bB7dDgzouBM7c" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-white hover:underline">
          KPM Studios Ltd
        </a>
        .
        <span className="mt-1 block text-slate-500">
          {t.videoCredit}{' '}
          <a href={VIDEO_CREDIT_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-white hover:underline">
            Vecteezy
          </a>
        </span>
      </p>
    </footer>
  )
}

export function Shell({ route, children }: { route: Route; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f5] text-slate-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-teal-800">
        Skip to content
      </a>
      <Header route={route} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer route={route} />
      <BottomBanner />
      <WhatsAppFloat />
    </div>
  )
}
