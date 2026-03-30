import { useMemo, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { translations, type Lang } from '@/i18n/translations'

type T = (typeof translations)[Lang]
type ActivityKey = 'adventure' | 'ile-aux-cerfs' | 'hiking' | 'quad' | 'fauna' | 'catamaran' | 'big-game-fishing' | 'frontier'
type ActivityData = {
  title: string
  description: string
  highlights: readonly string[]
  images: readonly string[]
  travelTimes: { grandBaie: string; flicEnFlac: string; portLouis: string }
  stories: readonly { title: string; text: string }[]
}

function getViewsToday(activity: string) {
  const key = `jlt_views_${activity}`
  const today = new Date()
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  try {
    const raw = sessionStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw) as { date: string; value: number }
      if (parsed?.date === ymd && typeof parsed.value === 'number') return parsed.value
    }

    const value = Math.floor(Math.random() * 13) + 5
    sessionStorage.setItem(key, JSON.stringify({ date: ymd, value }))
    return value
  } catch {
    return Math.floor(Math.random() * 13) + 5
  }
}

export default function ActivityDetail({
  activity,
  t,
  onClose,
  onContact,
  onPreviewImage
}: {
  activity: string
  t: T
  onClose: () => void
  onContact: (activityTitle: string) => void
  onPreviewImage: (image: string) => void
}) {
  const [viewsToday] = useState<number>(() => getViewsToday(activity))

  const activities = useMemo<Record<ActivityKey, ActivityData>>(
    () => ({
      adventure: {
        title: t.adventureTours,
        description: t.adventureDesc,
        highlights: t.adventureHighlights,
        images: ['/images/adventure/vallee-zip-line.jpg', '/images/adventure/adventure-tile-2.jpg', '/images/adventure/adventure-tile-3.jpg', '/images/adventure/adventure-tile-4.jpg'],
        travelTimes: { grandBaie: '1h 10m', flicEnFlac: '45m', portLouis: '35m' },
        stories: t.adventureStories
      },
      'ile-aux-cerfs': {
        title: t.ileAuxCerfsTours,
        description: t.ileAuxCerfsDesc,
        highlights: t.ileAuxCerfsHighlights,
        images: [
          '/images/ile-aux-cerf/ile-aux-cerfs.jpg',
          '/images/ile-aux-cerf/1.jpg',
          '/images/ile-aux-cerf/2.jpg',
          '/images/ile-aux-cerf/4.jpg'
        ],
        travelTimes: { grandBaie: '1h 25m', flicEnFlac: '1h 10m', portLouis: '1h' },
        stories: t.ileAuxCerfsStories
      },
      hiking: {
        title: t.hiking,
        description: t.hikingDesc,
        highlights: t.hikingHighlights,
        images: ['/images/hiking/hiking-lemorne.jpg', '/images/hiking/hiking-tile-2.jpg', '/images/hiking/hiking-tile-3.jpg', '/images/hiking/hiking-tile-4.jpg'],
        travelTimes: { grandBaie: '1h 45m', flicEnFlac: '35m', portLouis: '1h 05m' },
        stories: t.hikingStories
      },
      quad: {
        title: t.quadBikes,
        description: t.quadDesc,
        highlights: t.quadHighlights,
        images: ['/images/quad/quad-bike.jpg', '/images/quad/quad-tile-2.jpg', '/images/quad/quad-tile-3.jpg', '/images/quad/quad-tile-4.jpg'],
        travelTimes: { grandBaie: '50m', flicEnFlac: '1h 10m', portLouis: '30m' },
        stories: t.quadStories
      },
      fauna: {
        title: t.faunaFlora,
        description: t.faunaDesc,
        highlights: t.faunaHighlights,
        images: [
          '/images/fauna/main.jpg',
          '/images/fauna/WhatsApp Image 2026-03-29 at 09.18.36 (1).jpeg',
          '/images/fauna/WhatsApp Image 2026-03-29 at 09.18.38 (1).jpeg',
          '/images/fauna/WhatsApp Image 2026-03-29 at 09.18.39 (2).jpeg'
        ],
        travelTimes: { grandBaie: '1h 30m', flicEnFlac: '55m', portLouis: '1h 05m' },
        stories: t.faunaStories
      },
      catamaran: {
        title: t.catamaranSpeedBoat,
        description: t.catamaranDesc,
        highlights: t.catamaranHighlights,
        images: [
          '/images/catamaran-speed-boat/speedboat.jpg',
          '/images/catamaran-speed-boat/island-tour.jpg',
          '/images/catamaran-speed-boat/444-.jpg',
          '/images/catamaran-speed-boat/Summer-Wings-Cruise-South-East-Mauritius.webp'
        ],
        travelTimes: { grandBaie: '1h 10m', flicEnFlac: '30m', portLouis: '50m' },
        stories: t.catamaranStories
      },
      'big-game-fishing': {
        title: t.bigGameFishing,
        description: t.bigGameFishingDesc,
        highlights: t.bigGameFishingHighlights,
        images: [
          '/images/big-game-fishing/main.jpg',
          '/images/big-game-fishing/big-game-fishing.jpg',
          '/images/big-game-fishing/5fd45095a868b007b05013834dba7a95_XL.jpg',
          '/images/big-game-fishing/9fda742d-ad91-4b59-83a6-9aaca3ceedd4.JPG'
        ],
        travelTimes: { grandBaie: '20m', flicEnFlac: '15m', portLouis: '35m' },
        stories: t.bigGameFishingStories
      },
      frontier: {
        title: t.frontierSpiritAdventures,
        description: t.frontierSpiritDesc,
        highlights: t.frontierSpiritHighlights,
        images: [
          '/images/spirit-adventure/sightseeing-tour.jpg',
          '/images/spirit-adventure/jj.jpg',
          '/images/spirit-adventure/WhatsApp Image 2026-03-29 at 09.17.19 (1).jpeg',
          '/images/spirit-adventure/WhatsApp Image 2026-03-29 at 09.17.20.jpeg'
        ],
        travelTimes: { grandBaie: '30m', flicEnFlac: '55m', portLouis: '15m' },
        stories: t.frontierStories
      }
    }),
    [t]
  )

  const data = activity in activities ? activities[activity as ActivityKey] : undefined
  if (!data) return null

  const galleryPreview = data.images.slice(1, 4)

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      onClick={onClose}
    >
      <div
        className="scrollbar-hidden relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[260px] overflow-hidden rounded-t-[32px] bg-[#edf7f5] lg:rounded-l-[32px] lg:rounded-tr-none">
            <button type="button" onClick={() => onPreviewImage(data.images[0])} className="block h-full w-full text-left">
              <img src={data.images[0]} alt={data.title} className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                {t.viewedToday.replace('{n}', String(viewsToday))}
              </span>
              <h2 className="mt-3 text-3xl font-bold leading-tight">{data.title}</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/90">{data.description}</p>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">{t.highlightsTitle}</h3>
              <ul className="space-y-3">
                {data.highlights.slice(0, 4).map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-teal-500" />
                    <span className="text-sm leading-6 text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-[#f5faf9] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-teal-600">{t.fromGrandBaie}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{data.travelTimes.grandBaie}</p>
              </div>
              <div className="rounded-2xl bg-[#f9f7ef] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-600">{t.fromFlicEnFlac}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{data.travelTimes.flicEnFlac}</p>
              </div>
              <div className="rounded-2xl bg-[#f2f7ff] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-600">{t.fromPortLouis}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">{data.travelTimes.portLouis}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {galleryPreview.map((image, index) => (
                <button type="button" key={`${image}-${index}`} onClick={() => onPreviewImage(image)} className="block text-left">
                  <img
                    src={image}
                    alt={`${data.title} ${index + 2}`}
                    className="aspect-square rounded-2xl bg-[#edf7f5] object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-6 sm:px-7">
          <div className="mb-5 grid gap-3 md:grid-cols-2">
            {data.stories.slice(0, 2).map((story) => (
              <div key={story.title} className="rounded-2xl border border-teal-100 bg-teal-50/55 p-4">
                <p className="mb-2 font-semibold text-gray-900">{story.title}</p>
                <p className="text-sm leading-6 text-gray-600">{story.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{t.readyToBook}</p>
              <p className="text-sm text-gray-500">{t.readyToBookText}</p>
            </div>
            <Button size="lg" onClick={() => onContact(data.title)} className="bg-teal-600 text-white hover:bg-teal-700">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t.contactOnWhatsApp}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
