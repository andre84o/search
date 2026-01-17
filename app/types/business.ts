export interface Business {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  photoUrl?: string;
  rating?: number;
  totalRatings?: number;
  types: string[];
  category: BusinessCategory;
  location: {
    lat: number;
    lng: number;
  };
  isSwedish: boolean;
  swedishConfidence: number; // 0-100
  swedishIndicators: string[];
}

export type BusinessCategory =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'shop'
  | 'service'
  | 'health'
  | 'beauty'
  | 'real_estate'
  | 'construction'
  | 'automotive'
  | 'education'
  | 'finance'
  | 'legal'
  | 'other';

export interface SearchArea {
  type: 'polygon' | 'rectangle' | 'circle';
  coordinates: [number, number][];
  center?: { lat: number; lng: number };
  radius?: number;
}

export interface SearchResult {
  businesses: Business[];
  total: number;
  swedishCount: number;
  searchArea: SearchArea;
}

// Nationalities - countries that commonly visit Spain
export type Nationality =
  | 'all'
  | 'swedish'
  | 'british'
  | 'german'
  | 'dutch'
  | 'french'
  | 'norwegian'
  | 'danish'
  | 'finnish'
  | 'belgian'
  | 'irish'
  | 'russian'
  | 'polish'
  | 'italian'
  | 'lithuanian'
  | 'chinese';

export interface NationalityConfig {
  id: Nationality;
  label: string;
  flag: string;
  countryCode?: string;
  keywords: string[]; // Search keywords for this nationality
}

export const nationalityConfigs: NationalityConfig[] = [
  { id: 'all', label: 'Alla nationaliteter', flag: '🌍', keywords: [] },
  { id: 'swedish', label: 'Svenska', flag: '🇸🇪', countryCode: 'se', keywords: ['swedish', 'svensk', 'sweden', 'sverige', 'scandinavian'] },
  { id: 'british', label: 'Brittiska', flag: '🇬🇧', countryCode: 'gb', keywords: ['british', 'english', 'uk', 'england', 'pub', 'fish and chips'] },
  { id: 'german', label: 'Tyska', flag: '🇩🇪', countryCode: 'de', keywords: ['german', 'deutsch', 'germany', 'deutschland', 'bier', 'bratwurst'] },
  { id: 'dutch', label: 'Holländska', flag: '🇳🇱', countryCode: 'nl', keywords: ['dutch', 'holland', 'netherlands', 'nederland'] },
  { id: 'french', label: 'Franska', flag: '🇫🇷', countryCode: 'fr', keywords: ['french', 'france', 'français', 'boulangerie', 'patisserie'] },
  { id: 'norwegian', label: 'Norska', flag: '🇳🇴', countryCode: 'no', keywords: ['norwegian', 'norsk', 'norway', 'norge', 'scandinavian'] },
  { id: 'danish', label: 'Danska', flag: '🇩🇰', countryCode: 'dk', keywords: ['danish', 'dansk', 'denmark', 'danmark', 'scandinavian'] },
  { id: 'finnish', label: 'Finska', flag: '🇫🇮', countryCode: 'fi', keywords: ['finnish', 'suomi', 'finland', 'scandinavian'] },
  { id: 'belgian', label: 'Belgiska', flag: '🇧🇪', countryCode: 'be', keywords: ['belgian', 'belgium', 'belge', 'belgique'] },
  { id: 'irish', label: 'Irländska', flag: '🇮🇪', countryCode: 'ie', keywords: ['irish', 'ireland', 'pub', 'celtic'] },
  { id: 'russian', label: 'Ryska', flag: '🇷🇺', countryCode: 'ru', keywords: ['russian', 'russia', 'русский', 'россия'] },
  { id: 'polish', label: 'Polska', flag: '🇵🇱', countryCode: 'pl', keywords: ['polish', 'poland', 'polska', 'polski'] },
  { id: 'italian', label: 'Italienska', flag: '🇮🇹', countryCode: 'it', keywords: ['italian', 'italy', 'italiano', 'italia', 'pizzeria', 'trattoria'] },
  { id: 'lithuanian', label: 'Litauiska', flag: '🇱🇹', countryCode: 'lt', keywords: ['lithuanian', 'lithuania', 'lietuvos', 'lietuva'] },
  { id: 'chinese', label: 'Kinesiska', flag: '🇨🇳', countryCode: 'cn', keywords: ['chinese', 'china', '中国', '中文'] },
];

