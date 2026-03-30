import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import './App.css'
import {
  Anchor,
  ArrowLeftRight,
  Bike,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Facebook,
  Footprints,
  Globe,
  Heart,
  ImageIcon,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Plane,
  Play,
  Star,
  X
} from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import ActivityDetail from './ActivityDetail'
import { translations, type Lang } from '@/i18n/translations'
import { mergeGalleryImages, staticGalleryImages } from '@/lib/static-gallery'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { useIsMobile } from '@/hooks/use-mobile'

type Review = {
  id: number | string
  name: string
  rating: number
  date: string
  text: string
  avatar: string
}

type GalleryItem = {
  id: string
  url: string
}

type PlannerInterest = 'nature' | 'adventure' | 'culture' | 'beaches'
type PageView = 'home' | 'tour-planner' | 'transfers' | 'gallery' | 'about'
type NavKey = 'home' | 'activities' | 'tour-planner' | 'transfers' | 'gallery' | 'about' | 'contact'

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

function formatDateForMessage(value: string) {
  if (!value) return ''
  return format(new Date(`${value}T00:00:00`), 'dd MMM yyyy')
}

const fallbackReviews: Review[] = [
  {
    id: 1,
    name: 'Laurie Anne',
    rating: 5,
    date: '1 week ago',
    text: "Merci pour ces belles découvertes de l'île Maurice 🙏 notre guide a pris le temps pour nous avec mes difficultés de marche suite à un accident en France avant de venir, il nous a expliqué plein de choses sur l'histoire de l'île, les coutumes, les paysages... C'était riche et très clair ! Et tout ceci avec une pointe d'humour qui nous a donné envie de faire nos excursions en sa compagnie ! Les excursions était PARFAITES ! 😍",
    avatar: 'L'
  },
  {
    id: 2,
    name: 'Ornella Loconte',
    rating: 5,
    date: '1 week ago',
    text: '',
    avatar: 'O'
  },
  {
    id: 3,
    name: 'Meethoo Nadil',
    rating: 5,
    date: '1 week ago',
    text: '',
    avatar: 'M'
  },
  {
    id: 4,
    name: 'Coushbou Ramsewock',
    rating: 5,
    date: '1 week ago',
    text: '',
    avatar: 'C'
  },
  {
    id: 5,
    name: 'Marie Dupont',
    rating: 5,
    date: '2 weeks ago',
    text: 'Amazing experience! The quad bike tour through the sugar cane fields was unforgettable. Our guide was professional and friendly. Highly recommend!',
    avatar: 'M'
  }
]

