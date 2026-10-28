import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import type { Category } from '../data'
import { formatDate, isEmail, messageLines, openWhatsApp, toIsoDate, useSite } from '../lib'
import { Chip, Field, inputClass, PageHeader, Price, PrimaryButton, Stepper, TourImage } from '../ui'

type Traveller = 'couple' | 'family' | 'group' | 'relaxed'
type DayRange = 'short' | 'mid' | 'long'
type Interest = 'nature' | 'culture' | 'adventure' | 'beaches'

const INTEREST_CATEGORIES: Record<Interest, Category[]> = { nature: ['land', 'adventure'], culture: ['land'], adventure: ['adventure', 'sea'], beaches: ['sea'] }

export default function Planner() {
  const { lang, t, content } = useSite()
  const [step, setStep] = useState(1)
  const [traveller, setTraveller] = useState<Traveller | ''>('')
  const [days, setDays] = useState<DayRange | ''>('')
  const [interests, setInterests] = useState<Interest[]>([])
  const [picked, setPicked] = useState<string[] | null>(null)
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const wanted = new Set(interests.flatMap((interest) => INTEREST_CATEGORIES[interest]))
  const suggestions = (wanted.size ? content.tours.filter((tour) => wanted.has(tour.category)) : content.tours).slice(0, 6)
  // Until the visitor taps, the first three suggestions are in the plan.
  const chosen = picked ?? suggestions.slice(0, 3).map((tour) => tour.slug)
  const toggleTour = (slug: string) => setPicked(chosen.includes(slug) ? chosen.filter((s) => s !== slug) : [...chosen, slug])
  const toggleInterest = (interest: Interest) => {
    setInterests(interests.includes(interest) ? interests.filter((i) => i !== interest) : [...interests, interest])
    setPicked(null)
  }

  const today = toIsoDate(new Date())
  const tripDays = arrival && departure && departure >= arrival ? Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000) + 1 : 0

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) return setError(t.fillRequired)
    if (!isEmail(email)) return setError(t.invalidEmail)
    setError('')
    const tourNames = content.tours.filter((tour) => chosen.includes(tour.slug)).map((tour) => tour.name)
    openWhatsApp(
      content,
      messageLines([
        ['', `${t.msg.hello} ${t.msg.plan}`],
        [t.msg.travellers, traveller ? t.travellerTypes[traveller] : undefined],
        [t.msg.days, days ? t.dayRanges[days] : undefined],
        [t.msg.interests, interests.map((i) => t.interests[i]).join(', ')],
        [t.msg.tours, tourNames.join(', ')],
        [t.msg.dates, arrival && departure ? `${formatDate(arrival, lang)} → ${formatDate(departure, lang)}${tripDays ? ` (${t.days(tripDays)})` : ''}` : t.notSet],
        [t.msg.adults, adults],
        [t.msg.children, children || undefined],
        [t.msg.name, name.trim()],
        [t.msg.email, email.trim()],
        [t.msg.phone, phone.trim()],
        [t.msg.notes, notes.trim()],
      ]),
    )
    setSent(true)
  }

  const next = () => {
    setStep(step + 1)
    document.getElementById('planner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHeader title={t.plannerTitle} intro={t.plannerIntro} />
      <div id="planner-form" className="mx-auto -mt-6 max-w-2xl scroll-mt-20 px-4">
        <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-8">
          <div className="space-y-2">
            <div className="flex gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-teal-600' : 'bg-slate-200'}`} />
              ))}
            </div>
            <p className="text-sm font-semibold text-teal-700" aria-live="polite">
              {t.step(step)} · {t.stepNames[step - 1]}
            </p>
          </div>

          {step === 1 && (
            <>
              <ChoiceGroup label={t.whoTravelling}>
                {(Object.keys(t.travellerTypes) as Traveller[]).map((key) => (
                  <Chip key={key} active={traveller === key} onClick={() => setTraveller(traveller === key ? '' : key)}>
                    {t.travellerTypes[key]}
                  </Chip>
                ))}
              </ChoiceGroup>
              <ChoiceGroup label={t.howManyDays}>
                {(Object.keys(t.dayRanges) as DayRange[]).map((key) => (
                  <Chip key={key} active={days === key} onClick={() => setDays(days === key ? '' : key)}>
                    {t.dayRanges[key]}
                  </Chip>
                ))}
              </ChoiceGroup>
              <ChoiceGroup label={t.whatYouLove}>
                {(Object.keys(t.interests) as Interest[]).map((key) => (
                  <Chip key={key} active={interests.includes(key)} onClick={() => toggleInterest(key)}>
                    {t.interests[key]}
                  </Chip>
                ))}
              </ChoiceGroup>
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold">{t.suggested}</p>
                  <p className="text-sm text-slate-500">{t.suggestedHint}</p>
                  <ul className="space-y-2">
                    {suggestions.map((tour) => {
                      const on = chosen.includes(tour.slug)
                      return (
                        <li key={tour.slug}>
                          <button type="button" aria-pressed={on} onClick={() => toggleTour(tour.slug)} className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition ${on ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white'}`}>
                            <TourImage image={tour.images[0] ? { ...tour.images[0], alt: '' } : undefined} className="h-14 w-14 shrink-0 rounded-xl" sizes="56px" />
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate font-semibold">{tour.name}</span>
                              <Price tour={tour} />
                            </span>
                            <span className={`mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${on ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'}`}>
                              {on && <Check className="h-4 w-4" aria-hidden="true" />}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
              <PrimaryButton onClick={next}>
                {t.next}: {t.stepNames[1].toLowerCase()} →
              </PrimaryButton>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t.arrival} id="plan-arrival">
                  <input id="plan-arrival" type="date" min={today} value={arrival} onChange={(e) => setArrival(e.target.value)} className={`${inputClass} min-w-0 appearance-none`} />
                </Field>
                <Field label={t.departure} id="plan-departure">
                  <input id="plan-departure" type="date" min={arrival || today} value={departure} onChange={(e) => setDeparture(e.target.value)} className={`${inputClass} min-w-0 appearance-none`} />
                </Field>
              </div>
              {tripDays > 0 && <p className="text-sm font-semibold text-teal-700">{t.days(tripDays)}</p>}
              <Stepper label={t.adults} value={adults} onChange={setAdults} min={1} />
              <Stepper label={t.children} value={children} onChange={setChildren} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700">
                  {t.back}
                </button>
                <PrimaryButton onClick={next}>
                  {t.next}: {t.stepNames[2].toLowerCase()} →
                </PrimaryButton>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Field label={t.fullName} id="plan-name" required>
                <input id="plan-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.yourName} className={inputClass} />
              </Field>
              <Field label={t.email} id="plan-email" required>
                <input id="plan-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </Field>
              <Field label={t.phone} id="plan-phone" required>
                <input id="plan-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </Field>
              <Field label={t.notes} id="plan-notes">
                <textarea id="plan-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} className={`${inputClass} h-auto py-3`} />
              </Field>
              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              {sent && !error && <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{t.whatsappOpened}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)} className="h-12 rounded-xl border border-slate-300 px-5 font-semibold text-slate-700">
                  {t.back}
                </button>
                <PrimaryButton type="submit">{t.sendPlan}</PrimaryButton>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="h-12" />
    </>
  )
}

function ChoiceGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="space-y-2">
      <p className="font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
