import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ImagePlus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api, CATEGORY_NAMES, errorText, LANG_NAMES, LANGS, type Lang, type MediaItem, type Tour, navigate, type TourText } from '../api'
import { uploadPhoto } from '../upload'
import PhotoPicker from './PhotoPicker'

interface Form {
  slug: string
  category: Tour['category']
  status: Tour['status']
  price_mode: Tour['price_mode']
  price_adult_eur: string
  price_child_eur: string
  start_time: string
  end_time: string
  media: MediaItem[]
  translations: Record<Lang, TourText>
}

const emptyText = (): TourText => ({ name: '', summary: '', description: '', stops: [], included: [], extras: [], meta_title: '', meta_description: '' })
const euros = (cents: number | null) => (cents === null ? '' : String(cents / 100))

const toForm = (tour: Tour | null): Form => ({
  slug: tour?.slug ?? '',
  category: tour?.category ?? 'land',
  status: tour?.status ?? 'draft',
  price_mode: tour?.price_mode ?? 'on_request',
  price_adult_eur: euros(tour?.price_adult_eur ?? null),
  price_child_eur: euros(tour?.price_child_eur ?? null),
  start_time: tour?.start_time ?? '',
  end_time: tour?.end_time ?? '',
  media: tour?.media ?? [],
  translations: { en: { ...emptyText(), ...tour?.translations.en }, fr: { ...emptyText(), ...tour?.translations.fr }, ru: { ...emptyText(), ...tour?.translations.ru } },
})

const LIST_FIELDS = [
  { key: 'stops', label: 'Stops, in order', hint: 'One stop per line' },
  { key: 'included', label: "What's included", hint: 'One item per line, e.g. Lunch' },
  { key: 'extras', label: 'Extras paid on the day', hint: 'One item per line (optional)' },
] as const

