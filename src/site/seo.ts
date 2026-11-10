// Page titles and descriptions, shared by the browser (tab title) and the Pages Function (what Google reads).
import type { Content, Tour } from './types'
import { STRINGS, type Lang } from './i18n'
import { pathFor, type Route } from './routes'

const BRAND = 'Just Love Tour'

const DESCRIPTIONS: Record<Lang, Record<'home' | 'planner' | 'transfers' | 'gallery' | 'about' | 'contact', string>> = {
  en: {
    home: 'Private tours across Mauritius with a local driver-guide: Fauna & Flora, tea route, Ile aux Cerfs, catamaran, hiking and more. Hotel pickup, lunch included. Book on WhatsApp.',
    planner: 'Tell us your dates and interests and get a tailored Mauritius tour plan on WhatsApp, made by a local guide.',
    transfers: 'Private airport and hotel transfers in Mauritius: SSR Airport, Grand Baie, Le Morne, Flic en Flac and inter-hotel. Door to door, request on WhatsApp.',
    gallery: 'Photos and videos from Just Love Tour days around Mauritius: waterfalls, islands, tea fields and beaches.',
    about: 'Just Love Tour is run by Mauritians from St Clement, Curepipe, showing travellers the real island.',
    contact: 'Contact Just Love Tour in Mauritius by WhatsApp, phone or email for private tours, transfers and group trips.',
  },
  fr: {
    home: "Excursions privées à l'île Maurice avec un chauffeur-guide local : Faune et Flore, route du thé, Île aux Cerfs, catamaran, randonnée… Prise en charge à l'hôtel, déjeuner inclus. Réservez sur WhatsApp.",
    planner: "Donnez-nous vos dates et vos envies et recevez sur WhatsApp un programme sur mesure à l'île Maurice, préparé par un guide local.",
    transfers: "Transferts privés aéroport et hôtel à l'île Maurice : aéroport SSR, Grand Baie, Le Morne, Flic en Flac et entre hôtels. Demande sur WhatsApp.",
    gallery: "Photos et vidéos des journées Just Love Tour à l'île Maurice : cascades, îles, champs de thé et plages.",
    about: "Just Love Tour, ce sont des Mauriciens de St Clement, Curepipe, qui font découvrir la vraie île aux voyageurs.",
    contact: "Contactez Just Love Tour à l'île Maurice par WhatsApp, téléphone ou e-mail pour vos excursions privées et transferts.",
  },
  ru: {
    home: 'Частные экскурсии по Маврикию с местным гидом-водителем: природа, чайный маршрут, Иль-о-Серф, катамаран, походы. Трансфер от отеля, обед включён. Бронирование в WhatsApp.',
    planner: 'Сообщите даты и интересы и получите в WhatsApp индивидуальный план поездки по Маврикию от местного гида.',
    transfers: 'Частные трансферы на Маврикии: аэропорт SSR, Гранд-Бэ, Ле-Морн, Флик-ан-Флак и между отелями. Запрос в WhatsApp.',
    gallery: 'Фото и видео экскурсий Just Love Tour по Маврикию: водопады, острова, чайные плантации и пляжи.',
    about: 'Just Love Tour — это маврикийцы из Сен-Клемана (Кюрпип), которые показывают гостям настоящий остров.',
    contact: 'Свяжитесь с Just Love Tour на Маврикии через WhatsApp, по телефону или e-mail.',
  },
}

const HOME_TITLE: Record<Lang, string> = {
  en: `${BRAND} · Private tours in Mauritius with a local guide`,
  fr: `${BRAND} · Excursions privées à l'île Maurice avec un guide local`,
  ru: `${BRAND} · Частные экскурсии по Маврикию с местным гидом`,
}

const clip = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`)

export interface PageMeta {
  title: string
  description: string
  path: string
  // Languages this page exists in, for hreflang. A tour not yet translated points Google to the English one.
  alternates: Lang[]
  canonicalLang: Lang
  tour?: Tour
  status: 200 | 404
}

export function pageMeta(route: Route, content: Content): PageMeta {
  const { lang } = route
  const t = STRINGS[lang]
  const all = ['en', 'fr', 'ru'] as Lang[]
  if (route.page === 'tour') {
    const tour = content.tours.find((item) => item.slug === route.slug)
    if (!tour) return notFound(route)
    const translated = tour.alternates.includes(lang)
    return {
      title: tour.meta_title || `${tour.name} · ${t.categoryOne[tour.category]} | ${BRAND}`,
      description: clip(tour.meta_description || tour.summary || [tour.name, ...tour.stops].join(' · '), 160),
      path: pathFor(route),
      alternates: tour.alternates,
      canonicalLang: translated ? lang : 'en',
      tour,
      status: 200,
    }
  }
  if (route.page === 'notfound') return notFound(route)
  if (route.page === 'home') return { title: HOME_TITLE[lang], description: DESCRIPTIONS[lang].home, path: pathFor(route), alternates: all, canonicalLang: lang, status: 200 }
  const name = { planner: t.nav.planner, transfers: t.transfersTitle, gallery: t.galleryPageTitle, about: t.aboutTitle, contact: t.contactTitle }[route.page]
  const pageSuffix = route.page === 'gallery' && route.galleryPage && route.galleryPage > 1 ? ` · ${t.page(route.galleryPage)}` : ''
  return { title: `${name}${pageSuffix} | ${BRAND} Mauritius`, description: DESCRIPTIONS[lang][route.page], path: pathFor(route), alternates: all, canonicalLang: lang, status: 200 }
}

function notFound(route: Route): PageMeta {
  const t = STRINGS[route.lang]
  return { title: `${t.notFoundTitle} | ${BRAND}`, description: t.notFoundText, path: pathFor(route), alternates: [], canonicalLang: route.lang, status: 404 }
}
