import { useEffect, useRef, useState } from 'react'
import { BadgeEuro, Car, ChevronLeft, ChevronRight, Compass, MapPin, Plane, Sparkles, Star, Utensils } from 'lucide-react'
import { fetchGallery, useReviews, type Category, type GalleryPage, type Tour } from '../data'
import { linkClick, useSite, whatsappUrl } from '../lib'
import { pathFor, type Route } from '../routes'
import { BackgroundVideo, Chip, Eyebrow, Price, SectionTitle, TourImage, TourRow } from '../ui'

export default function Home() {
  return (
    <>
      <Hero />
      <VideoBanner />
      <Experiences />
      <Why />
      <Reviews />
      <PlanYourStay />
      <GalleryPreview />
      <Faq />
      <Closing />
    </>
  )
}

function Hero() {
  const { lang, t, content } = useSite()
  const hero = content.blocks.hero
  const googleReviews = content.settings.socials?.google_reviews
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const tours = content.tours

  const cardStep = () => {
    const cards = scroller.current?.querySelectorAll('li')
    return cards && cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 312
  }
  const goTo = (index: number) => {
    const el = scroller.current
    if (!el) return
    const target = Math.max(0, Math.min(tours.length - 1, index))
    el.scrollTo({ left: target * cardStep(), behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = scroller.current
    if (!el) return
    // At the far right the last cards can't snap to the start, so count that as the last card.
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setActive(atEnd ? tours.length - 1 : Math.round(el.scrollLeft / cardStep()))
  }

  const arrow = 'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-800 shadow-md hover:bg-teal-50 disabled:opacity-40'

  return (
    <section aria-labelledby="hero-title">
      <div className="bg-[#134e4a] px-4 pb-[76px] pt-4 text-white md:pb-24 md:pt-10">
        <div className="mx-auto max-w-6xl space-y-4">
          <Eyebrow light>{hero?.eyebrow || t.heroEyebrow}</Eyebrow>
          <h1 id="hero-title" className="max-w-2xl font-serif text-[34px] font-bold leading-[1.12] md:text-6xl">
            {hero?.title || t.heroTitle}
          </h1>
          {hero?.travellers && (
            <p className="text-[13px] text-white/85 md:text-base">
              {t.travellers(hero.travellers)}{' '}
              {googleReviews ? (
                <a href={googleReviews} target="_blank" rel="noopener" className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white">
                  Google
                </a>
              ) : (
                'Google'
              )}
            </p>
          )}
        </div>
      </div>

      <div className="relative mx-auto -mt-[56px] max-w-6xl md:-mt-16">
        <div ref={scroller} onScroll={onScroll} className="no-scrollbar snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 pb-4">
          <ul className="flex gap-3 md:gap-4" aria-label={t.experiencesTitle}>
            {tours.map((tour, index) => (
              <HeroCard key={tour.slug} tour={tour} eager={index < 2} />
            ))}
          </ul>
        </div>
        {tours.length > 3 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between md:flex">
            <button type="button" aria-label={t.prevTour} onClick={() => goTo(active - 3)} className={`pointer-events-auto -ml-5 h-12 w-12 ${arrow}`}>
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button type="button" aria-label={t.nextTour} onClick={() => goTo(active + 3)} className={`pointer-events-auto -mr-5 h-12 w-12 ${arrow}`}>
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        )}
        {tours.length > 1 && (
          <div className="flex items-center justify-between gap-3 px-4 pb-2 md:hidden">
            <button type="button" aria-label={t.prevTour} disabled={active === 0} onClick={() => goTo(active - 1)} className={arrow}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex flex-wrap justify-center gap-0.5">
              {tours.map((tour, index) => (
                <button key={tour.slug} type="button" aria-label={t.showTour(index + 1)} aria-current={index === active ? 'true' : undefined} onClick={() => goTo(index)} className="flex h-6 w-5 items-center justify-center">
                  <span className={`block h-2 rounded-full transition-all ${index === active ? 'w-5 bg-teal-600' : 'w-2 bg-slate-300'}`} />
                </button>
              ))}
            </div>
            <button type="button" aria-label={t.nextTour} disabled={active >= tours.length - 1} onClick={() => goTo(active + 1)} className={arrow}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="mx-auto flex max-w-6xl gap-2.5 px-4 pt-1 md:max-w-md md:pt-3">
        {([
          { page: 'planner', label: t.planTrip, icon: Compass },
          { page: 'transfers', label: t.airportTransfer, icon: Plane },
        ] as const).map(({ page, label, icon: Icon }) => {
          const route: Route = { lang, page }
          return (
            <a key={page} href={pathFor(route)} onClick={linkClick(route)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[14px] border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:border-teal-600">
              <Icon className="h-4 w-4 text-teal-600" aria-hidden="true" />
              {label}
            </a>
          )
        })}
      </div>
    </section>
  )
}

function HeroCard({ tour, eager }: { tour: Tour; eager: boolean }) {
  const { lang, t } = useSite()
  const route: Route = { lang, page: 'tour', slug: tour.slug }
  const href = pathFor(route)
  return (
    <li className="w-[78vw] max-w-[300px] shrink-0 snap-start md:w-[calc((100%-2rem)/3)] md:max-w-none">
      <article className="overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <a href={href} onClick={linkClick(route, { keepScroll: true })} className="block">
          <TourImage image={tour.images[0]} className="block h-[200px] w-full md:h-56" eager={eager} sizes="(min-width: 768px) 33vw, 78vw" />
        </a>
        <div className="flex flex-col gap-2 px-4 pb-4 pt-3.5">
          <h2 className="font-serif text-[21px] font-bold leading-tight">
            <a href={href} onClick={linkClick(route, { keepScroll: true })} className="hover:text-teal-700">
              {tour.name}
            </a>
          </h2>
          <Price tour={tour} />
          <a
            href={`${href}#book`}
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey) return
              event.preventDefault()
              // The tour sheet opens straight on the booking form when the address ends in #book.
              window.history.pushState({ keepScroll: true }, '', `${href}#book`)
              window.dispatchEvent(new Event('jlt:navigate'))
            }}
            className="flex h-11 items-center justify-center rounded-xl bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700"
          >
            {t.bookViaWhatsApp}
          </a>
        </div>
      </article>
    </li>
  )
}

function VideoBanner() {
  const { t } = useSite()
  return (
    <section aria-labelledby="video-title" className="mx-auto max-w-6xl px-4 pt-10 md:pt-16">
      <div className="relative h-[260px] overflow-hidden rounded-3xl bg-[#0e7490] md:h-[420px]">
        <BackgroundVideo className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent p-5 text-white md:p-10">
          <h2 id="video-title" className="max-w-lg font-serif text-[26px] font-bold leading-tight md:text-5xl">{t.videoTitle}</h2>
          <p className="max-w-md text-sm text-white/90 md:text-lg">{t.videoText}</p>
          <a
            href="#activities"
            onClick={(event) => {
              event.preventDefault()
              document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="mt-2 inline-flex h-11 w-fit items-center rounded-xl bg-white px-5 text-sm font-semibold text-teal-800 hover:bg-teal-50"
          >
            {t.videoCta} →
          </a>
        </div>
      </div>
    </section>
  )
}

const MOBILE_LIMIT = 6

function Experiences() {
  const { t, content } = useSite()
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [expanded, setExpanded] = useState(false)
  const present = (['land', 'sea', 'adventure'] as const).filter((c) => content.tours.some((tour) => tour.category === c))
  const list = content.tours.filter((tour) => category === 'all' || tour.category === category)
  const collapsed = !expanded && list.length > MOBILE_LIMIT

  return (
    <section id="activities" aria-labelledby="activities-title" className="mx-auto max-w-6xl scroll-mt-20 space-y-4 px-4 pt-12 md:pt-20">
      <Eyebrow>{t.experiencesEyebrow}</Eyebrow>
      <div id="activities-title">
        <SectionTitle>{t.experiencesTitle}</SectionTitle>
      </div>
      {present.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {(['all', ...present] as const).map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {t.categories[c]}
            </Chip>
          ))}
        </div>
      )}
      <ul className="grid gap-3 md:grid-cols-3 md:gap-5">
        {list.map((tour, index) => (
          <li key={tour.slug} className={collapsed && index >= MOBILE_LIMIT ? 'hidden md:block' : undefined}>
            <TourRow tour={tour} />
          </li>
        ))}
      </ul>
      {collapsed && (
        <button type="button" onClick={() => setExpanded(true)} className="flex h-12 w-full items-center justify-center rounded-[14px] border border-teal-600 text-sm font-semibold text-teal-700 md:hidden">
          {t.showAll(list.length)}
        </button>
      )}
    </section>
  )
}

