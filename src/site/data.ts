import { useEffect, useState } from 'react'
import type { Lang } from './i18n'
import type { Content, GalleryPage } from './types'

export type { Category, Content, GalleryPage, Image, Review, Tour } from './types'

declare global {
  interface Window {
    __JLT__?: Content
  }
}

const cache = new Map<Lang, Content>()
if (typeof window !== 'undefined' && window.__JLT__) cache.set(window.__JLT__.lang, window.__JLT__)

// The page arrives with its content already inside; switching language fetches the other one once.
export function useContent(lang: Lang): Content | null {
  const [content, setContent] = useState<Content | null>(() => cache.get(lang) ?? null)
  const [shownLang, setShownLang] = useState(lang)
  if (shownLang !== lang) {
    setShownLang(lang)
    setContent(cache.get(lang) ?? content)
  }

  useEffect(() => {
    if (cache.has(lang)) return
    let alive = true
    fetch(`/api/content?lang=${lang}`)
      .then((r) => (r.ok ? (r.json() as Promise<Content>) : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        cache.set(lang, data)
        if (alive) setContent(data)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [lang])

  return content
}

export async function fetchGallery(lang: Lang, page: number, perPage: number): Promise<GalleryPage> {
  const response = await fetch(`/api/gallery?lang=${lang}&page=${page}&per_page=${perPage}`)
  if (!response.ok) throw new Error(String(response.status))
  return response.json() as Promise<GalleryPage>
}