export default function TourEditor({ id }: { id: number | null }) {
  const [form, setForm] = useState<Form | null>(id === null ? toForm(null) : null)
  const [saved, setSaved] = useState<string>('')
  const [lang, setLang] = useState<Lang>('en')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [picking, setPicking] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id === null) {
      setSaved(JSON.stringify(toForm(null)))
      return
    }
    api<{ tour: Tour }>(`/api/admin/tours/${id}`)
      .then(({ tour }) => {
        const loaded = toForm(tour)
        setForm(loaded)
        setSaved(JSON.stringify(loaded))
      })
      .catch((error) => toast.error(errorText(error)))
  }, [id])

  const dirty = form !== null && JSON.stringify(form) !== saved
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const text = form?.translations[lang]
  const english = form?.translations.en
  const preview = useMemo(() => {
    if (!form || !text) return null
    return {
      title: text.meta_title || `${text.name || english?.name || 'Tour name'} | Just Love Tour Mauritius`,
      description: text.meta_description || text.summary || english?.summary || '',
      url: `justlovetour.com${lang === 'en' ? '' : `/${lang}`}/tours/${form.slug || 'web-address'}`,
    }
  }, [form, text, english, lang])

  if (!form || !text) return <p className="text-gray-500">Loading tour…</p>

  const update = (patch: Partial<Form>) => setForm({ ...form, ...patch })
  const updateText = (patch: Partial<TourText>) => setForm({ ...form, translations: { ...form.translations, [lang]: { ...text, ...patch } } })

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return
    const list = Array.from(files)
    setUploading(list.length)
    const added: MediaItem[] = []
    for (const file of list) {
      try {
        added.push(await uploadPhoto(file, english?.name ?? ''))
      } catch (error) {
        toast.error(`${file.name}: ${errorText(error)}`)
      }
      setUploading((n) => n - 1)
    }
    setForm((current) => (current ? { ...current, media: [...current.media, ...added] } : current))
    if (fileInput.current) fileInput.current.value = ''
  }

  const movePhoto = (index: number, delta: number) => {
    const media = [...form.media]
    const [item] = media.splice(index, 1)
    media.splice(index + delta, 0, item)
    update({ media })
  }

  const save = async (status = form.status) => {
    setBusy(true)
    try {
      const payload = {
        slug: form.slug,
        category: form.category,
        status,
        price_mode: form.price_mode,
        price_adult_eur: form.price_adult_eur,
        price_child_eur: form.price_child_eur,
        start_time: form.start_time,
        end_time: form.end_time,
        media_ids: form.media.map((m) => m.id),
        translations: form.translations,
      }
      const { tour } = await api<{ tour: Tour }>(id === null ? '/api/admin/tours' : `/api/admin/tours/${id}`, { method: id === null ? 'POST' : 'PUT', json: payload })
      const next = toForm(tour)
      setForm(next)
      setSaved(JSON.stringify(next))
      toast.success(status === 'published' ? 'Saved. The website shows the change within a minute.' : status === 'archived' ? 'Tour removed from the website' : 'Saved as a draft')
      if (id === null) navigate(`tours/${tour.id}`)
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6 pb-28">
      <div>
        <a href="#/tours" className="text-sm font-medium text-teal-700">← All tours</a>
        <h1 className="mt-2 text-3xl font-bold">{english?.name || 'New tour'}</h1>
      </div>

      <Section title="On the website?">
        <div className="grid gap-2 sm:grid-cols-2">
          {([['published', 'Yes, show it', 'Visitors can see and book it'], ['draft', 'No, keep as draft', 'Hidden until you switch it on'], ...(form.status === 'archived' || saved.includes('"status":"archived"') ? ([['archived', 'Removed', 'Taken off the website']] as const) : [])] as const).map(([value, label, hint]) => (
            <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${form.status === value ? 'border-teal-600 bg-teal-50' : 'border-gray-200'}`}>
              <input type="radio" name="status" className="mt-1 h-4 w-4 accent-teal-600" checked={form.status === value} onChange={() => update({ status: value })} />
              <span>
                <span className="block font-medium">{label}</span>
                <span className="text-sm text-gray-600">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="flex flex-wrap gap-2">
          {([['fixed', 'Fixed price'], ['on_request', 'Price on request']] as const).map(([value, label]) => (
            <button key={value} type="button" onClick={() => update({ price_mode: value })} className={`h-11 rounded-xl border px-4 text-sm font-medium ${form.price_mode === value ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-200 bg-white'}`}>
              {label}
            </button>
          ))}
        </div>
        {form.price_mode === 'fixed' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Adult price (€)" id="adult">
              <Input id="adult" inputMode="decimal" value={form.price_adult_eur} onChange={(e) => update({ price_adult_eur: e.target.value })} className="h-11" placeholder="150" />
            </Field>
            <Field label="Child price (€)" id="child" hint="Leave empty if children pay the adult price">
              <Input id="child" inputMode="decimal" value={form.price_child_eur} onChange={(e) => update({ price_child_eur: e.target.value })} className="h-11" placeholder="80" />
            </Field>
          </div>
        )}
        <p className="text-sm text-gray-600">Prices are in euros. Visitors who pick US dollars or rupees see them converted with the rates in Settings.</p>
      </Section>

      <Section title="Details">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category" id="category">
            <select id="category" value={form.category} onChange={(e) => update({ category: e.target.value as Tour['category'] })} className="h-11 w-full rounded-md border border-input bg-white px-3">
              {Object.entries(CATEGORY_NAMES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </Field>
          <Field label="Starts at" id="start" hint="Optional">
            <Input id="start" type="time" value={form.start_time} onChange={(e) => update({ start_time: e.target.value })} className="h-11" />
          </Field>
          <Field label="Ends at" id="end" hint="Optional">
            <Input id="end" type="time" value={form.end_time} onChange={(e) => update({ end_time: e.target.value })} className="h-11" />
          </Field>
        </div>
      </Section>

      <Section title="Photos" hint="The first photo is the main one on the tour card. Photos are resized automatically before upload.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {form.media.map((photo, index) => (
            <figure key={photo.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="relative">
                <img src={photo.url} alt={photo.alt.en} className="aspect-[4/3] w-full object-cover" />
                {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-teal-800">Main photo</span>}
              </div>
              <div className="flex justify-between p-1">
                <button type="button" aria-label="Move photo left" disabled={index === 0} onClick={() => movePhoto(index, -1)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" aria-label="Remove photo from this tour" onClick={() => update({ media: form.media.filter((m) => m.id !== photo.id) })} className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><X className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" aria-label="Move photo right" disabled={index === form.media.length - 1} onClick={() => movePhoto(index, 1)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </figure>
          ))}
          {Array.from({ length: uploading }, (_, i) => (
            <div key={`up-${i}`} className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-teal-300 text-sm text-teal-700">Uploading…</div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
          <Button type="button" variant="outline" className="h-11" onClick={() => fileInput.current?.click()}>
            <ImagePlus className="mr-2 h-4 w-4" aria-hidden="true" /> Upload photos
          </Button>
          <Button type="button" variant="outline" className="h-11" onClick={() => setPicking(true)}>Choose from uploaded photos</Button>
        </div>
      </Section>

      <Section title="Texts">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Language">
          {LANGS.map((l) => (
            <button key={l} type="button" role="tab" aria-selected={lang === l} onClick={() => setLang(l)} className={`h-11 rounded-xl border px-4 text-sm font-medium ${lang === l ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-200 bg-white'}`}>
              {LANG_NAMES[l]}
              {l !== 'en' && !form.translations[l].name && <span className="ml-1 text-xs opacity-75">(not done)</span>}
            </button>
          ))}
        </div>
        {lang !== 'en' && <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900">Anything left empty here shows the English text instead. Fill in the name first; a tour without a {LANG_NAMES[lang]} name shows fully in English.</p>}

        <Field label={`Tour name${lang === 'en' ? ' *' : ''}`} id="name">
          <Input id="name" value={text.name} onChange={(e) => updateText({ name: e.target.value })} className="h-11" placeholder={lang === 'en' ? 'La Route du Thé' : english?.name} maxLength={120} />
        </Field>
        <Field label="Short description" id="summary" hint="One sentence for the tour card" counter={`${text.summary.length}/300`}>
          <Textarea id="summary" rows={2} value={text.summary} onChange={(e) => updateText({ summary: e.target.value })} placeholder={lang === 'en' ? '' : english?.summary} maxLength={300} />
        </Field>
        <Field label="Full description" id="description" hint="Shown on the tour's own page">
          <Textarea id="description" rows={5} value={text.description} onChange={(e) => updateText({ description: e.target.value })} placeholder={lang === 'en' ? '' : english?.description} maxLength={4000} />
        </Field>
        {LIST_FIELDS.map(({ key, label, hint }) => (
          <Field key={key} label={label} id={key} hint={hint}>
            <Textarea
              id={key}
              rows={Math.max(3, text[key].length + 1)}
              value={text[key].join('\n')}
              onChange={(e) => updateText({ [key]: e.target.value.split('\n') } as Partial<TourText>)}
              onBlur={(e) => updateText({ [key]: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) } as Partial<TourText>)}
              placeholder={lang === 'en' ? '' : english?.[key].join('\n')}
            />
          </Field>
        ))}

        <details className="rounded-xl border border-gray-200 bg-white p-4">
          <summary className="cursor-pointer font-medium">How this tour looks on Google (optional)</summary>
          {preview && (
            <div className="mt-4 rounded-lg border border-gray-100 p-3">
              <p className="text-xs text-gray-600">{preview.url}</p>
              <p className="text-lg text-[#1a0dab]">{preview.title}</p>
              <p className="text-sm text-gray-700">{preview.description}</p>
            </div>
          )}
          <div className="mt-4 space-y-4">
            <Field label="Google title" id="meta_title" hint="Leave empty to use the tour name" counter={`${text.meta_title.length}/70`}>
              <Input id="meta_title" value={text.meta_title} maxLength={70} onChange={(e) => updateText({ meta_title: e.target.value })} className="h-11" />
            </Field>
            <Field label="Google description" id="meta_description" hint="Leave empty to use the short description. Best between 120 and 160 characters." counter={`${text.meta_description.length}/170`}>
              <Textarea id="meta_description" rows={3} value={text.meta_description} maxLength={170} onChange={(e) => updateText({ meta_description: e.target.value })} />
            </Field>
            <Field label="Web address" id="slug" hint="Lowercase words joined by dashes. Changing it breaks links people already shared.">
              <Input id="slug" value={form.slug} onChange={(e) => update({ slug: e.target.value })} className="h-11" placeholder="filled in from the English name" />
            </Field>
          </div>
        </details>
      </Section>

      {id !== null && form.status !== 'archived' && (
        <Button type="button" variant="ghost" className="h-11 text-red-700 hover:bg-red-50" disabled={busy} onClick={() => window.confirm('Remove this tour from the website? You can bring it back later from the tour list.') && save('archived')}>
          <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" /> Remove this tour
        </Button>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <span className="text-sm text-gray-600">{dirty ? 'You have unsaved changes' : 'All changes saved'}</span>
          <Button type="button" disabled={busy || uploading > 0 || !dirty} onClick={() => save()} className="h-12 min-w-36 bg-teal-600 text-base hover:bg-teal-700">
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {picking && (
        <PhotoPicker
          selected={form.media.map((m) => m.id)}
          onClose={() => setPicking(false)}
          onPick={(photos) => {
            update({ media: [...form.media, ...photos.filter((p) => !form.media.some((m) => m.id === p.id))] })
            setPicking(false)
          }}
        />
      )}
    </div>
  )
}

export function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-sans text-lg font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-sm text-gray-600">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export function Field({ label, id, hint, counter, children }: { label: string; id: string; hint?: string; counter?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {counter && <span className="text-xs text-gray-500">{counter}</span>}
      </div>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}
