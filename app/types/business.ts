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
