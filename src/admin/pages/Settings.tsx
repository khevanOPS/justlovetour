import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api, errorText } from '../api'
import { Field, Section } from './TourEditor'

type Settings = {
  contact: { whatsapp: string; phone_display: string; email: string; location: string }
  socials: { instagram: string; facebook: string; youtube: string; google_reviews: string }
  currency: { usd_per_eur: number | string | null; mur_per_eur: number | string | null }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    api<{ settings: Settings }>('/api/admin/settings').then(({ settings }) => setSettings(settings)).catch((e) => toast.error(errorText(e)))
  }, [])
  if (!settings) return <p className="text-gray-500">Loading settings…</p>

  const set = <K extends keyof Settings>(key: K, patch: Partial<Settings[K]>) => setSettings({ ...settings, [key]: { ...settings[key], ...patch } })
  const save = async (key: keyof Settings) => {
    setBusy(key)
    try {
      const { value } = await api<{ value: unknown }>('/api/admin/settings', { method: 'PUT', json: { key, value: settings[key] } })
      setSettings({ ...settings, [key]: value })
      toast.success('Saved')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(null)
    }
  }
  const saveButton = (key: keyof Settings) => (
    <div className="flex justify-end"><Button disabled={busy === key} onClick={() => save(key)} className="h-11 min-w-28 bg-teal-600 hover:bg-teal-700">{busy === key ? 'Saving…' : 'Save'}</Button></div>
  )

  const { contact, socials, currency } = settings
  const usd = Number(currency.usd_per_eur)
  const mur = Number(currency.mur_per_eur)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Section title="Contact details" hint="Used on every page, in the footer and in WhatsApp buttons.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp number" id="wa" hint="With country code, e.g. +23058342797"><Input id="wa" className="h-11" inputMode="tel" value={contact.whatsapp} onChange={(e) => set('contact', { whatsapp: e.target.value })} /></Field>
          <Field label="Phone as shown" id="phone" hint="e.g. +230 5834 2797"><Input id="phone" className="h-11" value={contact.phone_display} onChange={(e) => set('contact', { phone_display: e.target.value })} /></Field>
          <Field label="Email" id="email"><Input id="email" type="email" className="h-11" value={contact.email} onChange={(e) => set('contact', { email: e.target.value })} /></Field>
          <Field label="Location" id="location"><Input id="location" className="h-11" value={contact.location} onChange={(e) => set('contact', { location: e.target.value })} /></Field>
        </div>
        {saveButton('contact')}
      </Section>

      <Section title="Social links" hint="Full links starting with https://. Leave empty to hide one.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(['instagram', 'facebook', 'youtube', 'google_reviews'] as const).map((key) => (
            <Field key={key} label={{ instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', google_reviews: 'Google reviews' }[key]} id={key}>
              <Input id={key} className="h-11" inputMode="url" value={socials[key]} onChange={(e) => set('socials', { [key]: e.target.value })} />
            </Field>
          ))}
        </div>
        {saveButton('socials')}
      </Section>

      <Section title="Exchange rates" hint="Prices are entered in euros. Visitors who choose US dollars or rupees see them converted with these rates.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="1 euro = how many US dollars" id="usd"><Input id="usd" className="h-11" inputMode="decimal" placeholder="e.g. 1.08" value={currency.usd_per_eur ?? ''} onChange={(e) => set('currency', { usd_per_eur: e.target.value })} /></Field>
          <Field label="1 euro = how many Mauritian rupees" id="mur"><Input id="mur" className="h-11" inputMode="decimal" placeholder="e.g. 50.5" value={currency.mur_per_eur ?? ''} onChange={(e) => set('currency', { mur_per_eur: e.target.value })} /></Field>
        </div>
        {usd > 0 && mur > 0 && <p className="text-sm text-gray-600">Example: a €150 tour shows as ${Math.round(150 * usd)} or Rs {Math.round(150 * mur).toLocaleString('en')}.</p>}
        {(!usd || !mur) && <p className="text-sm text-amber-700">Until both rates are set, the currency switch on the website only offers euros.</p>}
        {saveButton('currency')}
      </Section>
    </div>
  )
}
