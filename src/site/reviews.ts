// Customer reviews, typed in by the admins (copied from Google and other sites). Shared by the website, the admin and the Pages Functions.
export const REVIEW_SOURCES = ['google', 'tripadvisor', 'facebook', 'direct'] as const
export type ReviewSource = (typeof REVIEW_SOURCES)[number]
export const REVIEW_SOURCE_LABEL: Record<ReviewSource, string> = { google: 'Google', tripadvisor: 'Tripadvisor', facebook: 'Facebook', direct: '' }

export interface ManualReview {
  id: string
  enabled: boolean
  name: string
  rating: number
  text: string
  // "2026-03" (month the review was written), or empty.
  date: string
  source: ReviewSource
}

export const REVIEW_MAX = 30
export const REVIEW_NAME_MAX = 60
export const REVIEW_TEXT_MAX = 1000
export const REVIEW_DATE = /^\d{4}-(0[1-9]|1[0-2])$/

export const newReviewId = () => Math.random().toString(36).slice(2, 10)

export function normalizeReviews(value: unknown): ManualReview[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, REVIEW_MAX).map((item, i) => {
    const r = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>
    const s = (x: unknown) => (typeof x === 'string' ? x : '')
    const rating = Math.round(Number(r.rating))
    return {
      id: s(r.id) || `r${i + 1}`,
      enabled: r.enabled !== false,
      name: s(r.name),
      rating: rating >= 1 && rating <= 5 ? rating : 5,
      text: s(r.text),
      date: REVIEW_DATE.test(s(r.date)) ? s(r.date) : '',
      source: (REVIEW_SOURCES as readonly string[]).includes(s(r.source)) ? (s(r.source) as ReviewSource) : 'google',
    }
  })
}

// "March 2026" in the visitor's language.
export function reviewMonth(date: string, lang: string): string {
  if (!REVIEW_DATE.test(date)) return ''
  const [y, m] = date.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(lang, { month: 'long', year: 'numeric', timeZone: 'UTC' })
}
