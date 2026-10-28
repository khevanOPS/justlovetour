// Starting content for the database. Prices and stops for the four land tours come from
// Luvkoush's "Rebuild - with updated pricing and tours" document; the other tours keep the
// copy from the previous site and stay "price on request" until he confirms prices.
// FR/RU copy left empty falls back to English on the site until an admin fills it in.

const pickup = {
  en: 'Hotel pickup and return',
  fr: 'Prise en charge et retour à l’hôtel',
  ru: 'Трансфер из отеля и обратно',
}
const lunch = { en: 'Lunch', fr: 'Déjeuner', ru: 'Обед' }

const both = (en, fr = '', ru = '') => ({ en, fr, ru })

export const tours = [
  {
    slug: 'fauna-flora',
    category: 'land',
    price: { adult: 15000, child: 8000 },
    start: '09:00',
    end: '17:00',
    images: ['/images/fauna/main.jpg'],
    text: {
      en: {
        name: 'Fauna & Flora',
        summary: 'Volcano crater, sacred lake, Black River Gorges and the Seven Coloured Earth, with lunch included.',
        description:
          'A full day through the green heart of the island. Departure 09:00 to 17:00, or 08:30 to 16:30, with hotel pickup and return.',
        stops: [
          'Ship model factory',
          'Trou aux Cerfs volcano',
          'Ganga Talao (Grand Bassin sacred lake)',
          'Black River Gorges viewpoint',
          'Lunch',
          'Seven Coloured Earth',
        ],
        included: [pickup.en, lunch.en, 'Seven Coloured Earth entrance'],
        extras: ['Chamarel rum distillery visit (entrance paid on the day)'],
      },
      fr: { name: 'Faune & Flore' },
      ru: { name: 'Фауна и флора' },
    },
  },
  {
    slug: 'spirit-frontier-adventures',
    category: 'land',
    price: { adult: 15000, child: 8000 },
    start: '09:00',
    end: '17:00',
    images: ['/images/spirit-adventure/WhatsApp Image 2026-03-29 at 09.17.18.jpeg'],
    text: {
      en: {
        name: 'Spirit Frontier Adventures',
        summary: 'Port Louis from the Citadel, the markets, Pamplemousses garden and the Red Church at Cap Malheureux.',
        description:
          'History, colour and the north coast in one day. Departure 09:00 to 17:00, or 08:30 to 16:30, with hotel pickup and return.',
        stops: [
          'Citadel fort viewpoint',
          'Local market',
          'Craft market',
          'Lunch',
          'Pamplemousses Botanical Garden',
          'Red Church, Cap Malheureux',
        ],
        included: [pickup.en, lunch.en, 'Pamplemousses Botanical Garden entrance'],
        extras: [],
      },
      fr: { name: 'Spirit Frontier Adventures' },
      ru: { name: 'Spirit Frontier Adventures' },
    },
  },
  {
    slug: 'la-route-du-the',
    category: 'land',
    price: { adult: 15000, child: 8000 },
    start: '09:00',
    end: '17:00',
    images: [],
    text: {
      en: {
        name: 'La Route du Thé',
        summary: 'Colonial estates, tea and rum tasting, the vanilla house and the wild cliffs of Gris Gris.',
        description:
          'The south of Mauritius through its tea, vanilla and rum. Departure 09:00 to 17:00, or 08:30 to 16:30, with hotel pickup and return.',
        stops: [
          'Domaine des Aubineaux',
          'Bois Chéri, with tea tasting',
          'Domaine de St Aubin',
          'Vanilla house',
          'Lunch',
          'Rum tasting',
          'Gris Gris seaside',
        ],
        included: [pickup.en, lunch.en, 'Tea tasting', 'Rum tasting'],
        extras: [],
      },
      fr: { name: 'La Route du Thé' },
      ru: { name: 'Чайный путь (La Route du Thé)' },
    },
  },
  {
    slug: 'personalised-tours',
    category: 'land',
    price: { adult: 7500, child: 5000 },
    start: null,
    end: null,
    images: [],
    text: {
      en: {
        name: 'Personalised Tours',
        summary: 'Your own itinerary with a private driver-guide, flexible stops and timings.',
        description: 'Tell us what you want to see and we build the day around you.',
        stops: [],
        included: ['Fully customised itinerary', 'Private taxi with driver-guide', 'Flexible stops and timings', pickup.en],
        extras: ['Street food and water activities on request'],
      },
      fr: { name: 'Circuits personnalisés' },
      ru: { name: 'Индивидуальные туры' },
    },
  },
  { slug: 'ile-aux-cerfs-5-islands', from: 'ile-aux-cerfs', category: 'sea', images: ['/images/ile-aux-cerf/ile-aux-cerfs.jpg'] },
  { slug: 'catamaran-speed-boat', from: 'catamaran', category: 'sea', images: ['/images/catamaran-speed-boat/speedboat.jpg'] },
  { slug: 'big-game-fishing', from: 'big-game-fishing', category: 'sea', images: ['/images/big-game-fishing/main.jpg'] },
  { slug: 'adventure-tours', from: 'adventure', category: 'adventure', images: ['/images/adventure/adventure-tour.jpg'] },
  { slug: 'hiking', from: 'hiking', category: 'adventure', images: ['/images/hiking/hiking-lemorne.jpg'] },
  { slug: 'quad-bikes', from: 'quad', category: 'adventure', images: ['/images/quad/quad-bike.jpg'] },
]

