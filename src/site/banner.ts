// The scrolling strip at the bottom of every page. Shared by the website, the admin and the Pages Functions.
export type BannerText = { en: string; fr: string; ru: string }
export interface BannerMessage {
  id: string
  enabled: boolean
  text: BannerText
  // A page of this site (/tours/…), a full https:// link, or tel:+230… Empty means not clickable.
  link: string
}
export interface BannerButton {
  enabled: boolean
  action: 'call' | 'whatsapp'
  label: BannerText
}
export interface Banner {
  enabled: boolean
  messages: BannerMessage[]
  button: BannerButton
}

export const BANNER_MAX_MESSAGES = 10
export const BANNER_TEXT_MAX = 160
export const BANNER_LABEL_MAX = 24
export const BANNER_LINK = /^(https:\/\/\S+|\/\S*|tel:\+?[\d\s-]{6,20})$/

const text = (value: unknown): BannerText => {
  const v = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const s = (x: unknown) => (typeof x === 'string' ? x : '')
  return { en: s(v.en), fr: s(v.fr), ru: s(v.ru) }
}

export const newBannerId = () => Math.random().toString(36).slice(2, 10)

export const emptyBanner = (): Banner => ({
  enabled: false,
  messages: [],
  button: { enabled: true, action: 'call', label: { en: 'Call us', fr: 'Appelez-nous', ru: 'Позвонить' } },
})

// Accepts the current shape and the first one ({ enabled, text, link }, ideas split by "·").
export function normalizeBanner(value: unknown): Banner {
  if (!value || typeof value !== 'object') return emptyBanner()
  const v = value as Record<string, unknown>
  const base = emptyBanner()
  if (!Array.isArray(v.messages)) {
    const old = text(v.text)
    const split = (s: string) => s.split('·').map((part) => part.trim())
    const parts = { en: split(old.en), fr: split(old.fr), ru: split(old.ru) }
    const messages = parts.en.map((en, i) => ({
      id: `m${i + 1}`,
      enabled: true,
      text: { en, fr: parts.fr[i] ?? '', ru: parts.ru[i] ?? '' },
      link: typeof v.link === 'string' ? v.link : '',
    })).filter((m) => m.text.en)
    return { ...base, enabled: v.enabled === true, messages, button: { ...base.button, enabled: false } }
  }
  const b = (v.button && typeof v.button === 'object' ? v.button : {}) as Record<string, unknown>
  return {
    enabled: v.enabled === true,
    messages: v.messages.slice(0, BANNER_MAX_MESSAGES).map((item, i) => {
      const m = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>
      return {
        id: typeof m.id === 'string' && m.id ? m.id : `m${i + 1}`,
        enabled: m.enabled !== false,
        text: text(m.text),
        link: typeof m.link === 'string' ? m.link : '',
      }
    }),
    button: {
      enabled: b.enabled === true,
      action: b.action === 'whatsapp' ? 'whatsapp' : 'call',
      label: { ...base.button.label, ...Object.fromEntries(Object.entries(text(b.label)).filter(([, s]) => s)) },
    },
  }
}
