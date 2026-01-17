import { Business, SearchArea, Nationality, PlaceType, nationalityConfigs, placeTypeConfigs } from '../types/business';
import { mapGoogleTypeToCategory } from './categoryIcons';

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: {
    photo_reference: string;
    height: number;
    width: number;
  }[];
  reviews?: {
    text: string;
    language: string;
  }[];
}

interface NearbySearchResponse {
  results: PlaceResult[];
  next_page_token?: string;
  status: string;
}

interface PlaceDetailsResponse {
  result: PlaceResult;
  status: string;
}

const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Build search queries based on nationality and place type
function getSearchQueries(nationality: Nationality, placeType: PlaceType): string[] {
  const queries: string[] = [];

  const nationalityConfig = nationalityConfigs.find(c => c.id === nationality);
  const placeTypeConfig = placeTypeConfigs.find(c => c.id === placeType);

  // Get nationality keywords
  const nationalityKeywords = nationalityConfig?.keywords || [];

  // Get place type keywords
  const placeKeywords = placeTypeConfig?.keywords || [];

  // If both are 'all', just do a general search
  if (nationality === 'all' && placeType === 'all') {
    return [''];
  }

  // If only nationality is selected
  if (nationality !== 'all' && placeType === 'all') {
    return nationalityKeywords;
  }

  // If only place type is selected
  if (nationality === 'all' && placeType !== 'all') {
    return placeKeywords.length > 0 ? placeKeywords : [''];
  }

  // If both are selected, combine them
  for (const natKeyword of nationalityKeywords) {
    for (const placeKeyword of placeKeywords) {
      queries.push(`${natKeyword} ${placeKeyword}`);
    }
    // Also search just the nationality keyword
    queries.push(natKeyword);
  }

  return queries;
}

// Get Google place types for filtering
function getGoogleTypes(placeType: PlaceType): string | undefined {
  const config = placeTypeConfigs.find(c => c.id === placeType);
  if (!config || config.googleTypes.length === 0) return undefined;
  return config.googleTypes[0]; // Use the first type for the API
}