export const destinations = [
  ['ssr-airport', 'Sir Seewoosagur Ramgoolam International Airport'],
  ['grand-baie', 'Grand Baie'],
  ['flic-en-flac', 'Flic en Flac'],
  ['trou-aux-biches', 'Trou aux Biches'],
  ['belle-mare', 'Belle Mare'],
  ['le-morne', 'Le Morne'],
  ['tamarin', 'Tamarin'],
  ['port-louis', 'Port Louis'],
  ['blue-bay', 'Blue Bay'],
  ['ile-aux-cerfs', 'Ile aux Cerfs'],
]

export const content = {
  hero: {
    en: { eyebrow: 'Private tours across Mauritius', title: 'See the real island with a local guide', travellers: '100+' },
    fr: { eyebrow: 'Excursions privées à l’île Maurice', title: 'Découvrez la vraie île avec un guide local', travellers: '100+' },
    ru: { eyebrow: 'Частные туры по Маврикию', title: 'Настоящий Маврикий с местным гидом', travellers: '100+' },
  },
  why: {
    en: [
      { title: 'Local driver-guide', text: 'Mauritians showing you their island' },
      { title: pickup.en, text: 'Collected from and dropped back at your hotel' },
      { title: 'Lunch included', text: 'On every land tour' },
      { title: 'Fixed prices', text: 'No hidden fees' },
    ],
    fr: [
      { title: 'Chauffeur-guide local', text: 'Des Mauriciens qui vous font découvrir leur île' },
      { title: pickup.fr, text: 'On vient vous chercher et on vous ramène' },
      { title: 'Déjeuner inclus', text: 'Sur toutes les excursions terrestres' },
      { title: 'Prix fixes', text: 'Aucun frais caché' },
    ],
    ru: [
      { title: 'Местный гид-водитель', text: 'Маврикийцы показывают свой остров' },
      { title: pickup.ru, text: 'Заберём из отеля и привезём обратно' },
      { title: 'Обед включён', text: 'Во всех наземных турах' },
      { title: 'Фиксированные цены', text: 'Без скрытых платежей' },
    ],
  },
  // FAQ answers come from Luvkoush; the section stays hidden while this list is empty.
  faq: { en: [], fr: [], ru: [] },
}

export const settings = {
  contact: {
    whatsapp: '+23058342797',
    phone_display: '+230 5834 2797',
    email: 'justlovetour0207@gmail.com',
    location: 'St Clement, Curepipe',
  },
  socials: {
    instagram: 'https://www.instagram.com/mauricius547/',
    facebook: 'https://www.facebook.com/profile.php?id=61579363187587',
    youtube: 'https://www.youtube.com/@JustLoveToursMauritius',
    google_reviews: 'https://share.google/yWAztCjkqJIf9sXXC',
  },
  // Euro is the base currency. Rates are set by an admin until automatic rates are decided.
  currency: { default: 'EUR', usd_per_eur: null, mur_per_eur: null },
}
