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