// Place types
export type PlaceType =
  | 'all'
  | 'restaurants'
  | 'cafes'
  | 'bars'
  | 'shops'
  | 'attractions'
  | 'nature'
  | 'culture'
  | 'beaches'
  | 'services';

export interface PlaceTypeConfig {
  id: PlaceType;
  label: string;
  icon: string;
  googleTypes: string[]; // Google Places API types
  keywords: string[];
}

export const placeTypeConfigs: PlaceTypeConfig[] = [
  { id: 'all', label: 'Alla platser', icon: 'search', googleTypes: [], keywords: [] },
  { id: 'restaurants', label: 'Restauranger', icon: 'utensils', googleTypes: ['restaurant'], keywords: ['restaurant', 'food', 'dining'] },
  { id: 'cafes', label: 'Kaféer', icon: 'coffee', googleTypes: ['cafe'], keywords: ['cafe', 'coffee', 'bakery'] },
  { id: 'bars', label: 'Barer & Pubar', icon: 'beer', googleTypes: ['bar', 'night_club'], keywords: ['bar', 'pub', 'nightclub'] },
  { id: 'shops', label: 'Butiker', icon: 'shopping-bag', googleTypes: ['store', 'shopping_mall', 'supermarket'], keywords: ['shop', 'store', 'market'] },
  { id: 'attractions', label: 'Sevärdheter', icon: 'camera', googleTypes: ['tourist_attraction', 'point_of_interest'], keywords: ['attraction', 'sightseeing'] },
  { id: 'nature', label: 'Natur & Parker', icon: 'trees', googleTypes: ['park', 'natural_feature'], keywords: ['park', 'nature', 'garden'] },
  { id: 'culture', label: 'Kultur', icon: 'landmark', googleTypes: ['museum', 'church', 'art_gallery'], keywords: ['museum', 'church', 'gallery', 'historic'] },
  { id: 'beaches', label: 'Stränder', icon: 'umbrella', googleTypes: ['natural_feature'], keywords: ['beach', 'playa', 'strand'] },
  { id: 'services', label: 'Tjänster', icon: 'briefcase', googleTypes: ['lawyer', 'doctor', 'dentist', 'real_estate_agency'], keywords: ['service', 'lawyer', 'doctor'] },
];

// Legacy support - keep SearchType for backwards compatibility
export type SearchType =
  | 'swedish_businesses'
  | 'attractions'
  | 'nature'
  | 'culture'
  | 'restaurants'
  | 'all';

export interface SearchTypeConfig {
  id: SearchType;
  label: string;
  description: string;
  icon: string;
}

export const searchTypeConfigs: SearchTypeConfig[] = [
  { id: 'swedish_businesses', label: 'Svenska Foretag', description: 'Svenskagda foretag', icon: 'flag' },
  { id: 'attractions', label: 'Sevardheter', description: 'Turistattraktioner', icon: 'camera' },
  { id: 'nature', label: 'Natur & Parker', description: 'Parker och strander', icon: 'trees' },
  { id: 'culture', label: 'Kultur', description: 'Museum och kyrkor', icon: 'landmark' },
  { id: 'restaurants', label: 'Restauranger', description: 'Mat och dryck', icon: 'utensils' },
  { id: 'all', label: 'Allt', description: 'Sok efter allt', icon: 'search' },
];
