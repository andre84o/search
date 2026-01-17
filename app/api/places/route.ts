import { NextRequest, NextResponse } from 'next/server';
import { SearchArea, SearchResult, Nationality, PlaceType } from '../../types/business';
import { searchPlacesInArea } from '../../lib/googlePlaces';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area, nationality = 'all', placeType = 'all' } = body as {
      area: SearchArea;
      nationality?: Nationality;
      placeType?: PlaceType;
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
      return NextResponse.json(getDemoData(area, nationality, placeType));
    }

    const businesses = await searchPlacesInArea(area, apiKey, nationality, placeType);

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
function getDemoData(area: SearchArea, nationality: Nationality, placeType: PlaceType): SearchResult {
  const allDemoPlaces = [
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
      swedishIndicators: ['Svenska'],
    },
    {
      id: 'demo-2',
      name: 'The British Pub',
      address: 'Avenida Habaneras 22, 03182 Torrevieja',
      phone: '+34 965 789 012',
      website: undefined,
      photoUrl: undefined,
      rating: 4.2,
      totalRatings: 89,
      types: ['bar', 'pub'],
      category: 'bar' as const,
      location: { lat: 37.9812, lng: -0.6801 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
    {
      id: 'demo-3',
      name: 'Ristorante Italiano Da Marco',
      address: 'Calle Mayor 45, Torrevieja',
      phone: '+34 965 123 456',
      website: undefined,
      photoUrl: undefined,
      rating: 4.6,
      totalRatings: 234,
      types: ['restaurant', 'italian'],
      category: 'restaurant' as const,
      location: { lat: 37.9798, lng: -0.6815 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
    {
      id: 'demo-attr-1',
      name: 'Parque Natural de las Lagunas',
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
      id: 'demo-beach-1',
      name: 'Playa del Cura',
      address: 'Torrevieja, Alicante, Spain',
      phone: undefined,
      website: undefined,
      photoUrl: undefined,
      rating: 4.5,
      totalRatings: 2340,
      types: ['beach', 'natural_feature'],
      category: 'other' as const,
      location: { lat: 37.9765, lng: -0.6834 },
      isSwedish: false,
      swedishConfidence: 0,
      swedishIndicators: [],
    },
    {
      id: 'demo-museum-1',
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
  ];

  // Filter based on placeType
  let filtered = allDemoPlaces;
  if (placeType !== 'all') {
    const typeFilters: Record<string, string[]> = {
      restaurants: ['restaurant'],
      cafes: ['cafe'],
      bars: ['bar', 'pub'],
      attractions: ['tourist_attraction', 'point_of_interest'],
      nature: ['park', 'natural_feature'],
      culture: ['museum', 'church'],
      beaches: ['beach'],
    };
    const allowedTypes = typeFilters[placeType] || [];
    if (allowedTypes.length > 0) {
      filtered = filtered.filter(place =>
        place.types.some(t => allowedTypes.includes(t))
      );
    }
  }

  return {
    businesses: filtered,
    total: filtered.length,
    swedishCount: filtered.filter((b) => b.isSwedish).length,
    searchArea: area,
  };
}
