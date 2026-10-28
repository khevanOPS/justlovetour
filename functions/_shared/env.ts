export interface Env {
  DB: D1Database
  MEDIA: R2Bucket
  MEDIA_QUOTA_BYTES?: string
  GOOGLE_PLACES_API_KEY?: string
  GOOGLE_PLACE_ID?: string
}

export interface Admin {
  id: number
  email: string
  name: string
}

// Data the admin middleware hands to every /api/admin handler.
export interface AdminData extends Record<string, unknown> {
  admin: Admin
  ip: string
}

export const LANGS = ['en', 'fr', 'ru'] as const
export type Lang = (typeof LANGS)[number]
export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang)
