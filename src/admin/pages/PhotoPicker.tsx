import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api, errorText, type MediaItem } from '../api'

// Full-screen chooser over every uploaded photo; returns the ones ticked.
export default function PhotoPicker({ selected, onPick, onClose, single = false }: { selected: string[]; onPick: (photos: MediaItem[]) => void; onClose: () => void; single?: boolean }) {
  const [media, setMedia] = useState<MediaItem[] | null>(null)
  const [chosen, setChosen] = useState<string[]>([])

  useEffect(() => {
    api<{ media: MediaItem[] }>('/api/admin/media')
      .then(({ media }) => setMedia(media))
      .catch((error) => toast.error(errorText(error)))
  }, [])

  const toggle = (id: string) => setChosen((current) => (single ? [id] : current.includes(id) ? current.filter((c) => c !== id) : [...current, id]))

  return (
    <div role="dialog" aria-modal="true" aria-label="Choose photos" className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="font-sans text-lg font-semibold">Choose {single ? 'a photo' : 'photos'}</h2>
        <Button variant="ghost" className="h-11" onClick={onClose}>Cancel</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!media ? (
          <p className="text-gray-500">Loading photos…</p>
        ) : media.length === 0 ? (
          <p className="text-gray-500">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
            {media.map((photo) => {
              const already = selected.includes(photo.id)
              const ticked = chosen.includes(photo.id)
              return (
                <button key={photo.id} type="button" disabled={already} onClick={() => toggle(photo.id)} aria-pressed={ticked} className={`relative overflow-hidden rounded-lg ring-offset-2 ${ticked ? 'ring-4 ring-teal-600' : ''} disabled:opacity-40`}>
                  <img src={photo.url} alt={photo.alt.en} loading="lazy" className="aspect-square w-full object-cover" />
                  {ticked && <span className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white"><Check className="h-4 w-4" aria-hidden="true" /></span>}
                  {already && <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-xs text-white">Already added</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 px-4 py-3">
        <Button disabled={!chosen.length} className="h-12 w-full bg-teal-600 text-base hover:bg-teal-700" onClick={() => onPick((media ?? []).filter((m) => chosen.includes(m.id)))}>
          {chosen.length ? `Add ${chosen.length} photo${chosen.length > 1 ? 's' : ''}` : 'Tap photos to select'}
        </Button>
      </div>
    </div>
  )
}
