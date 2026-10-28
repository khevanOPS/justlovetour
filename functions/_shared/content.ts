import { HttpError } from './http'

// Shapes of the editable page texts. Each validator returns a clean copy or throws.
type Validator = (value: unknown) => unknown

const str = (value: unknown, max: number, field: string): string => {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw new HttpError(400, `${field} must be text`)
  const trimmed = value.trim()
  if (trimmed.length > max) throw new HttpError(400, `${field} is too long (max ${max} characters)`)
  return trimmed
}

const arr = (value: unknown, max: number, field: string): unknown[] => {
  if (!Array.isArray(value)) throw new HttpError(400, `${field} must be a list`)
  if (value.length > max) throw new HttpError(400, `${field} has too many items (max ${max})`)
  return value
}

const obj = (value: unknown, field: string): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, `${field} is missing`)
  return value as Record<string, unknown>
}

export const CONTENT_BLOCKS: Record<string, Validator> = {
  hero: (value) => {
    const v = obj(value, 'Hero')
    return { eyebrow: str(v.eyebrow, 80, 'Small line'), title: str(v.title, 120, 'Headline'), travellers: str(v.travellers, 20, 'Travellers count') }
  },
  why: (value) =>
    arr(value, 6, 'Why us').map((item, i) => {
      const v = obj(item, `Point ${i + 1}`)
      return { title: str(v.title, 60, `Point ${i + 1} title`), text: str(v.text, 160, `Point ${i + 1} text`) }
    }),
  about: (value) => {
    const v = obj(value, 'About')
    return { title: str(v.title, 120, 'Title'), paragraphs: arr(v.paragraphs, 8, 'Paragraphs').map((p, i) => str(p, 1500, `Paragraph ${i + 1}`)).filter(Boolean) }
  },
  faq: (value) =>
    arr(value, 20, 'Questions')
      .map((item, i) => {
        const v = obj(item, `Question ${i + 1}`)
        return { q: str(v.q, 200, `Question ${i + 1}`), a: str(v.a, 1500, `Answer ${i + 1}`) }
      })
      .filter((item) => item.q && item.a),
}

const url = (value: unknown, field: string): string => {
  const text = str(value, 300, field)
  if (!text) return ''
  if (!/^https:\/\/[^\s]+$/.test(text)) throw new HttpError(400, `${field} must be a full link starting with https://`)
  return text
}

const rate = (value: unknown, field: string): number | null => {
  if (value === undefined || value === null || value === '') return null
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0 || n > 100_000) throw new HttpError(400, `${field} must be a positive number`)
  return n
}

export const SETTINGS: Record<string, Validator> = {
  contact: (value) => {
    const v = obj(value, 'Contact details')
    const whatsapp = str(v.whatsapp, 20, 'WhatsApp number').replace(/[\s-]/g, '')
    if (whatsapp && !/^\+\d{7,15}$/.test(whatsapp)) throw new HttpError(400, 'WhatsApp number must start with + and the country code, e.g. +23058342797')
    const email = str(v.email, 120, 'Email')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Email address looks wrong')
    return { whatsapp, phone_display: str(v.phone_display, 30, 'Phone'), email, location: str(v.location, 120, 'Location') }
  },
  socials: (value) => {
    const v = obj(value, 'Social links')
    return { instagram: url(v.instagram, 'Instagram'), facebook: url(v.facebook, 'Facebook'), youtube: url(v.youtube, 'YouTube'), google_reviews: url(v.google_reviews, 'Google reviews') }
  },
  currency: (value) => {
    const v = obj(value, 'Currency')
    return { default: 'EUR', usd_per_eur: rate(v.usd_per_eur, 'US dollar rate'), mur_per_eur: rate(v.mur_per_eur, 'Mauritian rupee rate') }
  },
}
