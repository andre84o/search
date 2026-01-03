import { NextRequest, NextResponse } from 'next/server';
import { SearchArea, SearchResult, SearchType } from '../../types/business';
import { searchPlacesInArea } from '../../lib/googlePlaces';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area, searchType = 'swedish_businesses' } = body as {
      area: SearchArea;
      searchType?: SearchType;
    };

    if (!area || !area.coordinates || area.coordinates.length === 0) {
      return NextResponse.json(
        { error: 'Ogiltigt sökområde' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      // Return demo data if no API key
      return NextResponse.json(getDemoData(area, searchType));
    }

    const businesses = await searchPlacesInArea(area, apiKey, searchType);

    const result: SearchResult = {
      businesses,
      total: businesses.length,
      swedishCount: businesses.filter((b) => b.isSwedish).length,
      searchArea: area,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { error: 'Kunde inte söka efter platser' },
      { status: 500 }
    );
  }
}

// Demo data for testing without API key
function getDemoData(area: SearchArea, searchType: SearchType): SearchResult {
  const swedishBusinesses = [
    {
      id: 'demo-1',
      name: 'Svenska Baren Torrevieja',
      address: 'Calle del Mar 15, 03181 Torrevieja, Alicante, Spain',
      phone: '+34 966 123 456',
      website: 'https://svenskabaren.se',
      photoUrl: undefined,
      rating: 4.5,
      totalRatings: 127,
      types: ['bar', 'restaurant'],
      category: 'bar' as const,
      location: { lat: 37.9785, lng: -0.6823 },
      isSwedish: true,
      swedishConfidence: 85,
      swedishIndicators: ['Nyckelord: "svenska"', 'Svensk domän (.se)'],
    },
    {
      id: 'demo-2',
      name: 'Stockholm Café',
      address: 'Avenida Habaneras 22, 03182 Torrevieja, Alicante, Spain',
      phone: '+34 965 789 012',
      website: undefined,
      photoUrl: undefined,
      rating: 4.2,
      totalRatings: 89,
      types: ['cafe', 'bakery'],
      category: 'cafe' as const,
      location: { lat: 37.9812, lng: -0.6801 },
      isSwedish: true,
      swedishConfidence: 50,
      swedishIndicators: ['Nyckelord: "stockholm"'],
    },
  ];

  const attractions = [
    {
      id: 'demo-attr-1',
      name: 'Parque Natural de las Lagunas de La Mata',
      address: 'Torrevieja, Alicante, Spain',
      phone: undefined,
      website: undefined,
      photoUrl: undefined,
      rating: 4.7,
      totalRatings: 1250,
      types: ['park', 'natural_feature'],
      category: 'other' as const,
      location: { lat: 38.0123, lng: -0.6789 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
    {
      id: 'demo-attr-2',
      name: 'Playa del Cura',
      address: 'Torrevieja, Alicante, Spain',
      phone: undefined,
      website: undefined,
      photoUrl: undefined,
      rating: 4.5,
      totalRatings: 2340,
      types: ['beach', 'point_of_interest'],
      category: 'other' as const,
      location: { lat: 37.9765, lng: -0.6834 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
  ];

  const nature = [
    {
      id: 'demo-nat-1',
      name: 'Salinas de Torrevieja',
      address: 'Torrevieja, Alicante, Spain',
      phone: undefined,
      website: undefined,
      photoUrl: undefined,
      rating: 4.8,
      totalRatings: 3450,
      types: ['natural_feature', 'point_of_interest'],
      category: 'other' as const,
      location: { lat: 37.9845, lng: -0.7123 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
  ];

  const culture = [
    {
      id: 'demo-cult-1',
      name: 'Museo del Mar y de la Sal',
      address: 'Calle Patricio Pérez 10, Torrevieja',
      phone: '+34 965 710 273',
      website: undefined,
      photoUrl: undefined,
      rating: 4.3,
      totalRatings: 567,
      types: ['museum'],
      category: 'other' as const,
      location: { lat: 37.9789, lng: -0.6812 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
    {
      id: 'demo-cult-2',
      name: 'Iglesia de la Inmaculada Concepción',
      address: 'Plaza de la Constitución, Torrevieja',
      phone: undefined,
      website: undefined,
      photoUrl: undefined,
      rating: 4.6,
      totalRatings: 234,
      types: ['church', 'place_of_worship'],
      category: 'other' as const,
      location: { lat: 37.9778, lng: -0.6845 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
  ];

  const restaurants = [
    {
      id: 'demo-rest-1',
      name: 'Restaurante La Esquina',
      address: 'Calle Ramón Gallud 45, Torrevieja',
      phone: '+34 965 123 789',
      website: undefined,
      photoUrl: undefined,
      rating: 4.4,
      totalRatings: 789,
      types: ['restaurant', 'food'],
      category: 'restaurant' as const,
      location: { lat: 37.9801, lng: -0.6798 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
  ];

  let demoBusinesses;
  switch (searchType) {
    case 'attractions':
      demoBusinesses = attractions;
      break;
    case 'nature':
      demoBusinesses = nature;
      break;
    case 'culture':
      demoBusinesses = culture;
      break;
    case 'restaurants':
      demoBusinesses = restaurants;
      break;
    case 'all':
      demoBusinesses = [...swedishBusinesses, ...attractions, ...nature, ...culture, ...restaurants];
      break;
    default:
      demoBusinesses = swedishBusinesses;
  }

  return {
    businesses: demoBusinesses,
    total: demoBusinesses.length,
    swedishCount: demoBusinesses.filter((b) => b.isSwedish).length,
    searchArea: area,
  };
}
