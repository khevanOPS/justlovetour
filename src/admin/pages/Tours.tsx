import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api, CATEGORY_NAMES, errorText, formatEuros, formatWhen, navigate, type Tour } from '../api'

const STATUS_STYLE: Record<Tour['status'], string> = {
  published: 'bg-emerald-100 text-emerald-800',
  draft: 'bg-amber-100 text-amber-800',
  archived: 'bg-gray-100 text-gray-600',
}
const STATUS_LABEL: Record<Tour['status'], string> = { published: 'On the website', draft: 'Draft (hidden)', archived: 'Removed' }

export default function Tours() {
  const [tours, setTours] = useState<Tour[] | null>(null)

  useEffect(() => {
    api<{ tours: Tour[] }>('/api/admin/tours')
      .then(({ tours }) => setTours(tours))
      .catch((error) => toast.error(errorText(error)))
  }, [])

  const move = async (index: number, delta: number) => {
    if (!tours) return
    const next = [...tours]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    setTours(next)
    try {
      await api('/api/admin/tours/order', { method: 'PUT', json: { ids: next.map((t) => t.id) } })
    } catch (error) {
      toast.error(errorText(error))
      setTours(tours)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Tours</h1>
          <p className="mt-1 text-gray-600">The order here is the order on the website.</p>
        </div>
        <Button onClick={() => navigate('tours/new')} className="h-11 bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add a tour
        </Button>
      </div>

      {!tours ? (
        <p className="text-gray-500">Loading tours…</p>
      ) : (
        <ul className="space-y-3">
          {tours.map((tour, index) => {
            const en = tour.translations.en
            const cover = tour.media[0]
            const missing = (['fr', 'ru'] as const).filter((lang) => !tour.translations[lang])
            return (
              <li key={tour.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <a href={`#/tours/${tour.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  {cover ? (
                    <img src={cover.url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-center text-[11px] text-amber-800">No photo</div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{en?.name}</p>
                    <p className="text-sm text-gray-600">
                      {CATEGORY_NAMES[tour.category]} ·{' '}
                      {tour.price_mode === 'fixed' ? `${formatEuros(tour.price_adult_eur)} adult${tour.price_child_eur !== null ? `, ${formatEuros(tour.price_child_eur)} child` : ''}` : 'Price on request'}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                      <span className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLE[tour.status]}`}>{STATUS_LABEL[tour.status]}</span>
                      {missing.length > 0 && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">Needs {missing.map((l) => l.toUpperCase()).join(' + ')}</span>}
                      <span className="text-gray-500">Edited {formatWhen(tour.updated_at)}{tour.updated_by_name ? ` by ${tour.updated_by_name}` : ''}</span>
                    </div>
                  </div>
                </a>
                <div className="flex shrink-0 flex-col gap-1">
                  <button type="button" aria-label={`Move ${en?.name} up`} disabled={index === 0} onClick={() => move(index, -1)} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30">
                    <ArrowUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button type="button" aria-label={`Move ${en?.name} down`} disabled={index === tours.length - 1} onClick={() => move(index, 1)} className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30">
                    <ArrowDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
