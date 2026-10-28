import type { Env, Lang } from './env'
import { LANGS } from './env'
import { HttpError } from './http'

export const CATEGORIES = ['land', 'sea', 'adventure'] as const
export const STATUSES = ['draft', 'published', 'archived'] as const

export interface TourText {
  name: string
  summary: string
  description: string
  stops: string[]
  included: string[]
  extras: string[]
  meta_title: string
  meta_description: string
}

export interface TourInput {
  slug: string
  category: (typeof CATEGORIES)[number]
  status: (typeof STATUSES)[number]
  price_mode: 'fixed' | 'on_request'
  price_adult_eur: number | null // cents
  price_child_eur: number | null // cents
  start_time: string | null
  end_time: string | null
  media_ids: string[]
  translations: Partial<Record<Lang, TourText>>
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const text = (value: unknown, max: number, field: string): string => {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw new HttpError(400, `${field} must be text`)
  const trimmed = value.trim()
  if (trimmed.length > max) throw new HttpError(400, `${field} is too long (max ${max} characters)`)
  return trimmed
}

const list = (value: unknown, field: string): string[] => {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) throw new HttpError(400, `${field} must be a list`)
  if (value.length > 30) throw new HttpError(400, `${field} has too many items (max 30)`)
  return value.map((item, index) => text(item, 200, `${field} item ${index + 1}`)).filter(Boolean)
}

// Admin enters whole or decimal euros; we store cents.
const euros = (value: unknown, field: string): number | null => {
  if (value === undefined || value === null || value === '') return null
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0 || amount > 100_000) throw new HttpError(400, `${field} must be a price between 0 and 100,000`)
  return Math.round(amount * 100)
}

const time = (value: unknown, field: string): string | null => {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || !TIME.test(value)) throw new HttpError(400, `${field} must look like 09:00`)
  return value
}

export function validateTour(body: Record<string, unknown>): TourInput {
  const rawTranslations = (body.translations ?? {}) as Record<string, Record<string, unknown>>
  const translations: TourInput['translations'] = {}
  for (const lang of LANGS) {
    const raw = rawTranslations[lang]
    if (!raw) continue
    const label = lang.toUpperCase()
    const entry: TourText = {
      name: text(raw.name, 120, `${label} name`),
      summary: text(raw.summary, 300, `${label} short description`),
      description: text(raw.description, 4000, `${label} description`),
      stops: list(raw.stops, `${label} stops`),
      included: list(raw.included, `${label} what's included`),
      extras: list(raw.extras, `${label} extras`),
      meta_title: text(raw.meta_title, 70, `${label} Google title`),
      meta_description: text(raw.meta_description, 170, `${label} Google description`),
    }
    // A language with no name is treated as "not translated yet" and falls back to English.
    if (entry.name) translations[lang] = entry
  }
  if (!translations.en?.name) throw new HttpError(400, 'The English name is required')

  const slug = text(body.slug, 80, 'Web address') || slugify(translations.en.name)
  if (!SLUG.test(slug)) throw new HttpError(400, 'Web address may only use lowercase letters, numbers and dashes')

  const category = body.category as TourInput['category']
  if (!CATEGORIES.includes(category)) throw new HttpError(400, 'Choose a category')
  const status = (body.status ?? 'draft') as TourInput['status']
  if (!STATUSES.includes(status)) throw new HttpError(400, 'Unknown status')

  const price_mode = body.price_mode === 'fixed' ? 'fixed' : 'on_request'
  const price_adult_eur = euros(body.price_adult_eur, 'Adult price')
  const price_child_eur = euros(body.price_child_eur, 'Child price')
  if (price_mode === 'fixed' && price_adult_eur === null) throw new HttpError(400, 'Enter the adult price, or choose "Price on request"')

  const media_ids = Array.isArray(body.media_ids) ? body.media_ids.filter((id): id is string => typeof id === 'string').slice(0, 20) : []

  return {
    slug,
    category,
    status,
    price_mode,
    price_adult_eur: price_mode === 'fixed' ? price_adult_eur : null,
    price_child_eur: price_mode === 'fixed' ? price_child_eur : null,
    start_time: time(body.start_time, 'Start time'),
    end_time: time(body.end_time, 'End time'),
    media_ids,
    translations,
  }
}

interface TourRow {
  id: number
  slug: string
  category: string
  status: string
  sort_order: number
  price_mode: string
  price_adult_eur: number | null
  price_child_eur: number | null
  start_time: string | null
  end_time: string | null
  cover_media_id: string | null
  updated_at: number
  updated_by_name: string | null
}

