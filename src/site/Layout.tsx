import { useState, type ReactNode } from 'react'
import { Heart, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { BackgroundVideo, VIDEO_CREDIT_URL } from './ui'
import { availableCurrencies, go, linkClick, socialLinks, useSite, whatsappUrl, type Currency } from './lib'
import { LANG_LABEL, LANG_NAME, LANGS, type Lang } from './i18n'
import { pathFor, type Page, type Route } from './routes'

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
  return (
    <header className="sticky top-0 z-40 bg-[#134e4a] text-white">
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

export function WhatsAppFloat() {
  const { t, content } = useSite()
  return (
    <a
      href={whatsappUrl(content)}
      target="_blank"
      rel="noopener"
      aria-label={t.whatsappFloat}
      className="fixed bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-105 md:bottom-6 md:right-6"
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
      <WhatsAppFloat />
    </div>
  )
}
