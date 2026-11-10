export type Lang = 'en' | 'fr' | 'ru'
export const LANGS: Lang[] = ['en', 'fr', 'ru']
export const LANG_NAMES: Record<Lang, string> = { en: 'English', fr: 'French', ru: 'Russian' }

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Called when any request finds the session gone, so the app can show the sign-in screen.
let onSignedOut: () => void = () => {}
export const setSignedOutHandler = (handler: () => void) => {
  onSignedOut = handler
}

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init
  const headers = new Headers(rest.headers)
  if (json !== undefined) headers.set('Content-Type', 'application/json')
  const response = await fetch(path, { ...rest, headers, body: json !== undefined ? JSON.stringify(json) : rest.body, credentials: 'same-origin' })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith('/api/auth/login')) onSignedOut()
    throw new ApiError(response.status, (data as { error?: string }).error ?? 'Something went wrong')
  }
  return data as T
}

export const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong')

export interface MediaItem {
  id: string
  url: string
  width: number | null
  height: number | null
  alt: Record<Lang, string>
  bytes?: number
}

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

export interface Tour {
  id: number
  slug: string
  category: 'land' | 'sea' | 'adventure'
  status: 'draft' | 'published' | 'archived'
  price_mode: 'fixed' | 'on_request'
  price_adult_eur: number | null
  price_child_eur: number | null
  start_time: string | null
  end_time: string | null
  updated_at: number
  updated_by_name: string | null
  translations: Partial<Record<Lang, TourText>>
  media: MediaItem[]
}

export const CATEGORY_NAMES: Record<Tour['category'], string> = { land: 'Land tour', sea: 'Sea & islands', adventure: 'Adventure' }

export const formatEuros = (cents: number | null) => (cents === null ? '' : `€${(cents / 100).toLocaleString('en', { maximumFractionDigits: 2 })}`)

export const formatWhen = (ms: number) =>
  new Date(ms).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export const formatBytes = (bytes: number) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export const navigate = (route: string) => {
  window.location.hash = `/${route}`
}
