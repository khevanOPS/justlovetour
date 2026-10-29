import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { fetchGallery, type GalleryPage } from '../data'
import { linkClick, useSite } from '../lib'
import { pathFor, type Route } from '../routes'
import { PageHeader, Sheet } from '../ui'

const PER_PAGE = 10
const VIDEOS = ['ydbMLfiPWA0', 'qeebGVi22Qc', 'E8Uur_Du7io', 'kitYc68akb8']

export default function Gallery({ page }: { page: number }) {
  const { lang, t, content } = useSite()
  const [data, setData] = useState<GalleryPage | null>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    fetchGallery(lang, page, PER_PAGE)
      .then((result) => alive && setData(result))
      .catch(() => alive && setData({ page, pages: 1, total: 0, items: [] }))
    return () => {
      alive = false
    }
  }, [lang, page])

  const current = data?.page === page ? data : null
  const pageRoute = (n: number): Route => ({ lang, page: 'gallery', galleryPage: n })
  const item = open !== null ? current?.items[open] : undefined

  return (
    <>
      <PageHeader title={t.galleryPageTitle} intro={t.galleryIntro} />
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-6">
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {(current?.items ?? Array.from({ length: PER_PAGE }, () => null)).map((photo, index) => (
            <li key={photo?.id ?? index}>
              {photo ? (
                <button type="button" onClick={() => setOpen(index)} aria-label={`${t.openPhoto}: ${photo.alt}`} className="block w-full overflow-hidden rounded-xl">
                  <img src={photo.url} alt={photo.alt} width={photo.width ?? undefined} height={photo.height ?? undefined} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" className="aspect-square w-full object-cover transition duration-500 hover:scale-105" />
                </button>
              ) : (
                <div className="aspect-square animate-pulse rounded-xl bg-slate-200" />
              )}
            </li>
          ))}
        </ul>

        {current && current.pages > 1 && (
          <nav aria-label="Gallery pages" className="flex flex-wrap items-center justify-center gap-2">
            {page > 1 && (
              <a href={pathFor(pageRoute(page - 1))} onClick={linkClick(pageRoute(page - 1))} className="flex h-11 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {t.previous}
              </a>
            )}
            {Array.from({ length: current.pages }, (_, i) => i + 1).map((n) => (
              <a key={n} href={pathFor(pageRoute(n))} onClick={linkClick(pageRoute(n))} aria-label={t.page(n)} aria-current={n === page ? 'page' : undefined} className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-semibold ${n === page ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white'}`}>
                {n}
              </a>
            ))}
            {page < current.pages && (
              <a href={pathFor(pageRoute(page + 1))} onClick={linkClick(pageRoute(page + 1))} className="flex h-11 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium">
                {t.next} <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </nav>
        )}

        <section aria-labelledby="videos-title" className="space-y-4 pt-8">
          <h2 id="videos-title" className="font-serif text-[26px] font-bold md:text-3xl">{t.videos}</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {VIDEOS.map((id, index) => (
              <li key={id}>
                <Video id={id} label={t.playVideo(index + 1)} />
              </li>
            ))}
          </ul>
          {content.settings.socials?.youtube && (
            <a href={content.settings.socials.youtube} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-700 hover:underline">
              {t.youtubeMore} →
            </a>
          )}
        </section>
      </div>
      <div className="h-12" />

      <Sheet open={item !== undefined} onClose={() => setOpen(null)} title={item?.alt || t.galleryPageTitle} wide>
        {item && open !== null && current && (
          <div className="relative bg-slate-950">
            <img src={item.url} alt={item.alt} className="mx-auto max-h-[80dvh] w-full object-contain" />
            {open > 0 && (
              <button type="button" aria-label={t.previous} onClick={() => setOpen(open - 1)} className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900">
                <ChevronLeft className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
            {open < current.items.length - 1 && (
              <button type="button" aria-label={t.next} onClick={() => setOpen(open + 1)} className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900">
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </Sheet>
    </>
  )
}

// The YouTube player only loads after a tap, which keeps the page light.
function Video({ id, label }: { id: string; label: string }) {
  const [playing, setPlaying] = useState(false)
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={label}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-2xl"
      />
    )
  }
  return (
    <button type="button" onClick={() => setPlaying(true)} aria-label={label} className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-teal-700 shadow-lg">
          <Play className="ml-1 h-7 w-7 fill-current" aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}