export async function searchPlacesInArea(
  area: SearchArea,
  apiKey: string,
  nationality: Nationality = 'all',
  placeType: PlaceType = 'all'
): Promise<Business[]> {
  const center = getAreaCenter(area);
  const radius = getAreaRadius(area);

  const searchQueries = getSearchQueries(nationality, placeType);
  const googleType = getGoogleTypes(placeType);
  const allPlaces: Map<string, PlaceResult> = new Map();

  // Search with each keyword combination
  for (const query of searchQueries) {
    try {
      const places = await nearbySearch(center, radius, query, apiKey, googleType);
      for (const place of places) {
        if (!allPlaces.has(place.place_id)) {
          allPlaces.set(place.place_id, place);
        }
      }
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
    }
  }

  // Also do a type-based search if place type is specified
  if (googleType && placeType !== 'all') {
    try {
      const typePlaces = await nearbySearch(center, radius, '', apiKey, googleType);
      for (const place of typePlaces) {
        if (!allPlaces.has(place.place_id)) {
          allPlaces.set(place.place_id, place);
        }
      }
    } catch (error) {
      console.error('Error in type search:', error);
    }
  }

  // Convert to Business objects
  const businesses: Business[] = [];

  for (const place of allPlaces.values()) {
    // Check if place is within the drawn area
    if (!isPointInArea(place.geometry.location, area)) {
      continue;
    }

    // Get additional details
    let details: PlaceResult | null = null;
    try {
      details = await getPlaceDetails(place.place_id, apiKey);
    } catch (error) {
      console.error(`Error getting details for ${place.name}:`, error);
    }

    const mergedPlace = details ? { ...place, ...details } : place;

    // Check if matches the nationality filter
    const matchesNationality = checkNationalityMatch(mergedPlace, nationality);

    const business: Business = {
      id: place.place_id,
      name: mergedPlace.name,
      address: mergedPlace.formatted_address || 'Adress ej tillgänglig',
      phone: mergedPlace.international_phone_number || mergedPlace.formatted_phone_number,
      website: mergedPlace.website,
      photoUrl: mergedPlace.photos?.[0]
        ? getPhotoUrl(mergedPlace.photos[0].photo_reference, apiKey)
        : undefined,
      rating: mergedPlace.rating,
      totalRatings: mergedPlace.user_ratings_total,
      types: mergedPlace.types || [],
      category: mapGoogleTypeToCategory(mergedPlace.types || []),
      location: {
        lat: mergedPlace.geometry.location.lat,
        lng: mergedPlace.geometry.location.lng,
      },
      isSwedish: matchesNationality,
      swedishConfidence: matchesNationality ? 80 : 0,
      swedishIndicators: matchesNationality ? [`Matchar ${nationality}`] : [],
    };

    businesses.push(business);
  }

  // Sort by rating
  return businesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

// Check if a place matches the selected nationality
function checkNationalityMatch(place: PlaceResult, nationality: Nationality): boolean {
  if (nationality === 'all') return true;

  const config = nationalityConfigs.find(c => c.id === nationality);
  if (!config) return false;

  const searchText = [
    place.name,
    place.formatted_address,
    place.website,
    ...(place.reviews?.map(r => r.text) || [])
  ].join(' ').toLowerCase();

  return config.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
}

async function nearbySearch(
  center: { lat: number; lng: number },
  radius: number,
  keyword: string,
  apiKey: string,
  type?: string
): Promise<PlaceResult[]> {
  const params = new URLSearchParams({
    location: `${center.lat},${center.lng}`,
    radius: String(Math.min(radius, 50000)), // Max 50km
    key: apiKey,
  });

  if (keyword) {
    params.set('keyword', keyword);
  }

  if (type) {
    params.set('type', type);
  }

  const response = await fetch(
    `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?${params}`
  );

  if (!response.ok) {
    throw new Error(`Places API error: ${response.statusText}`);
  }

  const data: NearbySearchResponse = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API status: ${data.status}`);
  }

  return data.results || [];
}

async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<PlaceResult | null> {
  const fields = [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'international_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'types',
    'geometry',
    'photos',
    'reviews',
  ].join(',');

  const params = new URLSearchParams({
    place_id: placeId,
    fields,
    key: apiKey,
  });

  const response = await fetch(
    `${GOOGLE_PLACES_BASE_URL}/details/json?${params}`
  );

  if (!response.ok) {
    return null;
  }

  const data: PlaceDetailsResponse = await response.json();

  if (data.status !== 'OK') {
    return null;
  }

  return data.result;
}

function getPhotoUrl(photoReference: string, apiKey: string): string {
  return `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
}

function getAreaCenter(area: SearchArea): { lat: number; lng: number } {
  if (area.center) {
    return area.center;
  }

  // Calculate centroid from coordinates
  let sumLat = 0;
  let sumLng = 0;

  for (const [lat, lng] of area.coordinates) {
    sumLat += lat;
    sumLng += lng;
  }

  return {
    lat: sumLat / area.coordinates.length,
    lng: sumLng / area.coordinates.length,
  };
}

function getAreaRadius(area: SearchArea): number {
  if (area.radius) {
    return area.radius;
  }

  // Calculate approximate radius from bounding box
  const center = getAreaCenter(area);
  let maxDistance = 0;

  for (const [lat, lng] of area.coordinates) {
    const distance = haversineDistance(center.lat, center.lng, lat, lng);
    maxDistance = Math.max(maxDistance, distance);
  }

  return maxDistance;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function isPointInArea(
  point: { lat: number; lng: number },
  area: SearchArea
): boolean {
  if (area.type === 'circle' && area.center && area.radius) {
    const distance = haversineDistance(
      area.center.lat,
      area.center.lng,
      point.lat,
      point.lng
    );
    return distance <= area.radius;
  }

  // Ray casting algorithm for polygon/rectangle
  const polygon = area.coordinates;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

// Alias for backwards compatibility
export const searchBusinessesInArea = searchPlacesInArea;