export default function App() {
  const isMobile = useIsMobile()
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState<Lang>('en')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [pageView, setPageView] = useState<PageView>('home')
  const [activeNavKey, setActiveNavKey] = useState<NavKey>('home')
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>(staticGalleryImages)
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [transferDate, setTransferDate] = useState('')
  const [transferPax, setTransferPax] = useState('')
  const [transferFlight, setTransferFlight] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [transferName, setTransferName] = useState('')
  const [transferEmail, setTransferEmail] = useState('')
  const [transferNotes, setTransferNotes] = useState('')
  const [weather, setWeather] = useState<{ tempC: number; summary: string } | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [recTraveller, setRecTraveller] = useState<'couple' | 'family' | 'adventure' | 'relaxed' | ''>('')
  const [recDays, setRecDays] = useState<'1-2' | '3-5' | '7+' | ''>('')
  const [recFocus, setRecFocus] = useState<'nature' | 'culture' | 'adventure' | 'beaches' | ''>('')
  const [planStartDate, setPlanStartDate] = useState('')
  const [planEndDate, setPlanEndDate] = useState('')
  const [planPeople, setPlanPeople] = useState('')
  const [planInterests, setPlanInterests] = useState<Record<PlannerInterest, boolean>>({
    nature: false,
    adventure: false,
    culture: false,
    beaches: false
  })
  const [activityCarouselApi, setActivityCarouselApi] = useState<CarouselApi>()
  const [activityCanPrev, setActivityCanPrev] = useState(false)
  const [activityCanNext, setActivityCanNext] = useState(false)
  const [showActivityControls, setShowActivityControls] = useState(false)
  const [loadedVideoIds, setLoadedVideoIds] = useState<string[]>([])
  const [bookingActivity, setBookingActivity] = useState<string | null>(null)
  const [bookingName, setBookingName] = useState('')
  const [bookingPeople, setBookingPeople] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingEmail, setBookingEmail] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [contactFirstName, setContactFirstName] = useState('')
  const [contactLastName, setContactLastName] = useState('')
  const [contactFormEmail, setContactFormEmail] = useState('')
  const [contactActivityKey, setContactActivityKey] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  const t = translations[lang]
  const whatsappNumber = '+23058342797'
  const whatsappLink = `https://wa.me/${whatsappNumber}`
  const instagramLink = 'https://www.instagram.com/mauricius547/'
  const facebookLink = 'https://www.facebook.com/profile.php?id=61579363187587'
  const contactEmail = 'justlovetour0207@gmail.com'
  const today = format(new Date(), 'yyyy-MM-dd')
  const imagesPerPage = 10
  const totalPages = Math.ceil(galleryImages.length / imagesPerPage)
  const currentImages = galleryImages.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
  const topReviews = reviews.filter((review) => review.rating === 5).slice(0, 4)
  const activitySectionRef = useRef<HTMLElement | null>(null)

  const popularDestinations = [
    'Sir Seewoosagur Ramgoolam International Airport',
    'Grand Baie',
    'Flic en Flac',
    'Trou aux Biches',
    'Belle Mare',
    'Le Morne',
    'Tamarin',
    'Port Louis',
    'Blue Bay',
    'Ile aux Cerfs'
  ]

  const socialLinks = [
    {
      label: t.whatsappLabel,
      value: '+230 5834 2797',
      href: whatsappLink,
      icon: MessageCircle,
      accent: 'bg-green-100 text-green-600'
    },
    {
      label: 'Instagram',
      value: t.openProfile,
      href: instagramLink,
      icon: Instagram,
      accent: 'bg-pink-100 text-pink-600'
    },
    {
      label: 'Facebook',
      value: t.openPage,
      href: facebookLink,
      icon: Facebook,
      accent: 'bg-blue-100 text-blue-600'
    },
    {
      label: t.googleReviewsLabel,
      value: t.readReviews,
      href: 'https://share.google/yWAztCjkqJIf9sXXC',
      icon: Star,
      accent: 'bg-amber-100 text-amber-500'
    }
  ] as const

  const youtubeChannelUrl = 'https://www.youtube.com/@JustLoveToursMauritius'
  const youtubeVideos = [
    { id: 'video-1', youtubeId: 'ydbMLfiPWA0', startSeconds: undefined },
    { id: 'video-2', youtubeId: '84fQQHAORl8', startSeconds: 102 },
    { id: 'video-3', youtubeId: 'E8Uur_Du7io', startSeconds: undefined },
    { id: 'video-4', youtubeId: 'kitYc68akb8', startSeconds: undefined }
  ] as const

  const activityCatalog: { key: string; title: string; region: 'north' | 'south' | 'east' | 'west' | 'nature'; tags: string[] }[] = [
    { key: 'adventure', title: t.adventureTours, region: 'south', tags: ['adventure', 'nature'] },
    { key: 'ile-aux-cerfs', title: t.ileAuxCerfsTours, region: 'east', tags: ['beaches', 'adventure'] },
    { key: 'hiking', title: t.hiking, region: 'nature', tags: ['nature', 'adventure'] },
    { key: 'quad', title: t.quadBikes, region: 'south', tags: ['adventure'] },
    { key: 'fauna', title: t.faunaFlora, region: 'south', tags: ['nature', 'culture'] },
    { key: 'catamaran', title: t.catamaranSpeedBoat, region: 'west', tags: ['beaches', 'adventure'] },
    { key: 'big-game-fishing', title: t.bigGameFishing, region: 'west', tags: ['beaches', 'adventure'] },
    { key: 'frontier', title: t.frontierSpiritAdventures, region: 'north', tags: ['culture'] }
  ]

  const activityCards = [
    {
      key: 'adventure',
      title: t.adventureTours,
      category: t.adventure,
      description: t.activityAdventureCardDesc,
      image: '/images/adventure/adventure-tour.jpg',
      icon: Mountain,
      message: `${t.contactActivityMessage}: ${t.adventureTours}`
    },
    {
      key: 'ile-aux-cerfs',
      title: t.ileAuxCerfsTours,
      category: t.sea,
      description: t.activityIleAuxCerfsCardDesc,
      image: '/images/ile-aux-cerf/ile-aux-cerfs.jpg',
      icon: Anchor,
      message: `${t.contactActivityMessage}: ${t.ileAuxCerfsTours}`
    },
    {
      key: 'hiking',
      title: t.hiking,
      category: t.nature,
      description: t.activityHikingCardDesc,
      image: '/images/hiking/hiking-lemorne.jpg',
      icon: Footprints,
      message: `${t.contactActivityMessage}: ${t.hiking}`
    },
    {
      key: 'quad',
      title: t.quadBikes,
      category: t.thrills,
      description: t.activityQuadCardDesc,
      image: '/images/quad/quad-bike.jpg',
      icon: Bike,
      message: `${t.contactActivityMessage}: ${t.quadBikes}`
    },
    {
      key: 'fauna',
      title: t.faunaFlora,
      category: t.sightseeing,
      description: t.activityFaunaCardDesc,
      image: '/images/fauna/main.jpg',
      icon: Compass,
      message: `${t.contactActivityMessage}: ${t.faunaFlora}`
    },
    {
      key: 'catamaran',
      title: t.catamaranSpeedBoat,
      category: t.sea,
      description: t.activityCatamaranCardDesc,
      image: '/images/catamaran-speed-boat/speedboat.jpg',
      icon: Anchor,
      message: `${t.contactActivityMessage}: ${t.catamaranSpeedBoat}`
    },
    {
      key: 'big-game-fishing',
      title: t.bigGameFishing,
      category: t.sea,
      description: t.activityBigGameFishingCardDesc,
      image: '/images/big-game-fishing/main.jpg',
      icon: Anchor,
      message: `${t.contactActivityMessage}: ${t.bigGameFishing}`
    },
    {
      key: 'frontier',
      title: t.frontierSpiritAdventures,
      category: t.sightseeing,
      description: t.frontierSpiritShort,
      image: '/images/spirit-adventure/sightseeing-tour.jpg',
      icon: Compass,
      message: `${t.contactActivityMessage}: ${t.frontierSpiritAdventures}`
    }
  ] as const

  const contactActivityOptions = [
    ...activityCards.map((activity) => ({ value: activity.key, label: activity.title })),
    { value: 'transfer', label: t.airportTransfer }
  ]

  useEffect(() => {
    if (planStartDate && planEndDate && planEndDate < planStartDate) {
      setPlanEndDate('')
    }
  }, [planEndDate, planStartDate])

  const recommended = useMemo(() => {
    if (!recTraveller || !recDays || !recFocus) return []

    return activityCatalog
      .map((activity) => {
        let score = 0
        if (activity.tags.includes(recFocus)) score += 3
        if (recTraveller === 'adventure' && activity.tags.includes('adventure')) score += 2
        if (recTraveller === 'relaxed' && activity.tags.includes('beaches')) score += 2
        if (recTraveller === 'family') score += activity.tags.includes('adventure') ? 1 : 2
        if (recTraveller === 'couple') score += activity.tags.includes('culture') ? 2 : 1
        if (recDays === '1-2') score += activity.region === 'north' || activity.region === 'west' ? 1 : 0
        if (recDays === '7+') score += 1
        return { ...activity, score }
      })
      .sort((x, y) => y.score - x.score)
      .slice(0, 3)
  }, [activityCatalog, recDays, recFocus, recTraveller])

  useEffect(() => {
    let cancelled = false

    async function loadGallery() {
      try {
        setGalleryLoading(true)
        setGalleryError(null)
        const response = await fetch('/api/gallery')
        if (!response.ok) throw new Error(`Gallery API failed: ${response.status}`)
        const data: GalleryItem[] = await response.json()
        if (!cancelled) setGalleryImages(mergeGalleryImages(data.map((item) => item.url)))
      } catch (error: unknown) {
        if (!cancelled) {
          setGalleryImages(staticGalleryImages)
          setGalleryError(getErrorMessage(error, 'Failed to load gallery'))
        }
      } finally {
        if (!cancelled) setGalleryLoading(false)
      }
    }

    loadGallery()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadReviews() {
      try {
        setReviewsLoading(true)
        const response = await fetch('/api/reviews')
        if (!response.ok) throw new Error(`Reviews API failed: ${response.status}`)
        const data = await response.json()
        if (!cancelled && Array.isArray(data) && data.length) setReviews(data)
      } catch {
        // Keep fallback reviews silently.
      } finally {
        if (!cancelled) setReviewsLoading(false)
      }
    }

    loadReviews()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadWeather() {
      try {
        setWeatherLoading(true)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=-20.1609&longitude=57.5012&current_weather=true'
        )
        if (!response.ok) throw new Error('Weather request failed')

        const data = await response.json()
        const currentWeather = data?.current_weather
        if (!currentWeather || typeof currentWeather.temperature !== 'number') return

        const code = Number(currentWeather.weathercode)
        const summary =
          code === 0
            ? t.weatherClear
            : [1, 2, 3].includes(code)
              ? t.weatherPartlyCloudy
              : [45, 48].includes(code)
                ? t.weatherFog
                : [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
                  ? t.weatherRain
                  : [71, 73, 75, 85, 86].includes(code)
                    ? t.weatherSnow
                    : t.weatherMixed

        if (!cancelled) setWeather({ tempC: Math.round(currentWeather.temperature), summary })
      } catch {
        // Ignore weather failures.
      } finally {
        if (!cancelled) setWeatherLoading(false)
      }
    }

    loadWeather()
    return () => {
      cancelled = true
    }
  }, [t.weatherClear, t.weatherFog, t.weatherMixed, t.weatherPartlyCloudy, t.weatherRain, t.weatherSnow])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (!showLangDropdown) return

    const handleWindowClick = () => setShowLangDropdown(false)
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowLangDropdown(false)
    }

    window.addEventListener('click', handleWindowClick)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('click', handleWindowClick)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [showLangDropdown])

  useEffect(() => {
    if (!showMobileMenu) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowMobileMenu(false)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [showMobileMenu])

  useEffect(() => {
    if (!selectedActivity && !selectedGalleryImage) return

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (selectedGalleryImage) {
        setSelectedGalleryImage(null)
        return
      }
      setSelectedActivity(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedActivity, selectedGalleryImage])

  useEffect(() => {
    setCurrentPage(1)
  }, [galleryImages.length, pageView])

  useEffect(() => {
    if (!pendingScrollTarget) return
    const handle = window.requestAnimationFrame(() => {
      if (pendingScrollTarget === '__page-top__' || pendingScrollTarget === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        scrollToTarget(pendingScrollTarget, 'smooth')
      }
      setPendingScrollTarget(null)
    })
    return () => window.cancelAnimationFrame(handle)
  }, [isMobile, pageView, pendingScrollTarget])

  useEffect(() => {
    const updateActiveSection = () => {
      const threshold = getScrollOffset() + 24

      if (!isMobile && pageView !== 'home') {
        const contactSection = document.getElementById('contact')
        if (contactSection) {
          const rect = contactSection.getBoundingClientRect()
          if (rect.top <= threshold && rect.bottom > threshold) {
            setActiveNavKey('contact')
            return
          }
        }

        setActiveNavKey(pageView)
        return
      }

      const sectionOrder: NavKey[] = isMobile
        ? ['home', 'activities', 'tour-planner', 'transfers', 'gallery', 'about', 'contact']
        : ['home', 'activities', 'contact']

      let current: NavKey = sectionOrder[0]
      for (const key of sectionOrder) {
        const section = document.getElementById(key)
        if (!section) continue

        if (section.getBoundingClientRect().top <= threshold) current = key
        else break
      }

      setActiveNavKey(current)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [isMobile, pageView])

  useEffect(() => {
    if (!activityCarouselApi) return

    const updateState = () => {
      setActivityCanPrev(activityCarouselApi.canScrollPrev())
      setActivityCanNext(activityCarouselApi.canScrollNext())
    }

    updateState()
    activityCarouselApi.on('select', updateState)
    activityCarouselApi.on('reInit', updateState)

    return () => {
      activityCarouselApi.off('select', updateState)
    }
  }, [activityCarouselApi])

  useEffect(() => {
    const updateVisibility = () => {
      const section = activitySectionRef.current
      if (!section || activeNavKey !== 'activities') {
        setShowActivityControls(false)
        return
      }

      const rect = section.getBoundingClientRect()
      const threshold = getScrollOffset() + 20
      const isVisible = rect.top <= threshold && rect.bottom > threshold + 120
      setShowActivityControls(isVisible)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)

    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [activeNavKey])

  const openWhatsApp = (message = '') => {
    const encodedMessage = encodeURIComponent(message)
    const url = encodedMessage ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}` : whatsappLink
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const getScrollOffset = () => (window.innerWidth >= 768 ? 104 : 88)

  const scrollToTarget = (targetId: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.getElementById(targetId)
    if (!element) return false

    const targetTop = element.getBoundingClientRect().top + window.scrollY - getScrollOffset()
    window.scrollTo({ top: Math.max(0, targetTop), behavior })
    return true
  }

  const openTripPlannerWhatsApp = () => {
    const interests = Object.entries(planInterests)
      .filter(([, value]) => value)
      .map(([key]) =>
        key === 'beaches'
          ? t.interestBeaches
          : key === 'culture'
            ? t.interestCulture
            : key === 'nature'
              ? t.interestNature
              : t.interestAdventure
      )
      .join(', ')

    const message =
      `${t.planMsgHello}\n` +
      `${t.planMsgDates}: ${planStartDate && planEndDate ? `${formatDateForMessage(planStartDate)} - ${formatDateForMessage(planEndDate)}` : t.planMsgNotSet}\n` +
      `${t.planMsgPeople}: ${planPeople || t.planMsgNotSet}\n` +
      `${t.planMsgInterests}: ${interests || t.planMsgNotSet}\n\n` +
      `${t.planMsgAsk}`

    openWhatsApp(message)
  }

  const openTransferRequest = () => {
    const parts = [
      t.transferMsgHello,
      `${t.transferMsgName}: ${transferName || t.notProvided}`,
      `${t.transferMsgEmail}: ${transferEmail || t.notProvided}`,
      `${t.transferMsgPickup}: ${pickupLocation || t.notProvided}`,
      `${t.transferMsgDropoff}: ${dropoffLocation || t.notProvided}`,
      transferDate ? `${t.transferMsgDate}: ${transferDate}` : null,
      transferPax ? `${t.transferMsgPax}: ${transferPax}` : null,
      transferFlight ? `${t.transferMsgFlight}: ${transferFlight}` : null,
      transferNotes ? `${t.transferMsgNotes}: ${transferNotes}` : null
    ].filter(Boolean)

    openWhatsApp(parts.join('\n'))
  }

  const openActivityBooking = (activityTitle: string) => {
    setBookingActivity(activityTitle)
    setBookingName('')
    setBookingPeople('')
    setBookingDate('')
    setBookingEmail('')
    setBookingPhone('')
    setBookingNotes('')
  }

  const submitActivityBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!bookingActivity) return

    const parts = [
      `${t.contactActivityMessage}: ${bookingActivity}`,
      `Full name: ${bookingName}`,
      `Number of person: ${bookingPeople}`,
      `Preferred date: ${formatDateForMessage(bookingDate)}`,
      `Email: ${bookingEmail}`,
      `Contact number: ${bookingPhone}`,
      bookingNotes ? `Additional notes: ${bookingNotes}` : null
    ].filter(Boolean)

    openWhatsApp(parts.join('\n'))
    setBookingActivity(null)
  }

  const submitContactForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const selectedActivityLabel = contactActivityOptions.find((option) => option.value === contactActivityKey)?.label
    const fullName = `${contactFirstName} ${contactLastName}`.trim()
    const parts = [
      t.contactQuestionMessage,
      `Name: ${fullName || t.notProvided}`,
      `Email: ${contactFormEmail || t.notProvided}`,
      `Activity: ${selectedActivityLabel || t.notProvided}`,
      `Message: ${contactMessage || t.notProvided}`
    ]

    openWhatsApp(parts.join('\n'))
    setContactFirstName('')
    setContactLastName('')
    setContactFormEmail('')
    setContactActivityKey('')
    setContactMessage('')
  }

  const navigateTo = (key: NavKey) => {
    setShowMobileMenu(false)
    setActiveNavKey(key)

    if (key === 'home' || key === 'activities') {
      if (!isMobile) setPageView('home')
      setPendingScrollTarget(key)
      return
    }

    if (key === 'contact') {
      setPendingScrollTarget('contact')
      return
    }

    if (isMobile) {
      setPendingScrollTarget(key)
      return
    }

    const view = key as PageView
    setPageView(view)
    setPendingScrollTarget('__page-top__')
  }

  const pageIntro = (eyebrow: string, title: string, subtitle?: string) => (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-teal-800 to-emerald-700 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
      </div>
      <div className={`relative mx-auto max-w-7xl px-6 text-center ${subtitle ? 'pb-20 pt-36 md:pt-40' : 'pb-14 pt-32 md:pb-16 md:pt-36'}`}>
        <p className="mb-4 text-sm uppercase tracking-[0.32em] text-white/75">{eyebrow}</p>
        <h1 className={`mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl ${subtitle ? 'mb-5' : ''}`}>{title}</h1>
        {subtitle ? <p className="mx-auto max-w-2xl text-lg text-white/85">{subtitle}</p> : null}
      </div>
    </div>
  )

  const renderHomePage = () => (
    <>
      <section id="home" className="relative min-h-screen overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-slate-900 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-mauritius.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        </div>

        <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-in-up">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/90 md:text-base">{t.discoverParadise}</p>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">{t.heroTitle}</h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-white/80 md:text-xl">{t.heroSubtitle}</p>

            <div className="mb-8 flex justify-center">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-sm">
                {weatherLoading ? (
                  <span>{t.weatherLoading}</span>
                ) : weather ? (
                  <span>
                    {t.mauritiusToday}: <span className="font-semibold">{weather.tempC}°C</span> · {weather.summary}
                  </span>
                ) : (
                  <span>{t.weatherUnavailable}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigateTo('activities')}
                className="bg-teal-600 px-8 py-6 text-base text-white hover:bg-teal-700"
              >
                {t.exploreActivities}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openWhatsApp(t.bookingInterestMessage)}
                className="border-white/50 bg-white/10 px-8 py-6 text-base text-white backdrop-blur-sm hover:bg-white/15"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t.chatOnWhatsApp}
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </section>

      <section ref={activitySectionRef} id="activities" className="relative bg-gradient-to-b from-[#fbfbf7] via-white to-[#eef8f6] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-teal-600">{t.ourActivities}</p>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{t.activitiesSubtitle}</h2>
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-teal-700">
              <ArrowLeftRight className="h-4 w-4 animate-pulse" />
              <span>{t.swipeActivities}</span>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-0 sm:px-10 lg:px-16">
            <Carousel opts={{ align: 'start', loop: false }} setApi={setActivityCarouselApi} className="w-full">
              <CarouselContent>
                {activityCards.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <CarouselItem key={activity.key} className="basis-[88%] sm:basis-1/2 lg:basis-1/3">
                      <div className="flex h-full flex-col overflow-hidden rounded-[34px] border border-black/5 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
                        <div className="relative h-[320px] overflow-hidden bg-[#edf7f5]">
                          <img src={activity.image} alt={activity.title} className="h-full w-full object-cover object-center" />
                          <button
                            type="button"
                            onClick={() => setSelectedGalleryImage(activity.image)}
                            className="absolute inset-0 z-[1]"
                            aria-label={`Open ${activity.title} image`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 z-[2] p-6 text-white sm:p-8">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                              <Icon className="h-4 w-4" />
                              <span className="text-sm font-medium">{activity.category}</span>
                            </div>
                            <h3 className="text-3xl font-bold sm:text-4xl">{activity.title}</h3>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                          <div>
                            <p className="text-base leading-7 text-gray-600">{activity.description}</p>
                          </div>

                          <div className="mt-6 flex flex-col gap-3">
                            <Button
                              onClick={() => setSelectedActivity(activity.key)}
                              variant="outline"
                              className="h-12 rounded-xl border-teal-600 text-teal-600 hover:bg-teal-50"
                            >
                              {t.learnMore}
                            </Button>
                            <Button
                              onClick={() => openActivityBooking(activity.title)}
                              className="h-12 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              {t.bookViaWhatsApp}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="mx-auto mt-12 max-w-4xl px-6 text-center sm:mt-14">
            <p className="text-base leading-8 text-gray-600 sm:text-lg">{t.guideLanguagesNote}</p>
          </div>
        </div>
      </section>
    </>
  )

  const renderTourPlannerPage = (standalone: boolean) => (
    <>
      {standalone ? pageIntro(t.tourPlanner, t.plannerTitle, t.plannerSubtitle) : null}
      <section id="tour-planner" className={`bg-white py-20 md:py-24 ${standalone ? '' : 'border-t border-gray-100'}`}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-gray-100 bg-gray-50 p-8">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-teal-600">{t.recommenderKicker}</p>
            <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">{t.recommenderTitle}</h3>
            <p className="mb-6 text-gray-600">{t.recommenderSubtitle}</p>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">{t.recommenderTravellerType}</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { k: 'couple', label: t.travellerCouple },
                      { k: 'family', label: t.travellerFamily },
                      { k: 'adventure', label: t.travellerAdventure },
                      { k: 'relaxed', label: t.travellerRelaxed }
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.k}
                      onClick={() => setRecTraveller(option.k)}
                      className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                        recTraveller === option.k
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">{t.recommenderDays}</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { k: '1-2', label: t.days12 },
                      { k: '3-5', label: t.days35 },
                      { k: '7+', label: t.days7plus }
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.k}
                      onClick={() => setRecDays(option.k)}
                      className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                        recDays === option.k
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">{t.recommenderFocus}</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { k: 'nature', label: t.interestNature },
                      { k: 'culture', label: t.interestCulture },
                      { k: 'adventure', label: t.interestAdventure },
                      { k: 'beaches', label: t.interestBeaches }
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.k}
                      onClick={() => setRecFocus(option.k)}
                      className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                        recFocus === option.k
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                {recommended.length ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="mb-3 text-sm font-semibold text-gray-900">{t.recommendedForYou}</p>
                    <div className="space-y-2">
                      {recommended.map((activity) => (
                        <button
                          key={activity.key}
                          onClick={() => setSelectedActivity(activity.key)}
                          className="w-full rounded-xl border border-gray-100 px-4 py-3 text-left transition-colors hover:border-teal-200 hover:bg-teal-50/40"
                        >
                          <span className="font-medium text-gray-900">{activity.title}</span>
                          <span className="mt-1 block text-xs text-gray-500">{t.learnMore}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">{t.recommenderHint}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-teal-600 p-8 text-white">
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/90">{t.plannerKicker}</p>
            <h3 className="mb-2 text-2xl font-bold md:text-3xl">{t.plannerTitle}</h3>
            <p className="mb-6 text-white/90">{t.plannerSubtitle}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-white/90">{t.plannerDates}</label>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={planStartDate}
                      min={today}
                      onChange={(event) => setPlanStartDate(event.target.value)}
                      className="w-full rounded-xl py-3 pl-10 pr-4 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={planEndDate}
                      min={planStartDate || today}
                      onChange={(event) => setPlanEndDate(event.target.value)}
                      className="w-full rounded-xl py-3 pl-10 pr-4 text-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/90">{t.plannerPeople}</label>
                <input
                  type="number"
                  min="1"
                  value={planPeople}
                  onChange={(event) => setPlanPeople(event.target.value)}
                  placeholder={t.plannerPeoplePlaceholder}
                  className="mt-2 w-full rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-white/90">{t.plannerInterests}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { k: 'nature', label: t.interestNature },
                    { k: 'adventure', label: t.interestAdventure },
                    { k: 'culture', label: t.interestCulture },
                    { k: 'beaches', label: t.interestBeaches }
                  ] as const
                ).map((option) => (
                  <label
                    key={option.k}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={planInterests[option.k]}
                      onChange={(event) =>
                        setPlanInterests((previous) => ({ ...previous, [option.k]: event.target.checked }))
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={openTripPlannerWhatsApp}
                disabled={!planStartDate || !planEndDate}
                className="bg-white text-teal-700 hover:bg-gray-100 disabled:bg-white/70 disabled:text-teal-800/60"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t.plannerCta}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setPlanStartDate('')
                  setPlanEndDate('')
                  setPlanPeople('')
                  setPlanInterests({ nature: false, adventure: false, culture: false, beaches: false })
                }}
                className="border-white/30 bg-white/10 text-white hover:bg-white/15"
              >
                {t.plannerReset}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )

  const renderTransfersPage = (standalone: boolean) => (
    <>
      {standalone ? pageIntro(t.airportTransfer, t.airportTitle, t.airportSubtitle) : null}
      <section id="transfers" className={`bg-white pb-24 ${standalone ? 'pt-5 md:pt-6' : 'border-t border-gray-100 pt-20 md:pt-24'}`}>
        <div className="mx-auto max-w-7xl px-6">
          {!standalone && (
            <div className="mb-12 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-teal-700">
                <Plane className="h-4 w-4" />
                <span className="text-sm font-medium">{t.airportTransfer}</span>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{t.airportTitle}</h1>
              <p className="text-lg leading-8 text-gray-600">{t.airportSubtitle}</p>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-[#f5faf9] p-5">
                  <p className="font-semibold text-gray-900">{t.privateTransfers}</p>
                  <p className="mt-2 text-sm text-gray-600">{t.directToHotel}</p>
                </div>
                <div className="rounded-3xl bg-[#f9f7ef] p-5">
                  <p className="font-semibold text-gray-900">{t.allDestinations}</p>
                  <p className="mt-2 text-sm text-gray-600">{t.anyLocation}</p>
                </div>
                <div className="rounded-3xl bg-[#f1f7ff] p-5">
                  <p className="font-semibold text-gray-900">{t.service24_7}</p>
                  <p className="mt-2 text-sm text-gray-600">{t.availableAnyTime}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.pickupLocationLabel}</label>
                  <input
                    value={pickupLocation}
                    onChange={(event) => setPickupLocation(event.target.value)}
                    placeholder={t.pickupLocationPlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.dropoffLocationLabel}</label>
                  <input
                    value={dropoffLocation}
                    onChange={(event) => setDropoffLocation(event.target.value)}
                    placeholder={t.dropoffLocationPlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-gray-700">{t.popularDestinationsLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {popularDestinations.map((destination) => (
                    <button
                      key={destination}
                      type="button"
                      onClick={() => setDropoffLocation(destination)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        dropoffLocation === destination
                          ? 'border-teal-600 bg-teal-600 text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300 hover:bg-teal-50'
                      }`}
                    >
                      {destination}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500">{t.interHotelTransfersNote}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.nameLabel}</label>
                  <input
                    value={transferName}
                    onChange={(event) => setTransferName(event.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.emailLabel}</label>
                  <input
                    type="email"
                    value={transferEmail}
                    onChange={(event) => setTransferEmail(event.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.dateLabel}</label>
                  <input
                    type="date"
                    value={transferDate}
                    onChange={(event) => setTransferDate(event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{t.paxLabel}</label>
                  <input
                    type="number"
                    min={1}
                    value={transferPax}
                    onChange={(event) => setTransferPax(event.target.value)}
                    placeholder={t.paxPlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">{t.flightNumberLabel}</label>
                  <input
                    type="text"
                    value={transferFlight}
                    onChange={(event) => setTransferFlight(event.target.value)}
                    placeholder={t.flightPlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">{t.additionalNotesLabel}</label>
                  <textarea
                    rows={4}
                    value={transferNotes}
                    onChange={(event) => setTransferNotes(event.target.value)}
                    placeholder={t.additionalNotesPlaceholder}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                size="lg"
                onClick={openTransferRequest}
                disabled={!pickupLocation || !dropoffLocation || !transferName}
                className="mt-8 h-12 rounded-xl bg-teal-600 px-8 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t.requestTransfer}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[32px]">
                <img src="/images/luxury-resort.jpg" alt="Mauritius transfer service" className="h-full w-full object-cover" />
              </div>

              <div className="rounded-[32px] bg-teal-900 p-8 text-white">
                <h3 className="mb-6 text-2xl font-bold">{t.whyChooseTransfer}</h3>
                <ul className="space-y-4">
                  {[t.fixedPrices, t.flightTracking, t.professionalDrivers, t.comfortableVehicles, t.freeCancellation].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )

  const renderGalleryPage = (standalone: boolean) => (
    <>
      {standalone ? pageIntro(t.gallery, t.galleryTitle, t.gallerySubtitle) : null}
      <section id="gallery" className={`bg-white py-20 md:py-24 ${standalone ? '' : 'border-t border-gray-100'}`}>
        <div className="mx-auto max-w-7xl px-6">
          {!standalone && (
            <div className="mb-12 text-center">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-teal-600">{t.gallery}</p>
              <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">{t.galleryTitle}</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">{t.gallerySubtitle}</p>
            </div>
          )}
          {galleryLoading && <div className="mb-6 text-center text-gray-500">{t.galleryLoadingText}</div>}
          {galleryError && <div className="mb-6 text-center text-red-600">{galleryError}</div>}
          {!galleryLoading && !galleryError && currentImages.length === 0 && (
            <div className="mb-6 text-center text-gray-500">{t.galleryEmptyText}</div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {currentImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedGalleryImage(image)}
                className="group relative aspect-[4/4.6] overflow-hidden rounded-2xl"
                aria-label={`Open gallery image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                  <ImageIcon className="h-7 w-7 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-medium transition-colors ${
                    currentPage === page ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-teal-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="mt-14">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-teal-600">{t.videosKicker}</p>
              <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{t.videosTitle}</h3>
              <p className="mx-auto max-w-3xl text-lg text-gray-600">{t.videosSubtitle}</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {youtubeVideos.map((video, index) => {
                const isLoaded = loadedVideoIds.includes(video.id)
                const canLoad = Boolean(video.youtubeId)
                const thumbnailUrl = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`
                const embedParams = new URLSearchParams({
                  autoplay: '1',
                  rel: '0'
                })

                if (video.startSeconds) {
                  embedParams.set('start', String(video.startSeconds))
                }

                return (
                  <div key={video.id} className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    <div className="relative aspect-video bg-slate-900">
                      {isLoaded && video.youtubeId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?${embedParams.toString()}`}
                          title={`YouTube video ${index + 1}`}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="h-full w-full"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (!video.youtubeId) return
                            setLoadedVideoIds((current) => (current.includes(video.id) ? current : [...current, video.id]))
                          }}
                          disabled={!canLoad}
                          className="group relative h-full w-full text-left disabled:cursor-default"
                        >
                          <img
                            src={thumbnailUrl}
                            alt={`Video preview ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/15 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-5">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                                YouTube
                              </span>
                              {!canLoad ? (
                                <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                                  {t.videosComingSoon}
                                </span>
                              ) : null}
                            </div>
                            <div className="flex items-center gap-3 text-white">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-700 shadow-lg">
                                <Play className="ml-0.5 h-5 w-5 fill-current" />
                              </div>
                              <span className="text-sm font-medium text-white/90">{canLoad ? t.videosPlay : t.videosComingSoon}</span>
                            </div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              {youtubeChannelUrl ? (
                <a
                  href={youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                >
                  {t.videosChannelCta}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-default items-center rounded-full bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-500"
                >
                  {t.videosChannelCta}
                </button>
              )}
              {!youtubeChannelUrl ? <p className="mt-3 text-sm text-gray-500">{t.videosChannelPending}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )

  const renderAboutPage = (standalone: boolean) => (
    <>
      {standalone ? pageIntro(t.about, t.aboutTitle) : null}
      <section id="about" className={`bg-white pb-24 ${standalone ? 'pt-5 md:pt-6' : 'border-t border-gray-100 pt-20 md:pt-24'}`}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {!standalone && (
              <>
                <p className="mb-4 text-sm uppercase tracking-[0.2em] text-teal-600">{t.about}</p>
                <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">{t.aboutTitle}</h1>
              </>
            )}
            <p className="mb-5 text-lg leading-relaxed text-gray-600">{t.aboutText1}</p>
            <p className="mb-10 text-lg leading-relaxed text-gray-600">{t.aboutText2}</p>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-3xl bg-[#f4f9f8] px-5 py-7">
                <p className="text-3xl font-bold text-teal-600">100+</p>
                <p className="mt-1 text-sm text-gray-500">{t.happyTravelers}</p>
              </div>
              <div className="rounded-3xl bg-[#fff8ec] px-5 py-7">
                <p className="text-3xl font-bold text-amber-500">50+</p>
                <p className="mt-1 text-sm text-gray-500">{t.uniqueTours}</p>
              </div>
              <div className="rounded-3xl bg-[#eef7ff] px-5 py-7">
                <p className="text-3xl font-bold text-sky-600">4.9</p>
                <p className="mt-1 text-sm text-gray-500">{t.rating}</p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[36px]">
            <img src="/images/underwater-waterfall.jpg" alt="Mauritius" className="h-full w-full object-cover" />
          </div>

          <div className="mt-16 rounded-[32px] bg-gray-50 p-8 md:p-10">
            <div className="mb-10 text-center">
              <p className="mb-4 text-sm uppercase tracking-[0.2em] text-teal-600">{t.googleReviewsLabel}</p>
              <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{t.reviews}</h3>
              <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
                <a
                  href="https://g.page/r/CStIhENgKT_JEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-teal-700 underline hover:text-teal-800"
                >
                  {t.leaveGoogleReview}
                </a>
                <a
                  href="https://share.google/yWAztCjkqJIf9sXXC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-teal-700 underline hover:text-teal-800"
                >
                  {t.viewAllGoogleReviews}
                </a>
              </div>
              {reviewsLoading && <p className="mt-3 text-sm text-gray-500">{t.loadingReviews}</p>}
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {topReviews.map((review) => (
                <div key={review.id} className="rounded-3xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                      <span className="text-lg font-bold text-teal-600">{review.avatar}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  {review.text ? <p className="text-sm leading-6 text-gray-600">{review.text}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )

  const renderContactSection = () => (
    <section id="contact" className="relative overflow-hidden bg-gray-900 py-24 text-white md:py-32">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/images/beach-aerial.jpg)' }} />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-teal-400">{t.getInTouch}</p>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">{t.readyToExplore}</h2>
            <p className="mb-8 text-lg text-gray-300">{t.contactText}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[24px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-gray-300">{item.value}</p>
                  </a>
                )
              })}
            </div>

            <div className="mt-8 space-y-6">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 transition-colors group-hover:bg-green-500/30">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t.whatsappLabel}</p>
                  <p className="text-lg transition-colors group-hover:text-green-400">+230 5834 2797</p>
                </div>
              </a>
              <a href={`mailto:${contactEmail}`} className="group flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600/20 transition-colors group-hover:bg-teal-600/30">
                  <Mail className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t.emailLabel}</p>
                  <p className="text-lg transition-colors group-hover:text-teal-400">{contactEmail}</p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600/20">
                  <MapPin className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t.locationLabel}</p>
                  <p className="text-lg">{t.locationValue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
            <h3 className="mb-6 text-2xl font-bold">{t.sendMessage}</h3>
            <form
              className="space-y-4"
              onSubmit={submitContactForm}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={contactFirstName}
                  onChange={(event) => setContactFirstName(event.target.value)}
                  placeholder={t.firstNamePlaceholder}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-teal-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={contactLastName}
                  onChange={(event) => setContactLastName(event.target.value)}
                  placeholder={t.lastNamePlaceholder}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-teal-400 focus:outline-none"
                />
              </div>
              <input
                type="email"
                value={contactFormEmail}
                onChange={(event) => setContactFormEmail(event.target.value)}
                placeholder={t.emailAddressPlaceholder}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-teal-400 focus:outline-none"
              />
              <select
                value={contactActivityKey}
                onChange={(event) => setContactActivityKey(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-gray-300 focus:border-teal-400 focus:outline-none"
              >
                <option value="">{t.selectActivity}</option>
                {contactActivityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <textarea
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder={t.messagePlaceholder}
                rows={4}
                className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 focus:border-teal-400 focus:outline-none"
              />
              <Button type="submit" className="w-full bg-teal-600 py-6 text-white hover:bg-teal-700">
                <MessageCircle className="mr-2 h-5 w-5" />
                {t.sendMessage}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )

  const navItems: { key: NavKey; label: string }[] = [
    { key: 'home', label: t.home },
    { key: 'activities', label: t.activities },
    { key: 'tour-planner', label: t.tourPlanner },
    { key: 'transfers', label: t.airportTransfer },
    { key: 'gallery', label: t.gallery },
    { key: 'about', label: t.about },
    { key: 'contact', label: t.contact }
  ]

  return (
    <div className="min-h-screen bg-white">
      {selectedActivity && (
        <ActivityDetail
          activity={selectedActivity}
          t={t}
          onClose={() => setSelectedActivity(null)}
          onContact={openActivityBooking}
          onPreviewImage={setSelectedGalleryImage}
        />
      )}

      {bookingActivity && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md sm:items-center sm:p-6"
          onClick={() => setBookingActivity(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Book ${bookingActivity}`}
        >
          <div
            className="relative my-6 w-full max-w-xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl sm:my-8 sm:max-h-[calc(100vh-4rem)] sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close booking form"
              onClick={() => setBookingActivity(null)}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-600">{t.bookViaWhatsApp}</p>
            <h3 className="mt-3 text-2xl font-bold text-gray-900">{bookingActivity}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">Add the booking details below and we’ll open WhatsApp with the full request ready to send.</p>
            <form className="mt-6 space-y-4" onSubmit={submitActivityBooking}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t.nameLabel}</span>
                <input
                  type="text"
                  value={bookingName}
                  onChange={(event) => setBookingName(event.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t.paxLabel}</span>
                <input
                  type="number"
                  value={bookingPeople}
                  onChange={(event) => setBookingPeople(event.target.value)}
                  min="1"
                  placeholder={t.paxPlaceholder}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t.preferredDateLabel}</span>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(event) => setBookingDate(event.target.value)}
                    min={today}
                    required
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-gray-900 outline-none transition focus:border-teal-500"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t.emailLabel}</span>
                <input
                  type="email"
                  value={bookingEmail}
                  onChange={(event) => setBookingEmail(event.target.value)}
                  placeholder={t.emailLabel}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t.contactNumberLabel}</span>
                <input
                  type="text"
                  value={bookingPhone}
                  onChange={(event) => setBookingPhone(event.target.value)}
                  placeholder={t.contactNumberLabel}
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t.additionalNotesLabel}</span>
                <textarea
                  value={bookingNotes}
                  onChange={(event) => setBookingNotes(event.target.value)}
                  placeholder={t.additionalNotesLabel}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-teal-500"
                />
              </label>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => setBookingActivity(null)} className="h-12 flex-1 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
                <Button type="submit" className="h-12 flex-1 rounded-xl bg-teal-600 text-white hover:bg-teal-700">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t.bookViaWhatsApp}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
          onClick={() => setSelectedGalleryImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
        >
          <button
            type="button"
            aria-label="Close gallery image"
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative flex max-h-full w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img src={selectedGalleryImage} alt="Expanded gallery" className="max-h-[88vh] max-w-full rounded-2xl object-contain shadow-2xl" />
          </div>
        </div>
      )}

      {showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setShowMobileMenu(false)} aria-hidden="true" />
      )}

      {showActivityControls && (
        <>
          <button
            type="button"
            onClick={() => activityCarouselApi?.scrollPrev()}
            disabled={!activityCanPrev}
            aria-label="Previous activity"
            className="fixed left-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-600 text-white shadow-2xl transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-35 md:left-3 md:h-16 md:w-16"
          >
            <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          <button
            type="button"
            onClick={() => activityCarouselApi?.scrollNext()}
            disabled={!activityCanNext}
            aria-label="Next activity"
            className="fixed right-2 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-600 text-white shadow-2xl transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-35 md:right-3 md:h-16 md:w-16"
          >
            <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          </button>
        </>
      )}

      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled || (!isMobile && pageView !== 'home') ? 'bg-white/90 py-3 shadow-sm backdrop-blur-xl sm:py-4' : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <button className="flex shrink-0 items-center gap-2.5 sm:gap-3" onClick={() => navigateTo('home')}>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${
                scrolled || (!isMobile && pageView !== 'home') ? 'bg-teal-50' : 'border border-white/20 bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${scrolled || (!isMobile && pageView !== 'home') ? 'text-teal-600' : 'text-white'}`} fill="currentColor" />
            </div>
            <span className={`whitespace-nowrap text-base font-semibold tracking-[0.02em] sm:text-lg xl:text-xl ${scrolled || (!isMobile && pageView !== 'home') ? 'text-gray-900' : 'text-white'}`}>
              Just Love Tour
            </span>
          </button>

          <div className="hidden items-center gap-1 md:flex lg:gap-2">
            {navItems.map((item) => (
              (() => {
                const isActive = activeNavKey === item.key
                return (
              <button
                key={item.key}
                onClick={() => navigateTo(item.key)}
                className={`whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors lg:px-2.5 lg:text-sm xl:px-3 ${
                  scrolled || (!isMobile && pageView !== 'home')
                    ? isActive
                      ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                      : 'text-gray-700 hover:bg-gray-100'
                    : isActive
                      ? 'bg-white/18 text-white ring-1 ring-white/30 backdrop-blur-sm'
                      : 'text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
                )
              })()
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative" onClick={(event) => event.stopPropagation()}>
              <button
                onClick={() => setShowLangDropdown((value) => !value)}
                className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 transition-colors sm:px-3 ${
                  scrolled || (!isMobile && pageView !== 'home') ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium uppercase sm:text-sm">{lang}</span>
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 top-full mt-2 min-w-[120px] rounded-lg bg-white py-2 shadow-lg">
                  {(['en', 'fr', 'ru'] as const).map((language) => (
                    <button
                      key={language}
                      onClick={() => {
                        setLang(language)
                        setShowLangDropdown(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                        lang === language ? 'font-medium text-teal-600' : 'text-gray-700'
                      }`}
                    >
                      {language === 'en' ? 'English' : language === 'fr' ? 'Français' : 'Русский'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative md:hidden" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                aria-label={showMobileMenu ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={showMobileMenu}
                onClick={() => setShowMobileMenu((value) => !value)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  scrolled || (!isMobile && pageView !== 'home') ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'
                }`}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {showMobileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-black/5 bg-white/95 p-2 shadow-xl backdrop-blur-xl">
                  {navItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => navigateTo(item.key)}
                      className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => openActivityBooking('Just Love Tour')}
              className={`hidden whitespace-nowrap px-4 text-sm lg:flex xl:px-5 ${
                scrolled || (!isMobile && pageView !== 'home')
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'border border-white/30 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
              }`}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t.bookOnWhatsApp}
            </Button>
          </div>
        </div>
      </nav>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="animate-pulse-slow fixed bottom-6 right-6 z-50 rounded-full bg-green-500 p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-xl"
        title={t.whatsappFabTitle}
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </a>

      <main>
        {isMobile ? (
          <>
            {renderHomePage()}
            {renderTourPlannerPage(false)}
            {renderTransfersPage(false)}
            {renderGalleryPage(false)}
            {renderAboutPage(false)}
          </>
        ) : (
          <>
            {pageView === 'home' && renderHomePage()}
            {pageView === 'tour-planner' && renderTourPlannerPage(true)}
            {pageView === 'transfers' && renderTransfersPage(true)}
            {pageView === 'gallery' && renderGalleryPage(true)}
            {pageView === 'about' && renderAboutPage(true)}
          </>
        )}
        {renderContactSection()}
      </main>

      <footer className="bg-gray-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-teal-500" fill="currentColor" />
                <span className="text-xl font-semibold">Just Love Tour</span>
              </div>
              <p className="mb-6 max-w-md text-gray-400">{t.footerDescription}</p>
              <div className="flex gap-4">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 transition-colors hover:bg-green-600">
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-teal-600">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={facebookLink} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-teal-600">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t.quickLinks}</h4>
              <ul className="space-y-2 text-gray-400">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <button onClick={() => navigateTo(item.key)} className="transition-colors hover:text-teal-400">
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t.activities}</h4>
              <ul className="space-y-2 text-gray-400">
                {activityCards.map((activity) => (
                  <li key={activity.key}>
                    <button onClick={() => setSelectedActivity(activity.key)} className="transition-colors hover:text-teal-400">
                      {activity.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="mb-3 text-sm text-gray-400">© 2026 Just Love Tour. {t.allRightsReserved}.</p>
            <p className="text-sm text-gray-400">
              {t.madeWith} <Heart className="inline h-4 w-4 text-red-500" fill="currentColor" /> {t.inMauritius}
            </p>
            <a
              href="https://kpmstudios.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-white underline underline-offset-4 hover:text-teal-300"
            >
              kpmstudios.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
