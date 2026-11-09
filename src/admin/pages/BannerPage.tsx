import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Heart, Phone, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api, errorText } from '../api'
import { Field, Section } from './TourEditor'
import { BANNER_LABEL_MAX, BANNER_MAX_MESSAGES, BANNER_TEXT_MAX, newBannerId, normalizeBanner, type Banner, type BannerMessage, type BannerText } from '@/site/banner'

const LANGS = ['en', 'fr', 'ru'] as const
const LANG_LABEL = { en: 'English', fr: 'French (empty = English)', ru: 'Russian (empty = English)' }

export default function BannerPage() {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [saved, setSaved] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<{ settings: Record<string, unknown> }>('/api/admin/settings')
      .then(({ settings }) => {
        const value = normalizeBanner(settings.banner)
        setBanner(value)
        setSaved(JSON.stringify(value))
      })
      .catch((e) => toast.error(errorText(e)))
  }, [])
  if (!banner) return <p className="text-gray-500">Loading the banner…</p>

  const dirty = JSON.stringify(banner) !== saved
  const update = (patch: Partial<Banner>) => setBanner({ ...banner, ...patch })
  const setMessage = (id: string, patch: Partial<BannerMessage>) => update({ messages: banner.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) })
  const move = (index: number, by: number) => {
    const messages = [...banner.messages]
    const [m] = messages.splice(index, 1)
    messages.splice(index + by, 0, m)
    update({ messages })
  }
  const remove = (m: BannerMessage) => {
    if (m.text.en && !window.confirm(`Delete "${m.text.en}"?`)) return
    update({ messages: banner.messages.filter((x) => x.id !== m.id) })
  }
  const add = () => update({ messages: [...banner.messages, { id: newBannerId(), enabled: true, text: { en: '', fr: '', ru: '' }, link: '' }] })
  const save = async () => {
    setBusy(true)
    try {
      const { value } = await api<{ value: unknown }>('/api/admin/settings', { method: 'PUT', json: { key: 'banner', value: banner } })
      const clean = normalizeBanner(value)
      setBanner(clean)
      setSaved(JSON.stringify(clean))
      toast.success('Saved. The website shows it within a minute.')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }
  const shown = banner.messages.filter((m) => m.enabled && m.text.en)

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Bottom banner</h1>
        <p className="mt-1 text-gray-600">The strip that scrolls along the bottom of every page, with a shine of light every 3 seconds.</p>
      </div>

      <Section title="Preview">
        <div className="flex h-11 items-center overflow-hidden rounded-lg bg-gradient-to-r from-[#0f3d3a] via-[#134e4a] to-[#0e7490] text-[13px] font-medium text-white">
          <div className="relative flex h-full flex-1 items-center overflow-hidden whitespace-nowrap">
            <span aria-hidden="true" className="jlt-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent" />
            {shown.length ? shown.map((m) => (
              <span key={m.id} className="flex items-center">
                <span className="px-4">{m.text.en}</span>
                <Heart className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
              </span>
            )) : <span className="px-4 text-white/70">No message to show yet</span>}
          </div>
          {banner.button.enabled && banner.button.label.en && (
            <span className="jlt-glow relative mx-2 flex h-8 shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-amber-300 px-3.5 font-bold text-[#0f3d3a]">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {banner.button.label.en}
            </span>
          )}
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
          <input type="checkbox" className="h-5 w-5 accent-teal-600" checked={banner.enabled} onChange={(e) => update({ enabled: e.target.checked })} />
          Show the banner on the website
        </label>
      </Section>

      <Section title="Call button" hint="A bright button at the right end of the banner, so visitors can call you in one tap.">
        <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
          <input type="checkbox" className="h-5 w-5 accent-teal-600" checked={banner.button.enabled} onChange={(e) => update({ button: { ...banner.button, enabled: e.target.checked } })} />
          Show the button
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">When tapped</legend>
          {(['call', 'whatsapp'] as const).map((action) => (
            <label key={action} className="flex min-h-11 items-center gap-3 text-sm">
              <input type="radio" name="banner-action" className="h-5 w-5 accent-teal-600" checked={banner.button.action === action} onChange={() => update({ button: { ...banner.button, action } })} />
              {action === 'call' ? 'Phone call to the WhatsApp number in Settings' : 'Open a WhatsApp chat'}
            </label>
          ))}
        </fieldset>
        <LangInputs idPrefix="button" value={banner.button.label} max={BANNER_LABEL_MAX} onChange={(label) => update({ button: { ...banner.button, label } })} />
      </Section>

      <Section title={`Messages (${banner.messages.length} of ${BANNER_MAX_MESSAGES})`} hint="They scroll one after another, in this order. Keep each one short.">
        {banner.messages.length === 0 && <p className="text-sm text-gray-600">No messages yet. Add one below.</p>}
        <ol className="space-y-4">
          {banner.messages.map((m, i) => (
            <li key={m.id} className={`space-y-4 rounded-xl border p-4 ${m.enabled ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">Message {i + 1}{m.enabled ? '' : ' (hidden)'}</p>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="outline" size="icon" className="h-11 w-11" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                  <Button type="button" variant="outline" size="icon" className="h-11 w-11" disabled={i === banner.messages.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                  <Button type="button" variant="outline" size="icon" className="h-11 w-11 text-red-600 hover:text-red-700" onClick={() => remove(m)} aria-label="Delete message"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
                <input type="checkbox" className="h-5 w-5 accent-teal-600" checked={m.enabled} onChange={(e) => setMessage(m.id, { enabled: e.target.checked })} />
                Show this message
              </label>
              <LangInputs idPrefix={`msg-${m.id}`} value={m.text} max={BANNER_TEXT_MAX} onChange={(text) => setMessage(m.id, { text })} />
              <Field label="Link when tapped (optional)" id={`msg-${m.id}-link`} hint="A page of this site such as /tours/personalised-tours, a full https:// link, or tel:+23058342797 to call.">
                <Input id={`msg-${m.id}-link`} className="h-11" inputMode="url" value={m.link} onChange={(e) => setMessage(m.id, { link: e.target.value })} />
              </Field>
            </li>
          ))}
        </ol>
        <Button type="button" variant="outline" className="h-11" disabled={banner.messages.length >= BANNER_MAX_MESSAGES} onClick={add}>
          <Plus className="mr-1 h-4 w-4" /> Add a message
        </Button>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-3">
          {dirty && <span className="text-sm text-amber-700">Unsaved changes</span>}
          <Button disabled={busy || !dirty} onClick={save} className="h-11 min-w-28 bg-teal-600 hover:bg-teal-700">{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>
    </div>
  )
}

function LangInputs({ idPrefix, value, max, onChange }: { idPrefix: string; value: BannerText; max: number; onChange: (value: BannerText) => void }) {
  return (
    <div className="grid gap-3">
      {LANGS.map((lang) => (
        <Field key={lang} label={LANG_LABEL[lang]} id={`${idPrefix}-${lang}`} counter={`${value[lang].length}/${max}`}>
          <Input id={`${idPrefix}-${lang}`} className="h-11" maxLength={max} value={value[lang]} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} />
        </Field>
      ))}
    </div>
  )
}
