import { useState, type FormEvent } from 'react'
import { Check, Clock, Copy, MapPin } from 'lucide-react'
import { fr, ru } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import type { Tour } from '../data'
import { formatDate, go, isEmail, messageLines, money, openWhatsApp, toIsoDate, useSite } from '../lib'
import { pathFor } from '../routes'
import { Field, inputClass, Price, PrimaryButton, Sheet, Stepper, TourImage } from '../ui'

const DAY_PICKER_LOCALE = { en: undefined, fr, ru }

export default function TourSheet({ slug }: { slug: string }) {
  const site = useSite()
  const { lang, t, content } = site
  const tour = content.tours.find((item) => item.slug === slug)
  const [view, setView] = useState<'details' | 'booking'>(() => (window.location.hash === '#book' ? 'booking' : 'details'))
  const close = () => go({ lang, page: 'home' }, { keepScroll: true })

  return (
    <Sheet open onClose={close} title={tour?.name ?? t.tourNotFound} wide={view === 'details'}>
      {!tour ? (
        <div className="space-y-4 p-6 pt-12 text-center">
          <p className="text-lg">{t.tourNotFound}</p>
          <PrimaryButton onClick={close}>{t.backToTours}</PrimaryButton>
        </div>
      ) : view === 'details' ? (
        <Details tour={tour} onBook={() => setView('booking')} />
      ) : (
        <Booking tour={tour} onBack={() => setView('details')} />
      )}
    </Sheet>
  )
}

