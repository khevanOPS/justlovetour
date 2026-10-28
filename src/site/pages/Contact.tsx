import { useState, type FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { isEmail, messageLines, openWhatsApp, socialLinks, useSite } from '../lib'
import { Field, inputClass, PageHeader, PrimaryButton } from '../ui'

export default function Contact() {
  const { t, content } = useSite()
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [tour, setTour] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const contact = content.settings.contact
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${contact?.location || 'Curepipe'}, Mauritius`)}`

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!first.trim() || !email.trim() || !message.trim()) return setError(t.fillRequired)
    if (!isEmail(email)) return setError(t.invalidEmail)
    setError('')
    openWhatsApp(
      content,
      messageLines([
        ['', `${t.msg.hello} (${t.msg.contact})`],
        [t.msg.name, `${first.trim()} ${last.trim()}`.trim()],
        [t.msg.email, email.trim()],
        [t.msg.tour, tour],
        ['', `\n${message.trim()}`],
      ]),
    )
    setSent(true)
  }

  return (
    <>
      <PageHeader title={t.contactTitle} intro={t.contactIntro} />
      <div className="mx-auto -mt-6 grid max-w-6xl gap-8 px-4 md:grid-cols-[1.2fr_1fr] md:items-start">
        <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.firstName} id="contact-first" required>
              <input id="contact-first" autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} className={inputClass} />
            </Field>
            <Field label={t.lastName} id="contact-last">
              <input id="contact-last" autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label={t.email} id="contact-email" required>
            <input id="contact-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
          </Field>
          <Field label={t.whichTour} id="contact-tour">
            <select id="contact-tour" value={tour} onChange={(e) => setTour(e.target.value)} className={inputClass}>
              <option value="">{t.noTour}</option>
              {content.tours.map((item) => (
                <option key={item.slug} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t.message} id="contact-message" required>
            <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} h-auto py-3`} />
          </Field>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {sent && !error && <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-800">{t.whatsappOpened}</p>}
          <PrimaryButton type="submit">{t.sendWhatsApp}</PrimaryButton>
        </form>

        <div className="space-y-6 md:pt-12">
          <ul className="grid grid-cols-2 gap-2.5">
            {socialLinks(content.settings.socials).map(({ key, href, icon: Icon }) => (
              <li key={key}>
                <a href={href} target="_blank" rel="noopener" className="flex h-full flex-col gap-1.5 rounded-2xl bg-white p-4 hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold">{t.social[key][0]}</span>
                  <span className="text-sm text-teal-700">{t.social[key][1]} →</span>
                </a>
              </li>
            ))}
          </ul>
          <section aria-labelledby="find-us" className="space-y-2 rounded-2xl bg-white p-5">
            <h2 id="find-us" className="font-serif text-2xl font-bold">{t.findUs}</h2>
            {contact?.phone_display && (
              <a href={`tel:${contact.whatsapp}`} className="flex min-h-11 items-center gap-2 text-slate-800">
                <Phone className="h-4 w-4 text-teal-600" aria-hidden="true" /> {contact.phone_display}
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="flex min-h-11 items-center gap-2 break-all text-slate-800">
                <Mail className="h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" /> {contact.email}
              </a>
            )}
            {contact?.location && (
              <p className="flex min-h-11 items-center gap-2 text-slate-800">
                <MapPin className="h-4 w-4 text-teal-600" aria-hidden="true" /> {contact.location}
              </p>
            )}
            <a href={mapsUrl} target="_blank" rel="noopener" className="mt-2 flex h-12 items-center justify-center rounded-xl border border-teal-600 font-semibold text-teal-700">
              {t.openMaps}
            </a>
          </section>
        </div>
      </div>
      <div className="h-12" />
    </>
  )
}
