import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api, errorText } from '../api'
import { Field, Section } from './TourEditor'
import { newReviewId, normalizeReviews, REVIEW_MAX, REVIEW_NAME_MAX, REVIEW_SOURCE_LABEL, REVIEW_SOURCES, REVIEW_TEXT_MAX, type ManualReview } from '@/site/reviews'

const SHOWN = 10

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ManualReview[] | null>(null)
  const [saved, setSaved] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<{ settings: Record<string, unknown> }>('/api/admin/settings')
      .then(({ settings }) => {
        const list = normalizeReviews(settings.reviews)
        setReviews(list)
        setSaved(JSON.stringify(list))
      })
      .catch((e) => toast.error(errorText(e)))
  }, [])
  if (!reviews) return <p className="text-gray-500">Loading reviews…</p>

  const dirty = JSON.stringify(reviews) !== saved
  const set = (id: string, patch: Partial<ManualReview>) => setReviews(reviews.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  const move = (index: number, by: number) => {
    const list = [...reviews]
    const [r] = list.splice(index, 1)
    list.splice(index + by, 0, r)
    setReviews(list)
  }
  const remove = (r: ManualReview) => {
    if ((r.name || r.text) && !window.confirm(`Delete the review by ${r.name || 'this person'}?`)) return
    setReviews(reviews.filter((x) => x.id !== r.id))
  }
  const add = () => setReviews([{ id: newReviewId(), enabled: true, name: '', rating: 5, text: '', date: new Date().toISOString().slice(0, 7), source: 'google' }, ...reviews])
  const save = async () => {
    setBusy(true)
    try {
      const { value } = await api<{ value: unknown }>('/api/admin/settings', { method: 'PUT', json: { key: 'reviews', value: reviews } })
      const clean = normalizeReviews(value)
      setReviews(clean)
      setSaved(JSON.stringify(clean))
      toast.success('Saved. The website shows it within a minute.')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }
  const shownIds = new Set(reviews.filter((r) => r.enabled && r.name && r.text).slice(0, SHOWN).map((r) => r.id))

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-gray-600">
          Copy your best reviews from Google (or elsewhere) and paste them here. The website shows the first {SHOWN} that are switched on, in this order. Keep the reviewer's own words.
        </p>
      </div>

      <Section title={`Reviews (${reviews.length} of ${REVIEW_MAX})`}>
        <Button type="button" variant="outline" className="h-11" disabled={reviews.length >= REVIEW_MAX} onClick={add}>
          <Plus className="mr-1 h-4 w-4" /> Add a review
        </Button>
        {reviews.length === 0 && <p className="text-sm text-gray-600">No reviews yet.</p>}
        <ol className="space-y-4">
          {reviews.map((r, i) => {
            const onSite = shownIds.has(r.id)
            return (
              <li key={r.id} className={`space-y-4 rounded-xl border p-4 ${onSite ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {r.name || `Review ${i + 1}`}{' '}
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${onSite ? 'bg-teal-50 text-teal-700' : 'bg-gray-200 text-gray-600'}`}>{onSite ? 'On the website' : 'Not shown'}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11" disabled={i === reviews.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11 text-red-600 hover:text-red-700" onClick={() => remove(r)} aria-label="Delete review"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <label className="flex min-h-11 items-center gap-3 text-sm font-medium">
                  <input type="checkbox" className="h-5 w-5 accent-teal-600" checked={r.enabled} onChange={(e) => set(r.id, { enabled: e.target.checked })} />
                  Show this review
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Reviewer's name" id={`rv-${r.id}-name`} counter={`${r.name.length}/${REVIEW_NAME_MAX}`}>
                    <Input id={`rv-${r.id}-name`} className="h-11" maxLength={REVIEW_NAME_MAX} value={r.name} onChange={(e) => set(r.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Stars" id={`rv-${r.id}-rating`}>
                    <select id={`rv-${r.id}-rating`} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm" value={r.rating} onChange={(e) => set(r.id, { rating: Number(e.target.value) })}>
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                    </select>
                  </Field>
                  <Field label="Month written" id={`rv-${r.id}-date`} hint="Optional. Shown as e.g. “March 2026”.">
                    <Input id={`rv-${r.id}-date`} type="month" className="h-11" value={r.date} onChange={(e) => set(r.id, { date: e.target.value })} />
                  </Field>
                  <Field label="Where it was posted" id={`rv-${r.id}-source`}>
                    <select id={`rv-${r.id}-source`} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm" value={r.source} onChange={(e) => set(r.id, { source: e.target.value as ManualReview['source'] })}>
                      {REVIEW_SOURCES.map((s) => <option key={s} value={s}>{REVIEW_SOURCE_LABEL[s] || 'Sent to us directly'}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Review text" id={`rv-${r.id}-text`} counter={`${r.text.length}/${REVIEW_TEXT_MAX}`}>
                  <textarea id={`rv-${r.id}-text`} rows={4} maxLength={REVIEW_TEXT_MAX} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={r.text} onChange={(e) => set(r.id, { text: e.target.value })} />
                </Field>
              </li>
            )
          })}
        </ol>
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
