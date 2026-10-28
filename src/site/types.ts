// Shapes of the public API, shared by the app and the Pages Functions.
import type { Lang } from './i18n'

export type Category = 'land' | 'sea' | 'adventure'

export interface Image {
  id: string
  url: string
  width: number | null
  height: number | null
  alt: string
}

export interface Tour {
  slug: string
  category: Category
  price_mode: 'fixed' | 'on_request'
  price_adult_eur: number | null
  price_child_eur: number | null
  start_time: string | null
  end_time: string | null
  translated: boolean
  alternates: Lang[]
  name: string
  summary: string
  description: string
  stops: string[]
  included: string[]
  extras: string[]
  meta_title: string
  meta_description: string
  images: Image[]
}

export interface Content {
  lang: Lang
  tours: Tour[]
  blocks: {
    hero?: { eyebrow: string; title: string; travellers: string } | null
    why?: { title: string; text: string }[] | null
    about?: { title: string; paragraphs: string[] } | null
    faq?: { q: string; a: string }[] | null
  }
  settings: {
    contact?: { whatsapp: string; phone_display: string; email: string; location: string } | null
    socials?: { instagram: string; facebook: string; youtube: string; google_reviews: string } | null
    currency?: { default: 'EUR'; usd_per_eur: number | null; mur_per_eur: number | null } | null
  }
  destinations: { slug: string; name: string; image: string | null }[]
}

export interface GalleryPage {
  page: number
  pages: number
  total: number
  items: (Omit<Image, 'alt'> & { alt: string; tour_id: number | null })[]
}

export interface Review {
  id: string | number
  name: string
  rating: number
  date: string
  text: string
  authorUrl?: string
}
