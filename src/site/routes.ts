// Shared by the browser app and the Pages Function that writes each page's HTML for Google.
export type Lang = 'en' | 'fr' | 'ru'
export type Page = 'home' | 'tour' | 'planner' | 'transfers' | 'gallery' | 'about' | 'contact' | 'notfound'

export interface Route {
  lang: Lang
  page: Page
  slug?: string
  galleryPage?: number
}

const PAGE_PATHS: Record<Exclude<Page, 'home' | 'tour' | 'notfound'>, string> = {
  planner: 'tour-planner',
  transfers: 'transfers',
  gallery: 'gallery',
  about: 'about',
  contact: 'contact',
}
const BY_PATH = Object.fromEntries(Object.entries(PAGE_PATHS).map(([page, path]) => [path, page])) as Record<string, Page>

export function parseRoute(pathname: string, search = ''): Route {
  const parts = pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
  let lang: Lang = 'en'
  if (parts[0] === 'fr' || parts[0] === 'ru') lang = parts.shift() as Lang
  if (parts.length === 0) return { lang, page: 'home' }
  if (parts[0] === 'tours' && parts.length === 2 && /^[a-z0-9-]+$/.test(parts[1])) return { lang, page: 'tour', slug: parts[1] }
  if (parts.length === 1 && BY_PATH[parts[0]]) {
    const page = BY_PATH[parts[0]]
    if (page === 'gallery') {
      const n = Number(new URLSearchParams(search).get('page'))
      return { lang, page, galleryPage: Number.isInteger(n) && n > 1 ? n : 1 }
    }
    return { lang, page }
  }
  return { lang, page: 'notfound' }
}

export function pathFor(route: Omit<Route, 'lang'> & { lang: Lang }): string {
  const prefix = route.lang === 'en' ? '' : `/${route.lang}`
  if (route.page === 'home' || route.page === 'notfound') return prefix ? `${prefix}/` : '/'
  if (route.page === 'tour') return `${prefix}/tours/${route.slug}`
  const base = `${prefix}/${PAGE_PATHS[route.page]}`
  return route.page === 'gallery' && route.galleryPage && route.galleryPage > 1 ? `${base}?page=${route.galleryPage}` : base
}

export const SITE_PAGES: Exclude<Page, 'tour' | 'notfound'>[] = ['home', 'planner', 'transfers', 'gallery', 'about', 'contact']