interface TranslationRow {
  tour_id: number
  lang: Lang
  name: string
  summary: string
  description: string
  stops: string
  included: string
  extras: string
  meta_title: string
  meta_description: string
}

export async function loadTours(env: Env, where: { id?: number; publishedOnly?: boolean; includeArchived?: boolean } = {}) {
  const conditions: string[] = []
  const params: unknown[] = []
  if (where.id !== undefined) {
    conditions.push(`tours.id = ?${params.length + 1}`)
    params.push(where.id)
  }
  if (where.publishedOnly) conditions.push("tours.status = 'published'")
  else if (!where.includeArchived && where.id === undefined) conditions.push("tours.status != 'archived'")
  const filter = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [tours, texts, media] = await env.DB.batch([
    env.DB.prepare(
      `SELECT tours.*, admins.name AS updated_by_name FROM tours
       LEFT JOIN admins ON admins.id = tours.updated_by ${filter} ORDER BY tours.sort_order, tours.id`,
    ).bind(...params),
    env.DB.prepare(
      `SELECT tour_translations.* FROM tour_translations JOIN tours ON tours.id = tour_translations.tour_id ${filter}`,
    ).bind(...params),
    env.DB.prepare(
      `SELECT tour_media.tour_id, media.id, media.r2_key, media.width, media.height, media.alt_en, media.alt_fr, media.alt_ru
       FROM tour_media JOIN media ON media.id = tour_media.media_id JOIN tours ON tours.id = tour_media.tour_id
       ${filter} ORDER BY tour_media.sort_order`,
    ).bind(...params),
  ])

  const textRows = (texts.results ?? []) as unknown as TranslationRow[]
  const mediaRows = (media.results ?? []) as unknown as (MediaRef & { tour_id: number })[]

  return ((tours.results ?? []) as unknown as TourRow[]).map((tour) => ({
    ...tour,
    translations: Object.fromEntries(
      textRows
        .filter((row) => row.tour_id === tour.id)
        .map((row) => [
          row.lang,
          {
            name: row.name,
            summary: row.summary,
            description: row.description,
            stops: JSON.parse(row.stops) as string[],
            included: JSON.parse(row.included) as string[],
            extras: JSON.parse(row.extras) as string[],
            meta_title: row.meta_title,
            meta_description: row.meta_description,
          },
        ]),
    ) as Partial<Record<Lang, TourText>>,
    media: mediaRows.filter((row) => row.tour_id === tour.id).map(mediaView),
  }))
}

export interface MediaRef {
  id: string
  r2_key: string
  width: number | null
  height: number | null
  alt_en: string
  alt_fr: string
  alt_ru: string
}

export const mediaUrl = (r2Key: string) => `/media/${r2Key}`

export function mediaView(row: MediaRef) {
  return { id: row.id, url: mediaUrl(row.r2_key), width: row.width, height: row.height, alt: { en: row.alt_en, fr: row.alt_fr, ru: row.alt_ru } }
}

// Statements that write a tour's translations and photo list (tour row is written by the caller).
export async function childStatements(env: Env, tourId: number, input: TourInput): Promise<D1PreparedStatement[]> {
  if (input.media_ids.length) {
    const placeholders = input.media_ids.map((_, i) => `?${i + 1}`).join(', ')
    const found = await env.DB.prepare(`SELECT id FROM media WHERE id IN (${placeholders})`).bind(...input.media_ids).all<{ id: string }>()
    if ((found.results ?? []).length !== new Set(input.media_ids).size) throw new HttpError(400, 'One of the photos no longer exists')
  }

  const statements = [
    env.DB.prepare('DELETE FROM tour_translations WHERE tour_id = ?1').bind(tourId),
    env.DB.prepare('DELETE FROM tour_media WHERE tour_id = ?1').bind(tourId),
  ]
  for (const lang of LANGS) {
    const t = input.translations[lang]
    if (!t) continue
    statements.push(
      env.DB.prepare(
        `INSERT INTO tour_translations (tour_id, lang, name, summary, description, stops, included, extras, meta_title, meta_description)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`,
      ).bind(tourId, lang, t.name, t.summary, t.description, JSON.stringify(t.stops), JSON.stringify(t.included), JSON.stringify(t.extras), t.meta_title, t.meta_description),
    )
  }
  ;[...new Set(input.media_ids)].forEach((mediaId, index) => {
    statements.push(env.DB.prepare('INSERT INTO tour_media (tour_id, media_id, sort_order) VALUES (?1, ?2, ?3)').bind(tourId, mediaId, index))
  })
  return statements
}
