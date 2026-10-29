import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { api, errorText, LANG_NAMES, LANGS, type Lang } from '../api'
import { Field, Section } from './TourEditor'

interface Hero { eyebrow: string; title: string; travellers: string }
interface Point { title: string; text: string }
interface About { title: string; paragraphs: string[] }
interface Faq { q: string; a: string }
type Values = { hero: Hero; why: Point[]; about: About; faq: Faq[] }
type Key = keyof Values

const EMPTY: Values = { hero: { eyebrow: '', title: '', travellers: '' }, why: [], about: { title: '', paragraphs: [] }, faq: [] }
const KEYS: Key[] = ['hero', 'why', 'about', 'faq']

export default function PageTexts() {
  const [lang, setLang] = useState<Lang>('en')
  const [all, setAll] = useState<Record<Key, Partial<Record<Lang, unknown>>> | null>(null)

  useEffect(() => {
    Promise.all(KEYS.map((key) => api<{ values: Partial<Record<Lang, unknown>> }>(`/api/admin/content/${key}`)))
      .then((results) => setAll(Object.fromEntries(KEYS.map((key, i) => [key, results[i].values])) as Record<Key, Partial<Record<Lang, unknown>>>))
      .catch((error) => toast.error(errorText(error)))
  }, [])

  if (!all) return <p className="text-gray-500">Loading texts…</p>

  const valueOf = <K extends Key>(key: K): Values[K] => (all[key][lang] as Values[K] | undefined) ?? (structuredClone(EMPTY[key]) as Values[K])
  const english = <K extends Key>(key: K): Values[K] => (all[key].en as Values[K] | undefined) ?? EMPTY[key]

  const save = async (key: Key, value: unknown) => {
    try {
      const result = await api<{ value: unknown }>(`/api/admin/content/${key}`, { method: 'PUT', json: { lang, value } })
      setAll({ ...all, [key]: { ...all[key], [lang]: result.value } })
      toast.success('Saved. The website shows the change within a minute.')
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Page texts</h1>
        <p className="mt-1 text-gray-600">Texts on the home and About pages. Each box saves on its own.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Language">
        {LANGS.map((l) => (
          <button key={l} type="button" role="tab" aria-selected={lang === l} onClick={() => setLang(l)} className={`h-11 rounded-xl border px-4 text-sm font-medium ${lang === l ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-200 bg-white'}`}>
            {LANG_NAMES[l]}
          </button>
        ))}
      </div>
      {lang !== 'en' && <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900">Empty boxes show the English text on the {LANG_NAMES[lang]} site.</p>}

      <HeroForm key={`hero-${lang}`} initial={valueOf('hero')} english={english('hero')} onSave={(v) => save('hero', v)} />
      <PointsForm key={`why-${lang}`} initial={valueOf('why')} english={english('why')} onSave={(v) => save('why', v)} />
      <AboutForm key={`about-${lang}`} initial={valueOf('about')} english={english('about')} onSave={(v) => save('about', v)} />
      <FaqForm key={`faq-${lang}`} initial={valueOf('faq')} english={english('faq')} onSave={(v) => save('faq', v)} />
    </div>
  )
}

function SaveRow({ onSave }: { onSave: () => Promise<void> }) {
  const [busy, setBusy] = useState(false)
  return (
    <div className="flex justify-end">
      <Button type="button" disabled={busy} className="h-11 min-w-28 bg-teal-600 hover:bg-teal-700" onClick={async () => { setBusy(true); await onSave(); setBusy(false) }}>
        {busy ? 'Saving…' : 'Save'}
      </Button>
    </div>
  )
}

function HeroForm({ initial, english, onSave }: { initial: Hero; english: Hero; onSave: (v: Hero) => Promise<void> }) {
  const [v, setV] = useState(initial)
  return (
    <Section title="Top of the home page">
      <Field label="Small line above the headline" id="eyebrow"><Input id="eyebrow" className="h-11" value={v.eyebrow} placeholder={english.eyebrow} maxLength={80} onChange={(e) => setV({ ...v, eyebrow: e.target.value })} /></Field>
      <Field label="Headline" id="headline"><Input id="headline" className="h-11" value={v.title} placeholder={english.title} maxLength={120} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
      <Field label="Happy travellers count" id="travellers" hint='Shown as "100+ happy travellers"'><Input id="travellers" className="h-11 max-w-40" value={v.travellers} placeholder={english.travellers} maxLength={20} onChange={(e) => setV({ ...v, travellers: e.target.value })} /></Field>
      <SaveRow onSave={() => onSave(v)} />
    </Section>
  )
}

function PointsForm({ initial, english, onSave }: { initial: Point[]; english: Point[]; onSave: (v: Point[]) => Promise<void> }) {
  const [v, setV] = useState(initial.length ? initial : english.map(() => ({ title: '', text: '' })))
  const set = (i: number, patch: Partial<Point>) => setV(v.map((p, j) => (j === i ? { ...p, ...patch } : p)))
  return (
    <Section title="Why Just Love Tour" hint="Up to 6 short points with a title and one line each.">
      {v.map((point, i) => (
        <div key={i} className="grid gap-2 rounded-xl border border-gray-100 p-3 sm:grid-cols-[1fr_2fr_auto]">
          <Input aria-label={`Point ${i + 1} title`} className="h-11" value={point.title} placeholder={english[i]?.title ?? 'Title'} maxLength={60} onChange={(e) => set(i, { title: e.target.value })} />
          <Input aria-label={`Point ${i + 1} text`} className="h-11" value={point.text} placeholder={english[i]?.text ?? 'One line'} maxLength={160} onChange={(e) => set(i, { text: e.target.value })} />
          <button type="button" aria-label={`Remove point ${i + 1}`} onClick={() => setV(v.filter((_, j) => j !== i))} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"><X className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      ))}
      {v.length < 6 && <Button type="button" variant="outline" className="h-11" onClick={() => setV([...v, { title: '', text: '' }])}><Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add a point</Button>}
      <SaveRow onSave={() => onSave(v.filter((p) => p.title || p.text))} />
    </Section>
  )
}

function AboutForm({ initial, english, onSave }: { initial: About; english: About; onSave: (v: About) => Promise<void> }) {
  const [title, setTitle] = useState(initial.title)
  const [body, setBody] = useState(initial.paragraphs.join('\n\n'))
  return (
    <Section title="About us page">
      <Field label="Title" id="about-title"><Input id="about-title" className="h-11" value={title} placeholder={english.title} maxLength={120} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="Story" id="about-body" hint="Leave an empty line between paragraphs."><Textarea id="about-body" rows={8} value={body} placeholder={english.paragraphs.join('\n\n')} onChange={(e) => setBody(e.target.value)} /></Field>
      <SaveRow onSave={() => onSave({ title, paragraphs: body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) })} />
    </Section>
  )
}

function FaqForm({ initial, english, onSave }: { initial: Faq[]; english: Faq[]; onSave: (v: Faq[]) => Promise<void> }) {
  const [v, setV] = useState(initial.length ? initial : english.map(() => ({ q: '', a: '' })))
  const set = (i: number, patch: Partial<Faq>) => setV(v.map((f, j) => (j === i ? { ...f, ...patch } : f)))
  return (
    <Section title="Questions (FAQ)" hint="The FAQ section stays hidden until at least one question has an answer.">
      {v.map((faq, i) => (
        <div key={i} className="space-y-2 rounded-xl border border-gray-100 p-3">
          <div className="flex gap-2">
            <Input aria-label={`Question ${i + 1}`} className="h-11" value={faq.q} placeholder={english[i]?.q ?? 'Question'} maxLength={200} onChange={(e) => set(i, { q: e.target.value })} />
            <button type="button" aria-label={`Remove question ${i + 1}`} onClick={() => setV(v.filter((_, j) => j !== i))} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"><X className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          <Textarea aria-label={`Answer ${i + 1}`} rows={3} value={faq.a} placeholder={english[i]?.a ?? 'Answer'} maxLength={1500} onChange={(e) => set(i, { a: e.target.value })} />
        </div>
      ))}
      {v.length < 20 && <Button type="button" variant="outline" className="h-11" onClick={() => setV([...v, { q: '', a: '' }])}><Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add a question</Button>}
      <SaveRow onSave={() => onSave(v)} />
    </Section>
  )
}