function Details({ tour, onBook }: { tour: Tour; onBook: () => void }) {
  const { lang, t } = useSite()
  const [copied, setCopied] = useState(false)
  const timing = tour.start_time && tour.end_time ? `${t.fullDay} · ${tour.start_time}–${tour.end_time}` : ''
  const isLand = tour.category === 'land'

  const copy = async () => {
    const url = new URL(pathFor({ lang, page: 'tour', slug: tour.slug }), window.location.origin).toString()
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) await navigator.share({ title: tour.name, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // The visitor closed the share menu.
    }
  }

  return (
    <article className="md:grid md:grid-cols-[1.1fr_1fr]">
      <div className="relative md:sticky md:top-0 md:h-[88vh] md:self-start">
        <ul className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:h-full" aria-label={tour.name}>
          {(tour.images.length ? tour.images : [undefined]).map((image, index) => (
            <li key={image?.id ?? index} className="w-full shrink-0 snap-center">
              <TourImage image={image} eager={index === 0} className="h-[260px] w-full md:h-full" sizes="(min-width: 768px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
        {tour.images.length > 1 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-900/60 px-2.5 py-1 text-xs text-white">
            {t.photos(tour.images.length)} ⇆
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 p-5 pb-6 md:min-h-[88vh] md:p-8 md:pb-4">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
            {t.categoryOne[tour.category]}
            {isLand && ` · ${t.hotelPickup}`}
          </p>
          <h1 className="pr-10 font-serif text-[28px] font-bold leading-tight md:text-4xl">{tour.name}</h1>
          {timing && (
            <p className="flex items-center gap-1.5 text-sm text-slate-600">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {timing}
              {isLand && ` · ${t.lunchIncluded}`}
            </p>
          )}
        </div>

        {tour.summary && <p className="text-[15px] leading-relaxed text-slate-700">{tour.summary}</p>}

        {tour.stops.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">{t.theStops}</h2>
            <ol className="space-y-1.5">
              {tour.stops.map((stop, index) => (
                <li key={index} className="flex gap-2 text-[15px]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                  {stop}
                </li>
              ))}
            </ol>
          </section>
        )}

        {tour.included.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">{t.included}</h2>
            <ul className="space-y-1.5">
              {tour.included.map((item, index) => (
                <li key={index} className="flex gap-2 text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {tour.extras.length > 0 && (
          <section className="space-y-2">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{t.extras}</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
              {tour.extras.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {tour.description && (
          <section className="space-y-2">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-teal-700">{t.aboutTour}</h2>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-700">{tour.description}</p>
          </section>
        )}

        <div className="sticky bottom-0 -mx-5 mt-auto space-y-2 border-t border-slate-100 bg-white px-5 pb-1 pt-3 md:-mx-8 md:px-8">
          <div className="flex items-baseline justify-between gap-3">
            <Price tour={tour} large />
          </div>
          <PrimaryButton onClick={onBook}>{t.bookViaWhatsApp}</PrimaryButton>
          <button type="button" onClick={copy} className="flex h-11 w-full items-center justify-center gap-2 text-sm font-medium text-teal-700">
            {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            <span aria-live="polite">{copied ? t.linkCopied : t.copyLink}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

function Booking({ tour, onBack }: { tour: Tour; onBack: () => void }) {
  const { lang, t, content, currency } = useSite()
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | undefined>()
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const fixed = tour.price_mode === 'fixed' && tour.price_adult_eur !== null
  const childPrice = tour.price_child_eur ?? tour.price_adult_eur ?? 0
  const totalCents = fixed ? adults * (tour.price_adult_eur ?? 0) + children * childPrice : 0
  const breakdown = fixed
    ? `${adults} × ${money(tour.price_adult_eur ?? 0, currency, content)}${children ? ` + ${children} × ${money(childPrice, currency, content)}` : ''}`
    : ''

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !date || !email.trim() || !phone.trim()) return setError(t.fillRequired)
    if (!isEmail(email)) return setError(t.invalidEmail)
    setError('')
    const euroTotal = fixed ? `${money(totalCents, 'EUR', content)}${currency !== 'EUR' ? ` (≈ ${money(totalCents, currency, content)})` : ''}` : t.onRequest
    openWhatsApp(
      content,
      messageLines([
        ['', `${t.msg.hello} ${t.msg.booking}:`],
        [t.msg.tour, tour.name],
        [t.msg.date, formatDate(toIsoDate(date), lang)],
        [t.msg.adults, adults],
        [t.msg.children, children || undefined],
        [t.msg.estimate, euroTotal],
        [t.msg.name, name.trim()],
        [t.msg.email, email.trim()],
        [t.msg.phone, phone.trim()],
        [t.msg.notes, notes.trim()],
      ]),
    )
    setSent(true)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col">
      <div className="space-y-4 p-5 pt-4 md:p-7">
        <div className="pr-12">
          <p className="text-xs uppercase tracking-[0.12em] text-teal-700">{t.bookTitle}</p>
          <h1 className="font-serif text-2xl font-bold leading-tight">{tour.name}</h1>
          <button type="button" onClick={onBack} className="mt-1 min-h-10 text-sm font-medium text-teal-700">
            ← {t.back}
          </button>
        </div>

        <Field label={t.fullName} id="book-name" required>
          <input id="book-name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.yourName} className={inputClass} />
        </Field>

        <fieldset className="space-y-1.5">
          <legend className="text-sm font-medium text-slate-800">
            {t.preferredDate} <span aria-hidden="true">*</span>
          </legend>
          <p className="text-[15px] font-semibold text-teal-800" aria-live="polite">
            {date ? formatDate(toIsoDate(date), lang) : t.pickDate}
          </p>
          <div className="rounded-2xl border border-slate-200 bg-white p-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: today }}
              startMonth={today}
              weekStartsOn={1}
              locale={DAY_PICKER_LOCALE[lang]}
              className="mx-auto w-full [--cell-size:2.6rem]"
            />
          </div>
        </fieldset>

        <Stepper label={t.adults} value={adults} onChange={setAdults} min={1} required />
        <Stepper label={t.children} value={children} onChange={setChildren} />

        <Field label={t.email} id="book-email" required>
          <input id="book-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
        </Field>
        <Field label={t.phone} id="book-phone" required>
          <input id="book-phone" type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 6 12 34 56 78" className={inputClass} />
        </Field>
        <Field label={t.notes} id="book-notes">
          <textarea id="book-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} className={`${inputClass} h-auto py-3`} />
        </Field>
      </div>

      <div className="sticky bottom-0 space-y-2 border-t border-slate-100 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:px-7">
        <div className="flex items-baseline justify-between gap-3" aria-live="polite">
          <span className="text-sm text-slate-600">{fixed ? breakdown : t.totalOnRequest}</span>
          {fixed && (
            <span className="text-xl font-bold text-teal-700">
              <span className="sr-only">{t.estimatedTotal}: </span>
              {currency === 'EUR' ? '' : '≈ '}
              {money(totalCents, currency, content)}
            </span>
          )}
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {sent && !error && (
          <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">
            {t.whatsappOpened}
          </p>
        )}
        <PrimaryButton type="submit">{t.sendWhatsApp}</PrimaryButton>
      </div>
    </form>
  )
}
