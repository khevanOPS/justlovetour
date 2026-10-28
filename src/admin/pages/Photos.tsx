import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, ImagePlus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api, errorText, formatBytes, type MediaItem } from '../api'
import { uploadPhoto } from '../upload'

interface GalleryItem {
  id: number
  status: 'published' | 'hidden'
  tour_id: number | null
  media: MediaItem
}

interface Usage {
  used: number
  files: number
  quota: number
}

export default function Photos() {
  const [items, setItems] = useState<GalleryItem[] | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [uploading, setUploading] = useState(0)
  const fileInput = useRef<HTMLInputElement>(null)

  const load = useCallback(() => {
    api<{ items: GalleryItem[] }>('/api/admin/gallery').then(({ items }) => setItems(items)).catch((e) => toast.error(errorText(e)))
    api<{ usage: Usage }>('/api/admin/media').then(({ usage }) => setUsage(usage)).catch(() => {})
  }, [])
  useEffect(load, [load])

  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    const list = Array.from(files)
    setUploading(list.length)
    const ids: string[] = []
    for (const file of list) {
      try {
        ids.push((await uploadPhoto(file)).id)
      } catch (error) {
        toast.error(`${file.name}: ${errorText(error)}`)
      }
      setUploading((n) => n - 1)
    }
    if (ids.length) {
      await api('/api/admin/gallery', { method: 'POST', json: { media_ids: ids } }).catch((e) => toast.error(errorText(e)))
      toast.success(`${ids.length} photo${ids.length > 1 ? 's' : ''} added to the gallery`)
    }
    if (fileInput.current) fileInput.current.value = ''
    load()
  }

  const move = async (index: number, delta: number) => {
    if (!items) return
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(index + delta, 0, item)
    setItems(next)
    await api('/api/admin/gallery', { method: 'PUT', json: { ids: next.map((i) => i.id) } }).catch((e) => {
      toast.error(errorText(e))
      setItems(items)
    })
  }

  const toggle = async (item: GalleryItem) => {
    const status = item.status === 'published' ? 'hidden' : 'published'
    try {
      await api(`/api/admin/gallery/${item.id}`, { method: 'PATCH', json: { status, tour_id: item.tour_id } })
      setItems((current) => current?.map((i) => (i.id === item.id ? { ...i, status } : i)) ?? null)
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  const remove = async (item: GalleryItem) => {
    if (!window.confirm('Delete this photo for good? This cannot be undone.')) return
    try {
      await api(`/api/admin/media/${item.media.id}`, { method: 'DELETE' })
      toast.success('Photo deleted')
      load()
    } catch (error) {
      toast.error(errorText(error))
    }
  }

  const percent = usage ? Math.min(100, (usage.used / usage.quota) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Photos</h1>
          <p className="mt-1 text-gray-600">The gallery page shows these in this order, 10 per page.</p>
        </div>
        <div>
          <input ref={fileInput} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          <Button className="h-11 bg-teal-600 hover:bg-teal-700" onClick={() => fileInput.current?.click()}>
            <ImagePlus className="mr-2 h-4 w-4" aria-hidden="true" /> Upload to gallery
          </Button>
        </div>
      </div>

      {usage && (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Storage used</span>
            <span className="text-gray-600">{formatBytes(usage.used)} of {formatBytes(usage.quota)} · {usage.files} photos</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100} aria-label="Storage used">
            <div className={`h-full rounded-full ${percent > 90 ? 'bg-red-500' : 'bg-teal-600'}`} style={{ width: `${Math.max(percent, 1)}%` }} />
          </div>
        </div>
      )}

      {!items ? (
        <p className="text-gray-500">Loading photos…</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: uploading }, (_, i) => (
            <div key={`up-${i}`} className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-teal-300 text-sm text-teal-700">Uploading…</div>
          ))}
          {items.map((item, index) => (
            <figure key={item.id} className={`overflow-hidden rounded-xl border bg-white ${item.status === 'hidden' ? 'border-dashed border-gray-300' : 'border-gray-200'}`}>
              <div className="relative">
                <img src={item.media.url} alt={item.media.alt.en} loading="lazy" className={`aspect-[4/3] w-full object-cover ${item.status === 'hidden' ? 'opacity-40' : ''}`} />
                {item.status === 'hidden' && <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-xs font-medium">Hidden</span>}
              </div>
              <div className="flex justify-between p-1">
                <button type="button" aria-label="Move earlier" disabled={index === 0} onClick={() => move(index, -1)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowLeft className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" aria-label={item.status === 'hidden' ? 'Show on website' : 'Hide from website'} onClick={() => toggle(item)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100">
                  {item.status === 'hidden' ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button type="button" aria-label="Delete photo" onClick={() => remove(item)} className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                <button type="button" aria-label="Move later" disabled={index === items.length - 1} onClick={() => move(index, 1)} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-30"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