const WHY_ICONS = [MapPin, Car, Utensils, BadgeEuro, Sparkles, Star]

function Why() {
  const { t, content } = useSite()
  const points = content.blocks.why ?? []
  if (!points.length) return null
  return (
    <section aria-labelledby="why-title" className="mx-auto max-w-6xl space-y-4 px-4 pt-12 md:pt-20">
      <Eyebrow>{t.whyEyebrow}</Eyebrow>
      <div id="why-title">
        <SectionTitle>{t.whyTitle}</SectionTitle>
      </div>
      <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-4">
        {points.map((point, index) => {
          const Icon = WHY_ICONS[index % WHY_ICONS.length]
          return (
            <li key={index} className="flex flex-col gap-1.5 rounded-2xl bg-white p-3.5 md:p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-teal-100 text-teal-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold md:text-base">{point.title}</span>
              <span className="text-xs leading-snug text-slate-600 md:text-sm">{point.text}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function Reviews({ compact = false }: { compact?: boolean }) {
  const { t, content } = useSite()
  const reviews = useReviews()
  const googleUrl = content.settings.socials?.google_reviews
  if (!reviews.length && !googleUrl) return null
  return (
    <section aria-labelledby="reviews-title" className={`mx-auto max-w-6xl space-y-4 ${compact ? 'px-4 pt-10' : 'pt-12 md:px-4 md:pt-20'}`}>
      <div className={`space-y-4 ${compact ? '' : 'px-4 md:px-0'}`}>
        {!compact && <Eyebrow>{t.reviewsEyebrow}</Eyebrow>}
        <div id="reviews-title">
          <SectionTitle>{t.reviewsTitle}</SectionTitle>
        </div>
      </div>
      {reviews.length > 0 && (
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {reviews.slice(0, 6).map((review) => (
            <li key={review.id} className="flex w-[80vw] max-w-[300px] shrink-0 snap-start flex-col gap-2 rounded-[18px] bg-white p-4 md:w-auto md:max-w-none">
              <span className="text-[15px] text-amber-500" aria-label={`${review.rating} / 5`}>
                {'★★★★★'.slice(0, Math.round(review.rating))}
              </span>
              <p className="line-clamp-6 text-sm leading-relaxed text-slate-700">{review.text}</p>
              <p className="mt-auto text-[13px] font-semibold">
                {review.name} <span className="font-normal text-slate-500">· Google{review.date ? ` · ${review.date}` : ''}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
      {googleUrl && (
        <a href={googleUrl} target="_blank" rel="noopener" className={`inline-flex min-h-11 items-center text-sm font-semibold text-teal-700 hover:underline ${compact ? '' : 'mx-4 md:mx-0'}`}>
          {t.readReviews} →
        </a>
      )}
    </section>
  )
}

function PlanYourStay() {
  const { lang, t, content } = useSite()
  const image = (slugs: string[], fallbackIndex: number) =>
    slugs.map((slug) => content.tours.find((tour) => tour.slug === slug)?.images[0]).find(Boolean) ?? content.tours.find((tour, i) => i >= fallbackIndex && tour.images[0])?.images[0]
  const cards = [
    { page: 'planner' as const, title: t.planTrip, text: t.planCardText, image: image(['personalised-tours', 'la-route-du-the', 'hiking'], 0) },
    { page: 'transfers' as const, title: t.transferCardTitle, text: t.transferCardText, image: image(['catamaran-speed-boat', 'ile-aux-cerfs-5-islands'], 1) },
  ]
  return (
    <section aria-labelledby="plan-title" className="mx-auto max-w-6xl space-y-4 px-4 pt-12 md:pt-20">
      <Eyebrow>{t.planEyebrow}</Eyebrow>
      <h2 id="plan-title" className="sr-only">{t.planEyebrow}</h2>
      <div className="grid gap-3 md:grid-cols-2 md:gap-5">
        {cards.map((card) => {
          const route: Route = { lang, page: card.page }
          return (
            <a key={card.page} href={pathFor(route)} onClick={linkClick(route)} className="group relative block h-[150px] overflow-hidden rounded-[20px] md:h-56">
              <TourImage image={card.image ? { ...card.image, alt: '' } : undefined} className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" />
              <span className="absolute inset-0 flex flex-col justify-end gap-1 bg-gradient-to-r from-[#134e4a]/90 to-[#134e4a]/20 p-5 text-white">
                <span className="font-serif text-[22px] font-bold md:text-3xl">{card.title}</span>
                <span className="text-[13px] md:text-base">{card.text} →</span>
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}

function GalleryPreview() {
  const { lang, t } = useSite()
  const [gallery, setGallery] = useState<GalleryPage | null>(null)
  useEffect(() => {
    let alive = true
    fetchGallery(lang, 1, 6)
      .then((page) => alive && setGallery(page))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [lang])
  if (gallery && !gallery.items.length) return null
  const route: Route = { lang, page: 'gallery' }
  return (
    <section aria-labelledby="gallery-title" className="mx-auto max-w-6xl space-y-4 px-4 pt-12 md:pt-20">
      <Eyebrow>{t.galleryEyebrow}</Eyebrow>
      <div id="gallery-title">
        <SectionTitle>{t.galleryTitle}</SectionTitle>
      </div>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {(gallery?.items ?? Array.from({ length: 6 }, () => null)).map((item, index) => (
          <li key={item?.id ?? index}>
            {item ? (
              <a href={pathFor(route)} onClick={linkClick(route)} className="block overflow-hidden rounded-xl">
                <img src={item.url} alt={item.alt} width={item.width ?? undefined} height={item.height ?? undefined} loading="lazy" decoding="async" className="h-[120px] w-full object-cover transition duration-500 hover:scale-105 md:h-56" />
              </a>
            ) : (
              <div className="h-[120px] animate-pulse rounded-xl bg-slate-200 md:h-56" />
            )}
          </li>
        ))}
      </ul>
      <a href={pathFor(route)} onClick={linkClick(route)} className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-700 hover:underline">
        {t.seeAllPhotos} →
      </a>
    </section>
  )
}

export function Faq() {
  const { t, content } = useSite()
  const items = (content.blocks.faq ?? []).filter((item) => item.q && item.a)
  if (!items.length) return null
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-3xl space-y-4 px-4 pt-12 md:pt-20">
      <Eyebrow>{t.faqEyebrow}</Eyebrow>
      <div id="faq-title">
        <SectionTitle>{t.faqTitle}</SectionTitle>
      </div>
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <details key={index} className="group rounded-[14px] bg-white">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="text-xl text-teal-600 transition group-open:rotate-45">+</span>
            </summary>
            <p className="whitespace-pre-line px-4 pb-4 text-sm leading-relaxed text-slate-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Closing() {
  const { t, content } = useSite()
  return (
    <section className="mt-12 bg-teal-600 px-4 py-10 text-center text-white md:mt-20 md:py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
        <h2 className="font-serif text-[28px] font-bold md:text-4xl">{t.closingTitle}</h2>
        <p className="text-[15px] text-teal-50">{t.closingText}</p>
        <a href={whatsappUrl(content)} target="_blank" rel="noopener" className="mt-2 flex h-[50px] w-full items-center justify-center rounded-[14px] bg-white font-semibold text-teal-700 hover:bg-teal-50 md:w-72">
          {t.chatWhatsApp}
        </a>
      </div>
    </section>
  )
}
