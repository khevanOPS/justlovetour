import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api, errorText } from '../api'
import PhotoPicker from './PhotoPicker'

interface Destination {
  id: number | null
  name_en: string
  name_fr: string
  name_ru: string
  media_id: string | null
  image: string | null
  status: 'published' | 'hidden'
}

export default function Transfers() {
  const [list, setList] = useState<Destination[] | null>(null)
  const [picking, setPicking] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<{ destinations: Destination[] }>('/api/admin/destinations').then(({ destinations }) => setList(destinations)).catch((e) => toast.error(errorText(e)))
  }, [])

  if (!list) return <p className="text-gray-500">Loading destinations…</p>

  const set = (i: number, patch: Partial<Destination>) => setList(list.map((d, j) => (j === i ? { ...d, ...patch } : d)))
  const move = (i: number, delta: number) => {
    const next = [...list]
    const [item] = next.splice(i, 1)
    next.splice(i + delta, 0, item)
    setList(next)
  }

  const save = async () => {
    setBusy(true)
    try {
      await api('/api/admin/destinations', { method: 'PUT', json: { destinations: list } })
      const { destinations } = await api<{ destinations: Destination[] }>('/api/admin/destinations')
      setList(destinations)
      toast.success('Saved. The website shows the change within a minute.')
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Transfers</h1>
        <p className="mt-1 text-gray-600">Popular destinations on the Transfers page. Visitors tap one to set it as their drop-off.</p>
      </div>
      <ul className="space-y-3">
        {list.map((d, i) => (
          <li key={d.id ?? `new-${i}`} className={`flex flex-wrap gap-3 rounded-2xl bg-white p-3 shadow-sm sm:flex-nowrap ${d.status === 'hidden' ? 'opacity-60' : ''}`}>
            <button type="button" onClick={() => setPicking(i)} aria-label={`Choose a photo for ${d.name_en || 'this destination'}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {d.image ? <img src={d.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full flex-col items-center justify-center gap-1 text-xs text-gray-500"><ImagePlus className="h-5 w-5" aria-hidden="true" />Add photo</span>}
            </button>
            <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-3">
              <Input aria-label="Name in English" className="h-11" value={d.name_en} placeholder="Name (English)" onChange={(e) => set(i, { name_en: e.target.value })} />
              <Input aria-label="Name in French" className="h-11" value={d.name_fr} placeholder="French (optional)" onChange={(e) => set(i, { name_fr: e.target.value })} />
              <Input aria-label="Name in Russian" className="h-11" value={d.name_ru} placeholder="Russian (optional)" onChange={(e) => set(i, { name_ru: e.target.value })} />
            </div>
            <div className="flex w-full shrink-0 justify-end gap-1 border-t border-gray-100 pt-2 sm:w-auto sm:border-0 sm:pt-0">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" aria-label="Move down" disabled={i === list.length - 1} onClick={() => move(i, 1)} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" aria-hidden="true" /></button>
              <button type="button" aria-label={d.status === 'hidden' ? 'Show' : 'Hide'} onClick={() => set(i, { status: d.status === 'hidden' ? 'published' : 'hidden' })} className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100">{d.status === 'hidden' ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}</button>
              <button type="button" aria-label="Delete destination" onClick={() => setList(list.filter((_, j) => j !== i))} className="flex h-11 w-11 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><X className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" className="h-11" onClick={() => setList([...list, { id: null, name_en: '', name_fr: '', name_ru: '', media_id: null, image: null, status: 'published' }])}>
        <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add a destination
      </Button>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-5xl justify-end">
          <Button disabled={busy} onClick={save} className="h-12 min-w-36 bg-teal-600 text-base hover:bg-teal-700">{busy ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>
      {picking !== null && (
        <PhotoPicker single selected={[]} onClose={() => setPicking(null)} onPick={([photo]) => { set(picking, { media_id: photo.id, image: photo.url }); setPicking(null) }} />
      )}
    </div>
  )
}
