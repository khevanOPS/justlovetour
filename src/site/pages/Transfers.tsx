import { useState, type FormEvent } from 'react'
import { Hotel } from 'lucide-react'
import { isEmail, messageLines, openWhatsApp, useSite } from '../lib'
import { Field, inputClass, PageHeader, PrimaryButton, Stepper } from '../ui'

export default function Transfers() {
  const { lang, t, content } = useSite()
  const [pickup, setPickup] = useState(t.airport)
  const [dropoff, setDropoff] = useState('')
  const [when, setWhen] = useState('')
  const [passengers, setPassengers] = useState(2)
  const [flight, setFlight] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [minWhen] = useState(() => {
    const now = new Date()
    return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!pickup.trim() || !dropoff.trim() || !when || !name.trim() || !email.trim()) return setError(t.fillRequired)
    if (!isEmail(email)) return setError(t.invalidEmail)
    setError('')
    const date = new Date(when)
    const whenText = Number.isNaN(date.getTime()) ? when : date.toLocaleString(lang === 'en' ? 'en-GB' : lang, { dateStyle: 'medium', timeStyle: 'short' })
    openWhatsApp(
      content,
      messageLines([
        ['', `${t.msg.hello} ${t.msg.transfer}`],
        [t.msg.pickup, pickup.trim()],
        [t.msg.dropoff, dropoff.trim()],
        [t.msg.when, whenText],
        [t.msg.passengers, passengers],
        [t.msg.flight, flight.trim()],
        [t.msg.name, name.trim()],
        [t.msg.email, email.trim()],
        [t.msg.notes, notes.trim()],
      ]),
    )
    setSent(true)
  }

  const pick = (place: string) => {
    setDropoff(place)
    document.getElementById('transfer-dropoff')?.focus({ preventScroll: true })
    document.getElementById('transfer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  return (
    <>
      <PageHeader title={t.transfersTitle} intro={t.transfersIntro} />
      <div className="mx-auto -mt-6 grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_1.1fr] md:items-start">
        <form id="transfer-form" onSubmit={submit} noValidate className="scroll-mt-20 space-y-4 rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-7">
          <Field label={t.pickup} id="transfer-pickup" required>
            <input id="transfer-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} className={inputClass} />
          </Field>
          <Field label={t.dropoff} id="transfer-dropoff" required>
            <input id="transfer-dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder={t.dropoffPlaceholder} className={inputClass} />
          </Field>
          <Field label={t.dateTime} id="transfer-when" required>
            <input id="transfer-when" type="datetime-local" min={minWhen} value={when} onChange={(e) => setWhen(e.target.value)} className={`${inputClass} min-w-0 appearance-none`} />
          </Field>
          <Stepper label={t.passengers} value={passengers} onChange={setPassengers} min={1} max={50} required />
          <Field label={t.flight} id="transfer-flight">
            <input id="transfer-flight" value={flight} onChange={(e) => setFlight(e.target.value)} placeholder="MK 015" className={inputClass} />
          </Field>
          <Field label={t.fullName} id="transfer-name" required>
            <input id="transfer-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.yourName} className={inputClass} />
          </Field>
          <Field label={t.email} id="transfer-email" required>
            <input id="transfer-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
          </Field>
          <Field label={t.notes} id="transfer-notes">
            <textarea id="transfer-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} h-auto py-3`} />
          </Field>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {sent && !error && <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{t.whatsappOpened}</p>}
          <PrimaryButton type="submit">{t.requestWhatsApp}</PrimaryButton>
        </form>

        <div className="space-y-8 md:pt-12">
          {content.destinations.length > 0 && (
            <section aria-labelledby="destinations-title" className="space-y-3">
              <h2 id="destinations-title" className="font-serif text-[26px] font-bold">{t.popularDestinations}</h2>
              <p className="text-sm text-slate-600">{t.tapDestination}</p>
              <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
                {content.destinations.map((place) => (
                  <li key={place.slug}>
                    <button type="button" onClick={() => pick(place.name)} aria-pressed={dropoff === place.name} className="group relative block h-28 w-full overflow-hidden rounded-2xl bg-teal-800 text-left aria-pressed:ring-4 aria-pressed:ring-teal-500">
                      {place.image && <img src={place.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                      <span className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/75 to-transparent p-3 text-sm font-semibold text-white">{place.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="flex gap-3 rounded-2xl bg-teal-50 p-4">
            <Hotel className="mt-0.5 h-6 w-6 shrink-0 text-teal-700" aria-hidden="true" />
            <div>
              <h2 className="font-sans font-semibold">{t.interHotelTitle}</h2>
              <p className="text-sm text-slate-700">{t.interHotelText}</p>
            </div>
          </section>
        </div>
      </div>
      <div className="h-12" />
    </>
  )
}
