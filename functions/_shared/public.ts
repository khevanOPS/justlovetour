import { type Env, type Lang, LANGS } from './env'
import { loadTours, mediaView, type MediaRef } from './tours'

const parse = <T>(value: string | undefined, fallback: T): T => (value ? (JSON.parse(value) as T) : fallback)

// Everything the public site shows, in one language, falling back to English where untranslated.
export async function publicContent(env: Env, lang: Lang) {
  const [tours, extra] = await Promise.all([
    loadTours(env, { publishedOnly: true }),
    env.DB.batch([
      env.DB.prepare("SELECT key, lang, value FROM content_blocks WHERE lang IN (?1, 'en')").bind(lang),
      env.DB.prepare("SELECT key, value FROM settings WHERE key IN ('contact', 'socials', 'currency')"),
      env.DB.prepare(
        `SELECT transfer_destinations.slug, transfer_destinations.name_en, transfer_destinations.name_fr, transfer_destinations.name_ru, media.r2_key
         FROM transfer_destinations LEFT JOIN media ON media.id = transfer_destinations.media_id
         WHERE transfer_destinations.status = 'published' ORDER BY transfer_destinations.sort_order`,
      ),
    ]),
  ])
  const [blocksResult, settingsResult, destinationsResult] = extra

  const blockRows = (blocksResult.results ?? []) as { key: string; lang: string; value: string }[]
  const blocks: Record<string, unknown> = {}
  for (const key of new Set(blockRows.map((row) => row.key))) {
    const own = blockRows.find((row) => row.key === key && row.lang === lang)
    const english = blockRows.find((row) => row.key === key && row.lang === 'en')
    const value = parse(own?.value, null as unknown)
    const empty = value === null || (Array.isArray(value) && value.length === 0)
    blocks[key] = empty ? parse(english?.value, null) : value
  }

  const settings = Object.fromEntries(((settingsResult.results ?? []) as { key: string; value: string }[]).map((row) => [row.key, parse(row.value, null)]))

  return {
    lang,
    tours: tours.map((tour) => {
      // Field by field, so a half-translated tour still shows its English stops and description.
      const en = tour.translations.en
      const own = tour.translations[lang]
      const text = en && own
        ? (Object.fromEntries(Object.entries(en).map(([field, value]) => {
            const mine = own[field as keyof typeof own]
            const filled = Array.isArray(mine) ? mine.length > 0 : Boolean(mine)
            return [field, filled ? mine : value]
          })) as typeof en)
        : (own ?? en)
      return {
        slug: tour.slug,
        category: tour.category,
        price_mode: tour.price_mode,
        price_adult_eur: tour.price_adult_eur,
        price_child_eur: tour.price_child_eur,
        start_time: tour.start_time,
        end_time: tour.end_time,
        translated: Boolean(tour.translations[lang]),
        alternates: LANGS.filter((l) => tour.translations[l]),
        ...text,
        images: tour.media.map((image) => ({ ...image, alt: image.alt[lang] || image.alt.en || text?.name || '' })),
        updated_at: tour.updated_at,
      }
    }),
    blocks,
    settings,
    destinations: ((destinationsResult.results ?? []) as { slug: string; name_en: string; name_fr: string; name_ru: string; r2_key: string | null }[]).map((row) => ({
      slug: row.slug,
      name: (lang === 'fr' && row.name_fr) || (lang === 'ru' && row.name_ru) || row.name_en,
      image: row.r2_key ? `/media/${row.r2_key}` : null,
    })),
  }
}

export async function publicGallery(env: Env, lang: Lang, page: number, perPage: number) {
  const [count, rows] = await env.DB.batch([
    env.DB.prepare("SELECT COUNT(*) AS total FROM gallery_items WHERE status = 'published'"),
    env.DB.prepare(
      `SELECT gallery_items.tour_id, media.id, media.r2_key, media.width, media.height, media.alt_en, media.alt_fr, media.alt_ru
       FROM gallery_items JOIN media ON media.id = gallery_items.media_id
       WHERE gallery_items.status = 'published' ORDER BY gallery_items.sort_order, gallery_items.id LIMIT ?1 OFFSET ?2`,
    ).bind(perPage, (page - 1) * perPage),
  ])
  const total = ((count.results ?? [])[0] as { total: number } | undefined)?.total ?? 0
  return {
    page,
    pages: Math.max(1, Math.ceil(total / perPage)),
    total,
    items: ((rows.results ?? []) as (MediaRef & { tour_id: number | null })[]).map((row) => {
      const view = mediaView(row)
      return { ...view, tour_id: row.tour_id, alt: view.alt[lang] || view.alt.en }
    }),
  }
}
