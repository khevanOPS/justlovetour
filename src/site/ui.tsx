import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Minus, Pause, Play, Plus, X } from 'lucide-react'
import type { Image, Tour } from './data'
import { linkClick, priceLabel, useSite } from './lib'
import { pathFor } from './routes'

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-teal-100' : 'text-teal-600'}`}>{children}</p>
}

export function SectionTitle({ children, as: Tag = 'h2' }: { children: ReactNode; as?: 'h1' | 'h2' }) {
  return <Tag className="font-serif text-[28px] font-bold leading-tight text-slate-900 md:text-4xl">{children}</Tag>
}

// The green band under the header on inner pages.
export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="bg-[#134e4a] px-4 pb-10 pt-6 text-white md:pb-14 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-[34px] font-bold leading-tight md:text-5xl">{title}</h1>
        {intro && <p className="mt-2 max-w-xl text-[15px] text-white/85 md:text-lg">{intro}</p>}
      </div>
    </div>
  )
}

export function TourImage({ image, className, eager = false, sizes }: { image?: Image; className: string; eager?: boolean; sizes?: string }) {
  if (!image) return <div aria-hidden="true" className={`${className} bg-gradient-to-br from-teal-700 to-emerald-400`} />
  return (
    <img
      src={image.url}
      alt={image.alt}
      width={image.width ?? undefined}
      height={image.height ?? undefined}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      sizes={sizes}
      className={`${className} bg-slate-200 object-cover`}
    />
  )
}

export function Price({ tour, large = false }: { tour: Tour; large?: boolean }) {
  const site = useSite()
  const { main, sub } = priceLabel(tour, site)
  return (
    <span className={`font-bold text-teal-700 ${large ? 'text-2xl' : 'text-base'}`}>
      {main}
      {sub && <span className={`ml-1 font-normal text-slate-500 ${large ? 'text-sm' : 'text-[13px]'}`}>{sub}</span>}
    </span>
  )
}

// Compact list card used in "All experiences" on phones and the planner.
export function TourRow({ tour }: { tour: Tour }) {
  const { lang, t } = useSite()
  const route = { lang, page: 'tour' as const, slug: tour.slug }
  return (
    <a href={pathFor(route)} onClick={linkClick(route, { keepScroll: true })} className="flex gap-3 rounded-[18px] bg-white p-2.5 shadow-[0_6px_18px_rgba(15,23,42,0.06)] transition hover:shadow-md md:flex-col md:gap-0 md:overflow-hidden md:p-0">
      <TourImage image={tour.images[0]} className="h-24 w-24 shrink-0 rounded-xl md:h-52 md:w-full md:rounded-none" sizes="(min-width: 768px) 33vw, 96px" />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 md:p-4">
        <span className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{t.categoryOne[tour.category]}</span>
        <span className="text-base font-semibold leading-snug text-slate-900 md:font-serif md:text-xl">{tour.name}</span>
        <Price tour={tour} />
        <span className="text-[13px] font-semibold text-teal-600">{t.detailsBook} →</span>
      </div>
    </a>
  )
}

export function Stepper({ label, value, onChange, min = 0, max = 30, required = false }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; required?: boolean }) {
  const { t } = useSite()
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2">
      <span className="text-[15px] font-medium text-slate-800" id={`${label}-label`}>
        {label}
        {required && ' *'}
      </span>
      <div className="flex items-center gap-1" role="group" aria-labelledby={`${label}-label`}>
        <button type="button" aria-label={t.decrease(label)} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:bg-slate-100 disabled:opacity-30">
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-9 text-center text-lg font-semibold tabular-nums">{value}</output>
        <button type="button" aria-label={t.increase(label)} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 active:bg-slate-100 disabled:opacity-30">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function Field({ label, id, required = false, children, hint }: { label: string; id: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export const inputClass = 'block h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30'

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 rounded-full px-4 text-sm font-medium transition ${active ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:border-teal-600'}`}>
      {children}
    </button>
  )
}

export function PrimaryButton({ children, onClick, type = 'button', className = '' }: { children: ReactNode; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return (
    <button type={type} onClick={onClick} className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 text-[15px] font-semibold text-white transition hover:bg-teal-700 active:bg-teal-800 ${className}`}>
      {children}
    </button>
  )
}

// Bottom sheet on phones, floating card on bigger screens.
export function Sheet({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const { t } = useSite()
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/55 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          // Focus the sheet itself rather than the close button, so no focus ring flashes on open.
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            ;(event.currentTarget as HTMLElement).focus()
          }}
          tabIndex={-1}
          className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[88vh] md:w-[calc(100%-4rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[28px] md:data-[state=open]:zoom-in-95 md:data-[state=open]:slide-in-from-bottom-0 ${wide ? 'md:max-w-4xl' : 'md:max-w-lg'}`}
        >
          <Dialog.Title asChild>
            <span className="sr-only">{title}</span>
          </Dialog.Title>
          <div className="mx-auto mt-2.5 h-1.5 w-11 shrink-0 rounded-full bg-slate-300 md:hidden" aria-hidden="true" />
          <Dialog.Close aria-label={t.close} className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-white">
            <X className="h-5 w-5" aria-hidden="true" />
          </Dialog.Close>
          <div className="overflow-y-auto overscroll-contain">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// Muted looping video that only downloads once it is near the screen. Phones get the lighter 720p file.
// Visitors who prefer reduced motion see the still photo until they press play.
export function BackgroundVideo({ className = '', controls = false }: { className?: string; controls?: boolean }) {
  const { t } = useSite()
  const ref = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const pausedRef = useRef(paused)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    // React does not write the muted attribute, and Safari refuses to autoplay without it.
    video.defaultMuted = true
    video.muted = true
    video.setAttribute('muted', '')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload !== 'auto') {
            video.preload = 'auto'
            video.load()
          }
          if (!pausedRef.current) video.play().catch(() => {})
        } else video.pause()
      },
      { rootMargin: '200px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (paused) {
      video.preload = 'auto'
      video.play().catch(() => {})
    } else video.pause()
    pausedRef.current = !paused
    setPaused(!paused)
  }

  return (
    <>
      <video ref={ref} muted autoPlay={!paused} loop playsInline preload="none" poster="/videos/boat-poster.jpg" aria-hidden="true" tabIndex={-1} className={`pointer-events-none object-cover ${className}`}>
        <source src="/videos/boat-1280.mp4" type="video/mp4" media="(min-width: 768px)" />
        <source src="/videos/boat-720.mp4" type="video/mp4" />
      </video>
      {controls && (
        <button type="button" onClick={toggle} aria-label={paused ? t.playBackground : t.pauseVideo} className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/45 text-white backdrop-blur hover:bg-slate-900/65">
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      )}
    </>
  )
}

export const VIDEO_CREDIT_URL = 'https://www.vecteezy.com/video/84102856-boat-towing-two-people-on-inflatable-tube-across-blue-sea'
