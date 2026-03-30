export type Lang = 'en' | 'fr' | 'ru'

// Keep this file as the single source of truth for UI strings.
// Using `as const` gives us nice type-safety + autocomplete.
export const translations = {
  en: {
    home: 'Home',
    about: 'About Us',
    activities: 'Activities',
    gallery: 'Gallery',
    airportTransfer: 'Transfers',
    contact: 'Contact Us',
    bookOnWhatsApp: 'Book on WhatsApp',
    discoverParadise: 'Discover Paradise',
    heroTitle: 'Just Love Tour',
    heroSubtitle:
      'Experience the magic of Mauritius with unforgettable adventures, breathtaking sights, and exclusive experiences',
    swipeActivities: 'Swipe left or right to explore all activities',
    exploreActivities: 'Explore Activities',
    chatOnWhatsApp: 'Chat on WhatsApp',
    tourPlanner: 'Tour Planner',
    aboutTitle: 'Your Gateway to Mauritian Paradise',
    aboutText1:
      "Based in the heart of Mauritius, Just Love Tour is your trusted partner for discovering the island's hidden gems.",
    aboutText2:
      'Our local expertise and passion for hospitality ensure every journey is personalized, safe, and absolutely unforgettable.',
    yearsExperience: 'Years Experience',
    happyTravelers: 'Happy Travelers',
    uniqueTours: 'Unique Tours',
    rating: 'Rating',
    ourActivities: 'Our Activities',
    activitiesSubtitle:
      'Choose from our carefully curated selection of tours and activities designed to showcase the best of Mauritius',
    learnMore: 'View Details',
    bookViaWhatsApp: 'Book via WhatsApp',
    guideLanguagesNote: 'English, French, German, Italian, and Russian-speaking guides are available with Just Love Tour.',
    galleryTitle: 'Memories from Our Tours',
    gallerySubtitle:
      'Beautiful moments captured during our unforgettable adventures with happy travelers',
    adminSection: 'Admin Section',
    addNewPhoto: 'Add New Photo (Admin)',
    airportTitle: 'Airport Transfer Request',
    airportSubtitle:
      'Start and end your Mauritius journey stress-free with our reliable airport transfer service.',
    privateTransfers: 'Private Transfers',
    allDestinations: 'All Destinations',
    service24_7: '24/7 Service',
    whyChooseTransfer: 'Why Choose Our Transfer?',
    fixedPrices: 'Fixed prices - no hidden fees',
    flightTracking: 'Flight tracking - we monitor delays',
    professionalDrivers: 'Professional multilingual speaking driver',
    comfortableVehicles: 'Air-conditioned, comfortable vehicles',
    freeCancellation: 'Free cancellation up to 24 hours',
    requestTransfer: 'Request Transfer on WhatsApp',
    pickupLocationLabel: 'Pickup location',
    pickupLocationPlaceholder: 'Type your custom pickup location',
    dropoffLocationLabel: 'Dropoff location',
    dropoffLocationPlaceholder: 'Type your custom dropoff location',
    popularDestinationsLabel: 'Popular destinations',
    interHotelTransfersNote: 'We also offer inter-hotel transfers for guests changing hotels during their stay.',
    nameLabel: 'Name',
    namePlaceholder: 'Your full name',
    emailLabel: 'Email address',
    contactNumberLabel: 'Contact number',
    preferredDateLabel: 'Preferred date',
    emailPlaceholder: 'name@example.com',
    additionalNotesLabel: 'Additional notes',
    additionalNotesPlaceholder: 'Flight delay, hotel name, child seat, extra stop, or anything else we should know.',

    // Airport form
    dateLabel: 'Date',
    paxLabel: 'Number of pax',
    paxPlaceholder: 'e.g. 2',
    flightNumberLabel: 'Flight number (optional)',
    flightPlaceholder: 'e.g. MK 745',
    directToHotel: 'Direct to your hotel or villa',
    anyLocation: 'Any location in Mauritius',
    availableAnyTime: 'Available any time, any day',
    whyChooseUs: 'Why Choose Us',
    whyChooseTitle: 'The Just Love Tour Difference',
    localExpertise: 'Local Expertise',
    localExpertiseText:
      'Born and raised in Mauritius, we know every hidden corner and secret spot that makes this island truly special',
    personalizedService: 'Personalized Service',
    personalizedServiceText:
      'Every tour is tailored to your preferences, ensuring a unique and memorable experience just for you',
    premiumQuality: 'Premium Quality',
    premiumQualityText:
      'From transportation to guides, we maintain the highest standards for your comfort and safety',
    getInTouch: 'Get In Touch',
    readyToExplore: 'Ready to Explore Mauritius?',
    contactText:
      'Contact us today to start planning your dream vacation. Our team is ready to create the perfect itinerary for you.',
    footerDescription:
      'Your trusted partner for unforgettable experiences in Mauritius. We create memories that last a lifetime.',
    sendMessage: 'Send via WhatsApp',
    firstNamePlaceholder: 'First Name',
    lastNamePlaceholder: 'Last Name',
    emailAddressPlaceholder: 'Email Address',
    messagePlaceholder: 'Your Message',
    whatsappLabel: 'WhatsApp',
    openProfile: 'Open profile',
    openPage: 'Open page',
    readReviews: 'Read reviews',
    locationLabel: 'Location',
    locationValue: 'St Clement, Curepipe',
    quickLinks: 'Quick Links',
    allRightsReserved: 'All rights reserved',
    madeWith: 'Made with',
    inMauritius: 'in Mauritius',
    developedBy: 'Website developed and hosted by KPM Studios',

    // Reviews
    reviews: 'What Our Guests Say',
    videosKicker: 'Video Highlights',
    videosTitle: 'See Mauritius in motion',
    videosSubtitle: 'Video previews appear instantly, and the YouTube player loads only when a guest clicks play.',
    videosComingSoon: 'Video link coming soon',
    videosPlay: 'Click to load video',
    videosChannelCta: 'View all videos on YouTube',
    videosChannelPending: 'YouTube channel link coming soon',
    galleryLoadingText: 'Loading gallery…',
    galleryEmptyText: 'No gallery images yet.',
    googleReviewsLabel: 'Google Reviews',
    leaveGoogleReview: 'Leave a 5-star review on Google',
    viewAllGoogleReviews: 'View all reviews on Google',
    loadingReviews: 'Loading latest reviews…',

    // Activity labels
    adventureTours: 'Adventure Tours',
    activityAdventureCardDesc: 'Zip-lining, scenic viewpoints, and adrenaline-filled outdoor experiences.',
    ileAuxCerfsTours: 'Ile aux Cerfs / 5 Islands Tours',
    activityIleAuxCerfsCardDesc: 'A full day at sea with lagoon cruising, island stops, and time to relax on the water.',
    hiking: 'Hiking',
    activityHikingCardDesc: 'Guided hikes across iconic mountains, valleys, and hidden waterfalls.',
    quadBikes: 'Quad Bikes',
    activityQuadCardDesc: 'Power through sugar cane trails and open landscapes with expert guidance.',
    faunaFlora: 'Fauna & Flora',
    activityFaunaCardDesc: 'A scenic island discovery through nature, culture, and landmark stops.',
    catamaranSpeedBoat: 'Catamaran & Speed Boat Cruises',
    activityCatamaranCardDesc: 'Cruise turquoise lagoons, meet dolphins, and spend the day island hopping.',
    bigGameFishing: 'Big Game Fishing',
    activityBigGameFishingCardDesc: 'Head offshore with experienced skippers for a deep-sea fishing trip from top coastal spots.',
    punch: 'Punch',
    frontierSpiritAdventures: 'Frontier Spirit Adventures',
    adventure: 'Adventure',
    nature: 'Nature',
    thrills: 'Thrills',
    sightseeing: 'Sightseeing',
    sea: 'Sea',
    luxury: 'Luxury',
    selectActivity: 'Select an Activity',

    // Innovation UI
    mauritiusToday: 'Mauritius today',
    weatherLoading: 'Loading weather…',
    weatherUnavailable: 'Weather unavailable',
    weatherClear: 'Clear',
    weatherPartlyCloudy: 'Partly cloudy',
    weatherFog: 'Fog',
    weatherRain: 'Rain',
    weatherSnow: 'Snow',
    weatherMixed: 'Mixed',

    exploreMauritius: 'Explore Mauritius',
    exploreMauritiusTitle: 'Tap a region to discover tours',
    exploreMauritiusSubtitle: 'A quick way to understand the island and choose the perfect experience.',
    regionAll: 'All',
    regionNorth: 'North',
    regionSouth: 'South',
    regionEast: 'East',
    regionWest: 'West',
    regionNature: 'Nature',
    tapToView: 'Tap to view',

    recommenderKicker: 'Tour Recommender',
    recommenderTitle: 'Find your perfect experience',
    recommenderSubtitle: 'Answer 3 quick questions and we’ll suggest the best tours for you.',
    recommenderTravellerType: 'Traveller type',
    recommenderDays: 'How many days in Mauritius?',
    recommenderFocus: 'What do you want to experience?',
    travellerCouple: 'Couple',
    travellerFamily: 'Family',
    travellerAdventure: 'Adventure seeker',
    travellerRelaxed: 'Relaxed explorer',
    days12: '1–2 days',
    days35: '3–5 days',
    days7plus: '7+ days',
    interestNature: 'Nature',
    interestAdventure: 'Adventure',
    interestCulture: 'Culture',
    interestBeaches: 'Beaches',
    recommendedForYou: 'Recommended for you',
    recommenderHint: 'Select options above to see recommendations.',

    plannerKicker: 'Instant Tour Planner',
    plannerTitle: 'Plan your Mauritius trip',
    plannerSubtitle: 'Send us your dates and preferences — we’ll suggest an itinerary on WhatsApp.',
    plannerDates: 'Travel dates',
    plannerDatesPlaceholder: 'e.g. 12–16 July',
    plannerPeople: 'Number of travellers',
    plannerPeoplePlaceholder: 'e.g. 2 adults',
    plannerInterests: 'Interests',
    plannerCta: 'Plan my trip on WhatsApp',
    plannerReset: 'Reset',

    planMsgHello: 'Hi Just Love Tour!',
    planMsgDates: 'Dates',
    planMsgPeople: 'People',
    planMsgInterests: 'Interested in',
    planMsgNotSet: 'Not set',
    planMsgAsk: 'Can you recommend an itinerary and best tours for us?',
    notProvided: 'Not provided',
    transferMsgHello: 'Hello! I would like to request a transfer in Mauritius.',
    transferMsgName: 'Name',
    transferMsgEmail: 'Email',
    transferMsgPickup: 'Pickup location',
    transferMsgDropoff: 'Dropoff location',
    transferMsgDate: 'Date',
    transferMsgPax: 'Pax',
    transferMsgFlight: 'Flight',
    transferMsgNotes: 'Additional notes',
    bookingMessage: 'Hello! I would like to book a tour with Just Love Tour.',
    bookingInterestMessage: 'Hello! I am interested in booking a tour.',
    contactQuestionMessage: 'Hello! I have a question about your tours.',
    contactActivityMessage: "Hi! I'd like to book",
    whatsappFabTitle: 'Chat on WhatsApp',

    // Learn-more page
    backToActivities: 'Back to Activities',
    highlightsTitle: 'Highlights',
    viewedToday: '{n} travellers viewed this experience today',
    travelTimeTitle: 'Travel time',
    travelTimeSubtitle: 'Estimated drive time from popular areas',
    fromGrandBaie: 'From Grand Baie',
    fromFlicEnFlac: 'From Flic en Flac',
    fromPortLouis: 'From Port Louis',
    onlyInMauritiusTitle: 'Only in Mauritius',
    readyToBook: 'Ready to Book?',
    readyToBookText: 'Contact us on WhatsApp for exceptional deals and personalized packages!',
    contactOnWhatsApp: 'Book Via WhatsApp',

    // "Only in Mauritius" story blocks (2 items per activity)
    adventureStories: [
      {
        title: 'Seven Coloured Earth',
        text: 'A rare natural dune formed by volcanic minerals—Mauritius’ iconic geological wonder.'
      },
      {
        title: 'Tropical microclimates',
        text: 'Short drives can take you from sunny coastlines to misty green valleys—perfect for adventure days.'
      }
    ],
    hikingStories: [
      {
        title: 'Le Morne & UNESCO heritage',
        text: 'Le Morne is a powerful symbol of freedom and one of the island’s most dramatic coastal peaks.'
      },
      {
        title: 'Waterfall trails',
        text: 'Mauritius hides lush inland forests and cascades—hiking reveals a side most visitors never see.'
      }
    ],
    quadStories: [
      {
        title: 'Sugar cane landscapes',
        text: 'Sugar cane fields shaped Mauritius for centuries—riding through them is a true local experience.'
      },
      {
        title: 'Coast-to-country routes',
        text: 'In a single ride you can pass farmland, hills and ocean views—classic island contrast.'
      }
    ],
    faunaStories: [
      {
        title: 'Sacred Grand Bassin',
        text: 'A crater lake revered by Mauritian Hindus—peaceful, cultural and deeply meaningful.'
      },
      {
        title: 'Endemic nature',
        text: 'Mauritius is home to unique plants and wildlife—some found nowhere else on Earth.'
      }
    ],
    catamaranStories: [
      {
        title: 'Lagoon blues',
        text: 'Mauritius lagoons glow in shades of turquoise thanks to coral reefs and white sand shallows.'
      },
      {
        title: 'Island hopping',
        text: 'Tiny offshore islets offer postcard beaches and calm snorkelling—perfect for a sea day.'
      }
    ],
    ileAuxCerfsStories: [
      {
        title: 'The east coast lagoon',
        text: 'The east of Mauritius is home to one of the island’s largest lagoons, known for calm water and vivid turquoise tones.'
      },
      {
        title: 'Island escape rhythm',
        text: 'These sea days blend sailing, swimming, beach time, and relaxed cruising into one easy full-day outing.'
      }
    ],
    bigGameFishingStories: [
      {
        title: 'Offshore currents',
        text: 'Mauritius sits near deep-water channels where powerful ocean currents attract prized sport fish close to the island.'
      },
      {
        title: 'West, east, and north departures',
        text: 'Launching from different coasts lets anglers match weather conditions and seasonal fishing grounds throughout the year.'
      }
    ],
    frontierStories: [
      {
        title: 'Port Louis heritage',
        text: 'A vibrant capital where cultures meet—markets, colonial history, and authentic local life.'
      },
      {
        title: "L’Aventure du Sucre",
        text: 'A beautiful museum about Mauritius’ sugar story, with tastings that bring the history to life.'
      }
    ],

    // Learn-more content (translated)
    adventureDesc:
      'Experience the thrill of Mauritius with our Adventure Tours at La Vallée des Couleurs. Zip-line over stunning landscapes and create your own custom itinerary.',
    adventureHighlights: [
      'La Vallée des Couleurs - Natural park with colored earth',
      'Zip-lining adventures with panoramic views',
      'Custom itineraries based on your preferences',
      'Professional guides and safety equipment',
      'Suitable for all adventure levels',
    ],

    hikingDesc:
      "Discover Mauritius on foot with our guided hiking tours. From majestic mountains to hidden waterfalls, experience the island's natural beauty.",
    hikingHighlights: [
      'Le Morne Brabant - UNESCO World Heritage Site',
      'Tamarind Falls - Seven cascading waterfalls',
      'Le Pouce Mountain - Panoramic views of Port Louis',
      'Alexandra Falls - Breathtaking scenery',
      'Expert local guides with extensive knowledge',
    ],

    quadDesc:
      "Ride through Mauritius' stunning landscapes on powerful quad bikes. An adrenaline-pumping adventure through sugar cane fields and coastal trails.",
    quadHighlights: [
      'Sugar cane field trails',
      'Coastal and mountain routes',
      'All safety equipment provided',
      'No experience necessary',
      'Professional instruction included',
    ],

    faunaDesc:
      'Explore the rich biodiversity of Mauritius. From sacred sites to natural wonders, discover what makes this island unique.',
    faunaHighlights: [
      'Grand Bassin - Sacred Hindu lake and temple',
      'Alexandra Falls - Stunning waterfall views',
      'Black River Gorges National Park',
      'Chamarel 7 Colored Earth',
      'Ebony Forest - Endemic wildlife sanctuary',
    ],

    catamaranDesc:
      'Experience the best of Mauritius waters with our Catamaran & Speed Boat Cruises. From dolphin encounters to island hopping, adventure awaits.',
    catamaranHighlights: [
      'West Coast Adventure: Dolphin swimming with Dolswim, Crystal Rock snorkeling, Fun fishing, Lunch on Île aux Bénitiers',
      'East Coast Escapade: Visit Ile aux Cerfs & Grande Rivière Sud-Est Waterfall, Speedboat to 5 Islands, Island-style lunch',
      'Professional crew and safety equipment',
      'All-inclusive packages available',
    ],

    ileAuxCerfsDesc:
      'Spend a relaxing full day at sea on the east coast, cruising across Mauritius’ wide turquoise lagoon with time for island stops, swimming, and easy sailing.',
    ileAuxCerfsHighlights: [
      'Full-day catamaran or boat outing on the east coast lagoon',
      'Ile aux Cerfs and 5 Islands route options',
      'Swimming, scenic cruising, and beach time during the day',
      'Ideal for couples, families, and small groups seeking a relaxed sea experience',
      'Departure options depend on the selected cruise program and weather conditions',
    ],

    bigGameFishingDesc:
      'Set out for a big game fishing experience with local crews from some of Mauritius’ best launch points, combining offshore action, local know-how, and a memorable day on the Indian Ocean.',
    bigGameFishingHighlights: [
      'Available departures from Flic en Flac, Rivière Noire, Trou d’Eau Douce, Belle Mare, and Grand Baie',
      'Deep-sea fishing with experienced local skippers and equipped boats',
      'Great option for beginners and seasoned anglers alike',
      'Flexible coast selection based on season, sea conditions, and preferred area',
      'Private trips can be arranged for couples, families, or groups',
    ],

    frontierSpiritShort:
      'A curated North & Port Louis discovery: heritage views, local markets, gardens, and the iconic sugar museum.',
    frontierSpiritDesc:
      "Discover the vibrant north and the capital with a relaxed, guided day that blends culture, history, and local flavors—perfect for first-timers and curious explorers.",
    frontierSpiritHighlights: [
      'Port Louis Citadel (Fort Adelaide) – panoramic views over the harbor and city',
      'Port Louis markets – local crafts, souvenirs, and authentic street-life',
      'Pamplemousses Botanical Garden – one of the most famous gardens in the Indian Ocean',
      "L'Aventure du Sucre – the island’s iconic sugar museum with tastings and local history",
      'Comfortable transfers, flexible pacing, and photo stops along the way',
    ],

    punchDesc:
      'Relax and enjoy authentic Mauritian punch cocktails by the seaside. A perfect way to unwind after a day of adventure.',
    punchHighlights: [
      'Traditional Mauritian rum punch',
      'Beachside locations with stunning views',
      'Fresh local ingredients',
      'Perfect for sunset watching',
      'Group packages available',
    ],
  },

  fr: {
    home: 'Accueil',
    about: 'À Propos',
    activities: 'Activités',
    gallery: 'Galerie',
    airportTransfer: 'Transferts',
    contact: 'Contact',
    bookOnWhatsApp: 'Réserver sur WhatsApp',
    discoverParadise: 'Découvrez le Paradis',
    heroTitle: 'Just Love Tour',
    heroSubtitle:
      'Découvrez la magie de Maurice avec des aventures inoubliables, des vues à couper le souffle et des expériences exclusives',
    swipeActivities: 'Glissez à gauche ou à droite pour découvrir toutes les activités',
    exploreActivities: 'Explorer les Activités',
    chatOnWhatsApp: 'Discuter sur WhatsApp',
    tourPlanner: 'Planificateur',
    aboutTitle: 'Votre Porte vers le Paradis Mauricien',
    aboutText1:
      "Basé au cœur de Maurice, Just Love Tour est votre partenaire de confiance pour découvrir les trésors cachés de l'île.",
    aboutText2:
      "Notre expertise locale et notre passion pour l'hospitalité garantissent un voyage personnalisé, sûr et absolument inoubliable.",
    yearsExperience: "Années d'Expérience",
    happyTravelers: 'Voyageurs Heureux',
    uniqueTours: 'Tours Uniques',
    rating: 'Note',
    ourActivities: 'Nos Activités',
    activitiesSubtitle:
      "Choisissez parmi notre sélection soigneusement choisie de tours et d'activités conçus pour mettre en valeur le meilleur de Maurice",
    learnMore: 'Voir les détails',
    bookViaWhatsApp: 'Réserver sur WhatsApp',
    guideLanguagesNote: 'Des guides parlant anglais, français, allemand, italien et russe sont disponibles avec Just Love Tour.',
    galleryTitle: 'Souvenirs de Nos Tours',
    gallerySubtitle:
      'Moments magnifiques capturés lors de nos aventures inoubliables avec des voyageurs heureux',
    adminSection: 'Section Admin',
    addNewPhoto: 'Ajouter Nouvelle Photo (Admin)',
    airportTitle: "Demande de Transfert Aéroport",
    airportSubtitle:
      "Commencez et terminez votre voyage à Maurice sans stress avec notre service de transfert aéroport fiable.",
    privateTransfers: 'Transferts Privés',
    allDestinations: 'Toutes Destinations',
    service24_7: 'Service 24/7',
    whyChooseTransfer: 'Pourquoi Choisir Notre Transfert?',
    fixedPrices: 'Prix fixes - pas de frais cachés',
    flightTracking: 'Suivi de vol - nous surveillons les retards',
    professionalDrivers: 'Chauffeur professionnel multilingue',
    comfortableVehicles: 'Véhicules climatisés et confortables',
    freeCancellation: "Annulation gratuite jusqu'à 24 heures",
    requestTransfer: 'Demander Transfert sur WhatsApp',
    pickupLocationLabel: 'Lieu de prise en charge',
    pickupLocationPlaceholder: 'Indiquez votre lieu de prise en charge',
    dropoffLocationLabel: 'Lieu de dépôt',
    dropoffLocationPlaceholder: 'Indiquez votre lieu de dépôt',
    popularDestinationsLabel: 'Destinations populaires',
    interHotelTransfersNote: "Nous proposons aussi des transferts entre hôtels pour les voyageurs qui changent d'hébergement pendant leur séjour.",
    nameLabel: 'Nom',
    namePlaceholder: 'Votre nom complet',
    emailLabel: 'Adresse e-mail',
    contactNumberLabel: 'Numéro de contact',
    preferredDateLabel: 'Date souhaitée',
    emailPlaceholder: 'nom@exemple.com',
    additionalNotesLabel: 'Notes complémentaires',
    additionalNotesPlaceholder: "Retard de vol, nom de l'hôtel, siège enfant, arrêt supplémentaire ou toute autre précision utile.",

    // Formulaire transfert
    dateLabel: 'Date',
    paxLabel: 'Nombre de passagers',
    paxPlaceholder: 'ex. 2',
    flightNumberLabel: 'Numéro de vol (optionnel)',
    flightPlaceholder: 'ex. MK 745',
    directToHotel: 'Directement vers votre hôtel ou villa',
    anyLocation: "Partout à l'île Maurice",
    availableAnyTime: 'Disponible à tout moment, tous les jours',
    whyChooseUs: 'Pourquoi Nous Choisir',
    whyChooseTitle: 'La Différence Just Love Tour',
    localExpertise: 'Expertise Locale',
    localExpertiseText:
      "Nés et élevés à Maurice, nous connaissons chaque coin caché et spot secret qui rend cette île vraiment spéciale",
    personalizedService: 'Service Personnalisé',
    personalizedServiceText:
      "Chaque tour est adapté à vos préférences, garantissant une expérience unique et mémorable juste pour vous",
    premiumQuality: 'Qualité Premium',
    premiumQualityText:
      "Du transport aux guides, nous maintenons les plus hauts standards pour votre confort et votre sécurité",
    getInTouch: 'Contactez-Nous',
    readyToExplore: 'Prêt à Explorer Maurice?',
    contactText:
      "Contactez-nous aujourd'hui pour commencer à planifier vos vacances de rêve. Notre équipe est prête à créer l'itinéraire parfait pour vous.",
    footerDescription:
      'Votre partenaire de confiance pour des expériences inoubliables à Maurice. Nous créons des souvenirs qui durent toute une vie.',
    sendMessage: 'Envoyer sur WhatsApp',
    firstNamePlaceholder: 'Prénom',
    lastNamePlaceholder: 'Nom',
    emailAddressPlaceholder: 'Adresse e-mail',
    messagePlaceholder: 'Votre message',
    whatsappLabel: 'WhatsApp',
    openProfile: 'Ouvrir le profil',
    openPage: 'Ouvrir la page',
    readReviews: 'Lire les avis',
    locationLabel: 'Localisation',
    locationValue: 'St Clement, Curepipe',
    quickLinks: 'Liens Rapides',
    allRightsReserved: 'Tous droits réservés',
    madeWith: 'Fait avec',
    inMauritius: 'à Maurice',
    developedBy: 'Site web développé et hébergé par KPM Studios',

    reviews: 'Ce Que Disent Nos Clients',
    videosKicker: 'Moments en vidéo',
    videosTitle: 'Découvrez Maurice en mouvement',
    videosSubtitle: 'Les aperçus vidéo s’affichent immédiatement, et le lecteur YouTube ne se charge qu’au clic.',
    videosComingSoon: 'Lien vidéo à venir',
    videosPlay: 'Cliquer pour charger la vidéo',
    videosChannelCta: 'Voir toutes les vidéos sur YouTube',
    videosChannelPending: 'Lien de la chaîne YouTube à venir',
    galleryLoadingText: 'Chargement de la galerie…',
    galleryEmptyText: "Aucune image dans la galerie pour l'instant.",
    googleReviewsLabel: 'Avis Google',
    leaveGoogleReview: 'Laisser un avis 5 étoiles sur Google',
    viewAllGoogleReviews: 'Voir tous les avis sur Google',
    loadingReviews: 'Chargement des derniers avis…',

    adventureTours: "Tours d'Aventure",
    activityAdventureCardDesc: 'Tyroliennes, points de vue panoramiques et expériences outdoor pleines d’adrénaline.',
    ileAuxCerfsTours: 'Ile aux Cerfs / 5 Islands Tours',
    activityIleAuxCerfsCardDesc: 'Une journée en mer entre lagon, arrêts sur les îles et moments de détente sur l’eau.',
    hiking: 'Randonnée',
    activityHikingCardDesc: 'Randonnées guidées entre montagnes emblématiques, vallées et cascades cachées.',
    quadBikes: 'Quads',
    activityQuadCardDesc: 'Parcourez les champs de canne et grands espaces avec un accompagnement expert.',
    faunaFlora: 'Faune & Flore',
    activityFaunaCardDesc: 'Une découverte panoramique de l’île entre nature, culture et sites incontournables.',
    catamaranSpeedBoat: 'Croisières Catamaran & Speed Boat',
    activityCatamaranCardDesc: 'Naviguez sur les lagons turquoise, observez les dauphins et profitez d’une journée d’île en île.',
    bigGameFishing: 'Big Game Fishing',
    activityBigGameFishingCardDesc: 'Partez au large avec des skippers expérimentés pour une sortie de pêche sportive en mer.',
    punch: 'Punch',
    frontierSpiritAdventures: 'Frontier Spirit Adventures',
    adventure: 'Aventure',
    nature: 'Nature',
    thrills: 'Frissons',
    sightseeing: 'Visites',
    sea: 'Mer',
    luxury: 'Luxe',
    selectActivity: 'Sélectionner une Activité',

    // Innovation UI
    mauritiusToday: "Maurice aujourd'hui",
    weatherLoading: 'Météo…',
    weatherUnavailable: 'Météo indisponible',
    weatherClear: 'Ensoleillé',
    weatherPartlyCloudy: 'Partiellement nuageux',
    weatherFog: 'Brouillard',
    weatherRain: 'Pluie',
    weatherSnow: 'Neige',
    weatherMixed: 'Variable',

    exploreMauritius: 'Explorer Maurice',
    exploreMauritiusTitle: 'Touchez une région pour découvrir les tours',
    exploreMauritiusSubtitle: "Un moyen simple de comprendre l'île et de choisir l’expérience idéale.",
    regionAll: 'Tous',
    regionNorth: 'Nord',
    regionSouth: 'Sud',
    regionEast: 'Est',
    regionWest: 'Ouest',
    regionNature: 'Nature',
    tapToView: 'Voir',

    recommenderKicker: 'Recommandation',
    recommenderTitle: 'Trouvez votre expérience idéale',
    recommenderSubtitle: 'Répondez à 3 questions et nous vous proposons les meilleurs tours.',
    recommenderTravellerType: 'Profil voyageur',
    recommenderDays: 'Combien de jours à Maurice ?',
    recommenderFocus: 'Que voulez-vous vivre ?',
    travellerCouple: 'Couple',
    travellerFamily: 'Famille',
    travellerAdventure: "Amateur d'aventure",
    travellerRelaxed: 'Explorateur relax',
    days12: '1–2 jours',
    days35: '3–5 jours',
    days7plus: '7+ jours',
    interestNature: 'Nature',
    interestAdventure: 'Aventure',
    interestCulture: 'Culture',
    interestBeaches: 'Plages',
    recommendedForYou: 'Recommandé pour vous',
    recommenderHint: 'Choisissez les options ci-dessus pour voir des recommandations.',

    plannerKicker: 'Planificateur instantané',
    plannerTitle: 'Planifiez votre séjour à Maurice',
    plannerSubtitle: 'Envoyez vos dates et préférences — nous proposons un itinéraire sur WhatsApp.',
    plannerDates: 'Dates de voyage',
    plannerDatesPlaceholder: 'ex. 12–16 juillet',
    plannerPeople: 'Nombre de voyageurs',
    plannerPeoplePlaceholder: 'ex. 2 adultes',
    plannerInterests: "Centres d'intérêt",
    plannerCta: 'Planifier sur WhatsApp',
    plannerReset: 'Réinitialiser',

    planMsgHello: 'Bonjour Just Love Tour !',
    planMsgDates: 'Dates',
    planMsgPeople: 'Personnes',
    planMsgInterests: "Intéressé par",
    planMsgNotSet: 'Non précisé',
    planMsgAsk: 'Pouvez-vous recommander un itinéraire et les meilleurs tours ?',
    notProvided: 'Non renseigné',
    transferMsgHello: 'Bonjour ! Je souhaite demander un transfert à Maurice.',
    transferMsgName: 'Nom',
    transferMsgEmail: 'E-mail',
    transferMsgPickup: 'Lieu de prise en charge',
    transferMsgDropoff: 'Lieu de dépôt',
    transferMsgDate: 'Date',
    transferMsgPax: 'Passagers',
    transferMsgFlight: 'Vol',
    transferMsgNotes: 'Notes complémentaires',
    bookingMessage: 'Bonjour ! Je souhaite réserver un tour avec Just Love Tour.',
    bookingInterestMessage: 'Bonjour ! Je souhaite réserver un tour.',
    contactQuestionMessage: "Bonjour ! J'ai une question concernant vos tours.",
    contactActivityMessage: "Bonjour ! Je souhaite réserver",
    whatsappFabTitle: 'Discuter sur WhatsApp',

    backToActivities: 'Retour aux Activités',
    highlightsTitle: 'Points forts',
    viewedToday: "{n} voyageurs ont consulté cette expérience aujourd'hui",
    travelTimeTitle: 'Temps de trajet',
    travelTimeSubtitle: 'Durée estimée depuis les zones populaires',
    fromGrandBaie: 'Depuis Grand Baie',
    fromFlicEnFlac: 'Depuis Flic en Flac',
    fromPortLouis: 'Depuis Port Louis',
    onlyInMauritiusTitle: 'Seulement à Maurice',
    readyToBook: 'Prêt à Réserver?',
    readyToBookText:
      'Contactez-nous sur WhatsApp pour des offres exceptionnelles et des formules personnalisées !',
    contactOnWhatsApp: 'Réserver via WhatsApp',

    adventureStories: [
      {
        title: 'Terre des 7 couleurs',
        text: "Une dune naturelle rare formée par des minéraux volcaniques—un symbole de l'île."
      },
      {
        title: 'Microclimats tropicaux',
        text: 'En quelques minutes, vous passez de la côte ensoleillée aux vallées verdoyantes et fraîches.'
      }
    ],
    hikingStories: [
      {
        title: 'Le Morne & patrimoine UNESCO',
        text: "Un lieu fort de l'histoire mauricienne et un sommet spectaculaire au bord du lagon."
      },
      {
        title: 'Sentiers vers les cascades',
        text: "L'intérieur de l'île cache forêts luxuriantes et chutes d'eau—une autre facette de Maurice."
      }
    ],
    quadStories: [
      {
        title: 'Paysages de canne à sucre',
        text: "La canne a façonné Maurice pendant des siècles—rouler au cœur des champs est une expérience locale."
      },
      {
        title: 'Contrastes de l’île',
        text: "Entre campagne, collines et vues sur l'océan—le contraste mauricien en un seul parcours."
      }
    ],
    faunaStories: [
      {
        title: 'Grand Bassin sacré',
        text: 'Un lac de cratère vénéré—paisible, culturel et profondément significatif.'
      },
      {
        title: 'Nature endémique',
        text: "Des plantes et espèces uniques—certaines n'existent nulle part ailleurs."
      }
    ],
    catamaranStories: [
      {
        title: 'Bleus du lagon',
        text: 'Les lagons prennent des tons turquoise grâce aux récifs coralliens et aux fonds de sable blanc.'
      },
      {
        title: 'Îlots paradisiaques',
        text: 'Des îlots aux plages carte postale et snorkeling facile—parfait pour une journée en mer.'
      }
    ],
    ileAuxCerfsStories: [
      {
        title: 'Le grand lagon de l’est',
        text: 'La côte est abrite l’un des plus vastes lagons de Maurice, réputé pour ses eaux calmes et lumineuses.'
      },
      {
        title: 'Une journée mer & détente',
        text: 'Navigation, baignade, plage et pauses tranquilles composent une sortie idéale pour profiter du rythme insulaire.'
      }
    ],
    bigGameFishingStories: [
      {
        title: 'Courants du large',
        text: 'Les eaux profondes autour de Maurice attirent plusieurs poissons recherchés par les amateurs de pêche sportive.'
      },
      {
        title: 'Départs selon les côtes',
        text: 'Partir de l’ouest, de l’est ou du nord permet d’adapter la sortie à la météo et à la saison.'
      }
    ],
    frontierStories: [
      {
        title: 'Port Louis authentique',
        text: 'Une capitale vivante où les cultures se rencontrent—marchés, histoire et vie locale.'
      },
      {
        title: "L’Aventure du Sucre",
        text: "Un musée élégant sur l'histoire du sucre à Maurice, avec dégustations et anecdotes."
      }
    ],

    adventureDesc:
      "Vivez le frisson de Maurice avec nos tours d'aventure à La Vallée des Couleurs. Survolez des paysages magnifiques en tyrolienne et créez votre itinéraire sur mesure.",
    adventureHighlights: [
      'La Vallée des Couleurs - Parc naturel aux terres colorées',
      'Tyroliennes avec vues panoramiques',
      'Itinéraires personnalisés selon vos envies',
      'Guides professionnels et équipement de sécurité',
      "Adapté à tous les niveaux d'aventure",
    ],

    hikingDesc:
      "Découvrez Maurice à pied avec nos randonnées guidées. Des montagnes majestueuses aux cascades cachées, vivez la beauté naturelle de l'île.",
    hikingHighlights: [
      'Le Morne Brabant - Site UNESCO',
      'Chutes de Tamarind - Sept cascades',
      'Montagne Le Pouce - Vue panoramique sur Port Louis',
      'Chutes Alexandra - Paysages à couper le souffle',
      'Guides locaux experts et passionnés',
    ],

    quadDesc:
      "Parcourez les paysages de Maurice en quad. Une aventure pleine d'adrénaline à travers les champs de canne et les sentiers côtiers.",
    quadHighlights: [
      'Sentiers dans les champs de canne',
      'Parcours côtiers et montagneux',
      'Équipement de sécurité fourni',
      'Aucune expérience requise',
      'Briefing et encadrement inclus',
    ],

    faunaDesc:
      "Explorez la riche biodiversité de Maurice. Des sites sacrés aux merveilles naturelles, découvrez ce qui rend l'île unique.",
    faunaHighlights: [
      'Grand Bassin - Lac sacré hindou et temple',
      'Chutes Alexandra - Points de vue sur la cascade',
      'Parc national des Gorges de la Rivière Noire',
      'Chamarel - Terres des 7 couleurs',
      'Ebony Forest - Sanctuaire de faune endémique',
    ],

    catamaranDesc:
      "Profitez des plus belles expériences en mer à Maurice avec nos croisières en catamaran & speed boat : dauphins, snorkeling et îles paradisiaques.",
    catamaranHighlights: [
      "Aventure côte Ouest : nage avec les dauphins, snorkeling à Crystal Rock, pêche, déjeuner à l'Île aux Bénitiers",
      'Escapade côte Est : Île aux Cerfs & cascade de Grande Rivière Sud-Est, speedboat vers 5 îles, déjeuner local',
      'Équipage professionnel et matériel de sécurité',
      'Formules tout compris disponibles',
    ],

    ileAuxCerfsDesc:
      'Profitez d’une journée complète en mer sur la côte est, à travers le grand lagon turquoise de Maurice, avec navigation, baignade, arrêts sur les îles et ambiance détendue.',
    ileAuxCerfsHighlights: [
      'Sortie en catamaran ou en bateau sur le lagon de la côte est',
      'Programmes possibles vers l’Île aux Cerfs et les 5 îles',
      'Navigation panoramique, baignade et temps libre à la plage',
      'Idéal pour couples, familles et petits groupes en quête de détente',
      'Le point de départ dépend du programme choisi et des conditions météo',
    ],

    bigGameFishingDesc:
      'Vivez une sortie big game fishing avec des équipages locaux au départ de plusieurs zones réputées de Maurice, pour une journée offshore mêlant adrénaline, expertise et grand large.',
    bigGameFishingHighlights: [
      'Départs disponibles depuis Flic en Flac, Rivière Noire, Trou d’Eau Douce, Belle Mare et Grand Baie',
      'Pêche en haute mer avec skippers expérimentés et bateaux équipés',
      'Accessible aux débutants comme aux passionnés',
      'Choix de la côte selon la saison, la mer et la zone souhaitée',
      'Sorties privées possibles pour couples, familles ou groupes',
    ],

    frontierSpiritShort:
      'Une découverte soignée du Nord & de Port Louis : points de vue, marchés locaux, jardins et musée du sucre.',
    frontierSpiritDesc:
      "Explorez le nord et la capitale lors d’une journée détendue mêlant culture, histoire et saveurs locales—idéal pour une première visite.",
    frontierSpiritHighlights: [
      'Citadelle de Port Louis (Fort Adelaide) – vues panoramiques sur le port et la ville',
      'Marchés de Port Louis – artisanat, souvenirs et ambiance locale',
      'Jardin Botanique de Pamplemousses – l’un des plus célèbres de l’océan Indien',
      "L’Aventure du Sucre – musée incontournable avec dégustations et histoire de l’île",
      'Transferts confortables, rythme flexible et arrêts photos',
    ],

    punchDesc:
      "Détendez-vous avec un punch mauricien authentique au bord de la mer. Idéal pour se relaxer après une journée d'aventure.",
    punchHighlights: [
      'Punch traditionnel au rhum mauricien',
      'Emplacements en bord de mer avec vues superbes',
      'Ingrédients frais et locaux',
      'Parfait pour admirer le coucher du soleil',
      'Formules de groupe disponibles',
    ],
  },

  ru: {
    home: 'Главная',
    about: 'О нас',
    activities: 'Активности',
    gallery: 'Галерея',
    airportTransfer: 'Трансферы',
    contact: 'Контакты',
    bookOnWhatsApp: 'Забронировать в WhatsApp',
    discoverParadise: 'Откройте рай',
    heroTitle: 'Just Love Tour',
    heroSubtitle:
      'Откройте магию Маврикия через незабываемые приключения, захватывающие виды и эксклюзивные впечатления',
    swipeActivities: 'Проведите влево или вправо, чтобы посмотреть все активности',
    exploreActivities: 'Смотреть активности',
    chatOnWhatsApp: 'Написать в WhatsApp',
    tourPlanner: 'Планировщик',
    aboutTitle: 'Ваш путь в райский Маврикий',
    aboutText1:
      'Работая в самом сердце Маврикия, Just Love Tour помогает открывать скрытые сокровища острова.',
    aboutText2:
      'Наш местный опыт и любовь к гостеприимству делают каждую поездку персональной, безопасной и по-настоящему незабываемой.',
    yearsExperience: 'Лет опыта',
    happyTravelers: 'Довольных путешественников',
    uniqueTours: 'Уникальных туров',
    rating: 'Рейтинг',
    ourActivities: 'Наши активности',
    activitiesSubtitle:
      'Выберите из тщательно подобранных туров и активностей, чтобы увидеть лучшие стороны Маврикия',
    learnMore: 'Подробнее',
    bookViaWhatsApp: 'Забронировать в WhatsApp',
    guideLanguagesNote: 'С Just Love Tour доступны гиды, говорящие на английском, французском, немецком, итальянском и русском языках.',
    galleryTitle: 'Моменты из наших туров',
    gallerySubtitle:
      'Красивые кадры из наших незабываемых приключений вместе с довольными путешественниками',
    adminSection: 'Админ-раздел',
    addNewPhoto: 'Добавить новое фото (админ)',
    airportTitle: 'Заявка на трансфер из аэропорта',
    airportSubtitle:
      'Начните и завершите путешествие по Маврикию без стресса с нашим надежным трансфером из аэропорта.',
    privateTransfers: 'Частные трансферы',
    allDestinations: 'Любые направления',
    service24_7: 'Сервис 24/7',
    whyChooseTransfer: 'Почему выбирают наш трансфер?',
    fixedPrices: 'Фиксированные цены без скрытых платежей',
    flightTracking: 'Отслеживаем рейсы и следим за задержками',
    professionalDrivers: 'Профессиональный водитель, говорящий на нескольких языках',
    comfortableVehicles: 'Комфортные автомобили с кондиционером',
    freeCancellation: 'Бесплатная отмена за 24 часа',
    requestTransfer: 'Запросить трансфер в WhatsApp',
    pickupLocationLabel: 'Место посадки',
    pickupLocationPlaceholder: 'Укажите место посадки',
    dropoffLocationLabel: 'Место высадки',
    dropoffLocationPlaceholder: 'Укажите место высадки',
    popularDestinationsLabel: 'Популярные направления',
    interHotelTransfersNote: 'Мы также организуем трансферы между отелями для гостей, которые меняют место проживания во время отдыха.',
    nameLabel: 'Имя',
    namePlaceholder: 'Ваше полное имя',
    emailLabel: 'Электронная почта',
    contactNumberLabel: 'Контактный номер',
    preferredDateLabel: 'Предпочтительная дата',
    emailPlaceholder: 'name@example.com',
    additionalNotesLabel: 'Дополнительные заметки',
    additionalNotesPlaceholder: 'Задержка рейса, название отеля, детское кресло, дополнительная остановка или любая другая важная информация.',

    // Форма трансфера
    dateLabel: 'Дата',
    paxLabel: 'Количество пассажиров',
    paxPlaceholder: 'например, 2',
    flightNumberLabel: 'Номер рейса (необязательно)',
    flightPlaceholder: 'например, MK 745',
    directToHotel: 'Сразу в ваш отель или виллу',
    anyLocation: 'Любая точка на Маврикии',
    availableAnyTime: 'Доступно в любое время, каждый день',
    whyChooseUs: 'Почему выбирают нас',
    whyChooseTitle: 'Преимущества Just Love Tour',
    localExpertise: 'Местная экспертиза',
    localExpertiseText:
      'Мы родились и выросли на Маврикии и знаем каждый скрытый уголок и особенное место острова',
    personalizedService: 'Персональный сервис',
    personalizedServiceText:
      'Каждый тур подстраивается под ваши интересы, чтобы вы получили уникальный и запоминающийся опыт',
    premiumQuality: 'Премиальное качество',
    premiumQualityText:
      'От транспорта до гидов, мы поддерживаем высокий стандарт комфорта и безопасности',
    getInTouch: 'Свяжитесь с нами',
    readyToExplore: 'Готовы открыть Маврикий?',
    contactText:
      'Свяжитесь с нами сегодня, чтобы начать планировать отпуск мечты. Наша команда подготовит для вас идеальный маршрут.',
    footerDescription:
      'Ваш надежный партнер для незабываемых впечатлений на Маврикии. Мы создаем воспоминания на всю жизнь.',
    sendMessage: 'Отправить в WhatsApp',
    firstNamePlaceholder: 'Имя',
    lastNamePlaceholder: 'Фамилия',
    emailAddressPlaceholder: 'Электронная почта',
    messagePlaceholder: 'Ваше сообщение',
    whatsappLabel: 'WhatsApp',
    openProfile: 'Открыть профиль',
    openPage: 'Открыть страницу',
    readReviews: 'Читать отзывы',
    locationLabel: 'Локация',
    locationValue: 'St Clement, Curepipe',
    quickLinks: 'Быстрые ссылки',
    allRightsReserved: 'Все права защищены',
    madeWith: 'Сделано с',
    inMauritius: 'на Маврикии',
    developedBy: 'Сайт разработан и размещен KPM Studios',

    reviews: 'Отзывы наших гостей',
    videosKicker: 'Видео-моменты',
    videosTitle: 'Посмотрите Маврикий в движении',
    videosSubtitle: 'Превью видео появляются сразу, а YouTube-плеер загружается только после нажатия.',
    videosComingSoon: 'Ссылка на видео скоро появится',
    videosPlay: 'Нажмите, чтобы загрузить видео',
    videosChannelCta: 'Смотреть все видео на YouTube',
    videosChannelPending: 'Ссылка на YouTube-канал скоро появится',
    galleryLoadingText: 'Загрузка галереи…',
    galleryEmptyText: 'В галерее пока нет изображений.',
    googleReviewsLabel: 'Отзывы Google',
    leaveGoogleReview: 'Оставить 5-звездочный отзыв в Google',
    viewAllGoogleReviews: 'Смотреть все отзывы в Google',
    loadingReviews: 'Загрузка последних отзывов…',

    adventureTours: 'Приключенческие туры',
    activityAdventureCardDesc: 'Зиплайн, обзорные точки и активный отдых с выбросом адреналина.',
    ileAuxCerfsTours: 'Ile aux Cerfs / 5 Islands Tours',
    activityIleAuxCerfsCardDesc: 'Целый день на воде: лагуна, островные остановки и спокойный отдых в море.',
    hiking: 'Походы',
    activityHikingCardDesc: 'Пешие маршруты с гидом по знаковым горам, долинам и скрытым водопадам.',
    quadBikes: 'Квадроциклы',
    activityQuadCardDesc: 'Промчитесь по тропам среди сахарного тростника и открытым ландшафтам с опытным сопровождением.',
    faunaFlora: 'Фауна и флора',
    activityFaunaCardDesc: 'Живописное знакомство с островом через природу, культуру и знаковые места.',
    catamaranSpeedBoat: 'Круизы на катамаране и speed boat',
    activityCatamaranCardDesc: 'Лазурные лагуны, дельфины и острова за один день на воде.',
    bigGameFishing: 'Big Game Fishing',
    activityBigGameFishingCardDesc: 'Выход в открытый океан с опытной командой для настоящей морской рыбалки.',
    punch: 'Пунш',
    frontierSpiritAdventures: 'Frontier Spirit Adventures',
    adventure: 'Приключения',
    nature: 'Природа',
    thrills: 'Эмоции',
    sightseeing: 'Экскурсии',
    sea: 'Море',
    luxury: 'Комфорт',
    selectActivity: 'Выберите активность',

    // Innovation UI
    mauritiusToday: 'Маврикий сегодня',
    weatherLoading: 'Загрузка погоды…',
    weatherUnavailable: 'Погода недоступна',
    weatherClear: 'Ясно',
    weatherPartlyCloudy: 'Переменная облачность',
    weatherFog: 'Туман',
    weatherRain: 'Дождь',
    weatherSnow: 'Снег',
    weatherMixed: 'Смешанная погода',

    exploreMauritius: 'Исследуйте Маврикий',
    exploreMauritiusTitle: 'Нажмите на регион, чтобы увидеть туры',
    exploreMauritiusSubtitle: 'Быстрый способ понять остров и выбрать подходящее впечатление.',
    regionAll: 'Все',
    regionNorth: 'Север',
    regionSouth: 'Юг',
    regionEast: 'Восток',
    regionWest: 'Запад',
    regionNature: 'Природа',
    tapToView: 'Открыть',

    recommenderKicker: 'Подбор тура',
    recommenderTitle: 'Найдите идеальное впечатление',
    recommenderSubtitle: 'Ответьте на 3 коротких вопроса, и мы предложим лучшие туры для вас.',
    recommenderTravellerType: 'Тип путешественника',
    recommenderDays: 'Сколько дней вы будете на Маврикии?',
    recommenderFocus: 'Что вам интересно?',
    travellerCouple: 'Пара',
    travellerFamily: 'Семья',
    travellerAdventure: 'Любитель приключений',
    travellerRelaxed: 'Спокойный путешественник',
    days12: '1–2 дня',
    days35: '3–5 дней',
    days7plus: '7+ дней',
    interestNature: 'Природа',
    interestAdventure: 'Приключения',
    interestCulture: 'Культура',
    interestBeaches: 'Пляжи',
    recommendedForYou: 'Рекомендуем для вас',
    recommenderHint: 'Выберите варианты выше, чтобы увидеть рекомендации.',

    plannerKicker: 'Мгновенный планировщик',
    plannerTitle: 'Спланируйте поездку на Маврикий',
    plannerSubtitle: 'Отправьте даты и предпочтения, и мы предложим маршрут в WhatsApp.',
    plannerDates: 'Даты поездки',
    plannerDatesPlaceholder: 'например, 12–16 июля',
    plannerPeople: 'Количество путешественников',
    plannerPeoplePlaceholder: 'например, 2 взрослых',
    plannerInterests: 'Интересы',
    plannerCta: 'Спланировать в WhatsApp',
    plannerReset: 'Сбросить',

    planMsgHello: 'Здравствуйте, Just Love Tour!',
    planMsgDates: 'Даты',
    planMsgPeople: 'Количество человек',
    planMsgInterests: 'Интересует',
    planMsgNotSet: 'Не указано',
    planMsgAsk: 'Можете порекомендовать маршрут и лучшие туры для нас?',
    notProvided: 'Не указано',
    transferMsgHello: 'Здравствуйте! Я хочу заказать трансфер на Маврикии.',
    transferMsgName: 'Имя',
    transferMsgEmail: 'Электронная почта',
    transferMsgPickup: 'Место посадки',
    transferMsgDropoff: 'Место высадки',
    transferMsgDate: 'Дата',
    transferMsgPax: 'Пассажиры',
    transferMsgFlight: 'Рейс',
    transferMsgNotes: 'Дополнительные заметки',
    bookingMessage: 'Здравствуйте! Я хочу забронировать тур в Just Love Tour.',
    bookingInterestMessage: 'Здравствуйте! Меня интересует бронирование тура.',
    contactQuestionMessage: 'Здравствуйте! У меня есть вопрос о ваших турах.',
    contactActivityMessage: 'Здравствуйте! Я хочу забронировать',
    whatsappFabTitle: 'Написать в WhatsApp',

    backToActivities: 'Назад к активностям',
    highlightsTitle: 'Основные моменты',
    viewedToday: 'Сегодня это впечатление посмотрели {n} путешественников',
    travelTimeTitle: 'Время в пути',
    travelTimeSubtitle: 'Ориентировочное время поездки из популярных районов',
    fromGrandBaie: 'Из Гран-Бэ',
    fromFlicEnFlac: 'Из Флик-ан-Флак',
    fromPortLouis: 'Из Порт-Луи',
    onlyInMauritiusTitle: 'Только на Маврикии',
    readyToBook: 'Готовы забронировать?',
    readyToBookText: 'Свяжитесь с нами в WhatsApp, чтобы получить выгодные предложения и персональные пакеты!',
    contactOnWhatsApp: 'Забронировать через WhatsApp',

    adventureStories: [
      {
        title: 'Семицветные земли',
        text: 'Редкие природные дюны из вулканических минералов, ставшие одной из визитных карточек Маврикия.'
      },
      {
        title: 'Тропические микроклиматы',
        text: 'За короткую поездку можно попасть с солнечного побережья в прохладные зеленые долины.'
      }
    ],
    hikingStories: [
      {
        title: 'Ле-Морн и наследие ЮНЕСКО',
        text: 'Ле-Морн является сильным символом свободы и одной из самых впечатляющих вершин на побережье.'
      },
      {
        title: 'Тропы к водопадам',
        text: 'Густые леса и каскады водопадов открывают ту сторону Маврикия, которую видят не все.'
      }
    ],
    quadStories: [
      {
        title: 'Пейзажи сахарного тростника',
        text: 'Сахарный тростник веками формировал Маврикий, и поездка по этим полям дает настоящий местный колорит.'
      },
      {
        title: 'Контрасты острова',
        text: 'Поля, холмы и виды на океан могут сменяться в рамках одной поездки.'
      }
    ],
    faunaStories: [
      {
        title: 'Священный Гран-Бассен',
        text: 'Кратерное озеро, почитаемое индуистами Маврикия, спокойное, культурно значимое и глубокое по смыслу.'
      },
      {
        title: 'Эндемичная природа',
        text: 'На Маврикии встречаются уникальные растения и животные, часть из которых не найти больше нигде в мире.'
      }
    ],
    catamaranStories: [
      {
        title: 'Лазурные лагуны',
        text: 'Бирюзовые оттенки лагун создают коралловые рифы и белоснежные песчаные отмели.'
      },
      {
        title: 'Путешествие по островкам',
        text: 'Небольшие островки с пляжами как на открытке и спокойным снорклингом идеальны для морского дня.'
      }
    ],
    ileAuxCerfsStories: [
      {
        title: 'Восточная лагуна',
        text: 'На востоке Маврикия находится одна из крупнейших лагун острова с спокойной водой и яркими бирюзовыми оттенками.'
      },
      {
        title: 'День в островном ритме',
        text: 'Такие морские экскурсии объединяют прогулку, купание, пляжные остановки и расслабленный отдых на воде.'
      }
    ],
    bigGameFishingStories: [
      {
        title: 'Океанские течения',
        text: 'Глубоководные участки вокруг Маврикия привлекают сильную спортивную рыбу недалеко от острова.'
      },
      {
        title: 'Старт с разных побережий',
        text: 'Выбор западного, восточного или северного побережья помогает подстроить рыбалку под сезон и условия моря.'
      }
    ],
    frontierStories: [
      {
        title: 'Аутентичный Порт-Луи',
        text: 'Живой город, где встречаются разные культуры, рынки, колониальная история и настоящая местная жизнь.'
      },
      {
        title: "L’Aventure du Sucre",
        text: 'Красивый музей о сахарной истории Маврикия с дегустациями, которые делают рассказ особенно живым.'
      }
    ],

    adventureDesc:
      'Почувствуйте адреналин Маврикия в наших приключенческих турах в La Vallee des Couleurs. Пролетайте на зиплайне над красивыми пейзажами и собирайте маршрут под себя.',
    adventureHighlights: [
      'La Vallee des Couleurs - природный парк с цветными землями',
      'Зиплайн с панорамными видами',
      'Маршруты, составленные под ваши предпочтения',
      'Профессиональные гиды и защитное снаряжение',
      'Подходит для любого уровня подготовки',
    ],

    hikingDesc:
      'Откройте Маврикий пешком в наших походах с гидом. От величественных гор до скрытых водопадов, вы увидите природную красоту острова.',
    hikingHighlights: [
      'Le Morne Brabant - объект Всемирного наследия ЮНЕСКО',
      'Tamarind Falls - семь каскадных водопадов',
      'Гора Le Pouce - панорамный вид на Порт-Луи',
      'Alexandra Falls - захватывающие пейзажи',
      'Опытные местные гиды с глубокими знаниями',
    ],

    quadDesc:
      'Прокатитесь по впечатляющим ландшафтам Маврикия на мощных квадроциклах. Это насыщенное адреналином приключение через поля сахарного тростника и прибрежные тропы.',
    quadHighlights: [
      'Маршруты по полям сахарного тростника',
      'Прибрежные и горные трассы',
      'Все защитное снаряжение включено',
      'Опыт не требуется',
      'Профессиональный инструктаж включен',
    ],

    faunaDesc:
      'Исследуйте богатое биоразнообразие Маврикия. От священных мест до природных чудес, узнайте, что делает этот остров уникальным.',
    faunaHighlights: [
      'Grand Bassin - священное индуистское озеро и храм',
      'Alexandra Falls - обзорные точки на водопады',
      'Национальный парк Black River Gorges',
      'Chamarel - Семицветные земли',
      'Ebony Forest - заповедник эндемичной природы',
    ],

    catamaranDesc:
      'Откройте лучшие морские впечатления Маврикия с нашими круизами на катамаране и speed boat. От встречи с дельфинами до прогулок между островами, вас ждет настоящее приключение.',
    catamaranHighlights: [
      'Приключение на западном побережье: плавание с дельфинами с Dolswim, снорклинг у Crystal Rock, рыбалка, обед на Ile aux Benitiers',
      'Поездка на восточное побережье: Ile aux Cerfs и водопад Grande Riviere Sud-Est, speed boat по 5 островам, обед в островном стиле',
      'Профессиональная команда и защитное снаряжение',
      'Доступны пакеты all-inclusive',
    ],

    ileAuxCerfsDesc:
      'Проведите расслабленный день на восточном побережье, путешествуя по большой бирюзовой лагуне Маврикия с остановками у островов, купанием и спокойной прогулкой по морю.',
    ileAuxCerfsHighlights: [
      'Полноценная морская прогулка на катамаране или лодке по восточной лагуне',
      'Маршруты к Ile aux Cerfs и по 5 островам',
      'Купание, живописная прогулка и время на пляже',
      'Подходит для пар, семей и небольших компаний, которые хотят спокойный морской день',
      'Точка отправления зависит от выбранной программы и погодных условий',
    ],

    bigGameFishingDesc:
      'Отправьтесь на big game fishing с местными экипажами из лучших точек Маврикия и проведите насыщенный день в Индийском океане, сочетая азарт, опыт команды и настоящий offshore формат.',
    bigGameFishingHighlights: [
      'Доступны выезды из Flic en Flac, Rivière Noire, Trou d’Eau Douce, Belle Mare и Grand Baie',
      'Глубоководная рыбалка с опытными шкиперами и оборудованными лодками',
      'Подходит как новичкам, так и опытным любителям рыбалки',
      'Выбор побережья зависит от сезона, состояния моря и желаемой зоны',
      'Можно организовать приватные выезды для пар, семей и групп',
    ],

    frontierSpiritShort:
      'Тщательно продуманный тур по северу и Порт-Луи: панорамные виды, местные рынки, сады и знаменитый музей сахара.',
    frontierSpiritDesc:
      'Откройте север острова и столицу в расслабленном туре с гидом, где сочетаются культура, история и местные вкусы. Отличный вариант для первого знакомства с Маврикием.',
    frontierSpiritHighlights: [
      'Цитадель Порт-Луи (Fort Adelaide) - панорамные виды на гавань и город',
      'Рынки Порт-Луи - местные товары, сувениры и живая атмосфера',
      'Ботанический сад Памплемус - один из самых известных садов Индийского океана',
      'L’Aventure du Sucre - знаковый музей сахара с дегустациями и историей острова',
      'Комфортные трансферы, гибкий темп и остановки для фото',
    ],

    punchDesc:
      'Расслабьтесь и попробуйте настоящий маврикийский пунш у моря. Идеальный способ завершить насыщенный день приключений.',
    punchHighlights: [
      'Традиционный маврикийский ромовый пунш',
      'Локации у моря с красивыми видами',
      'Свежие местные ингредиенты',
      'Идеально для встречи заката',
      'Доступны предложения для групп',
    ],
  },
} as const

export const supportedLangs: Lang[] = ['en', 'fr', 'ru']
