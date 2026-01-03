import { NextRequest, NextResponse } from 'next/server';
import { SearchArea, SearchResult } from '../../types/business';
import { searchBusinessesInArea } from '../../lib/googlePlaces';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area } = body as { area: SearchArea };

    if (!area || !area.coordinates || area.coordinates.length === 0) {
      return NextResponse.json(
        { error: 'Ogiltigt sökområde' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      // Return demo data if no API key
      return NextResponse.json(getDemoData(area));
    }

    const businesses = await searchBusinessesInArea(area, apiKey);

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
      { error: 'Kunde inte söka efter företag' },
      { status: 500 }
    );
  }
}

// Demo data for testing without API key
function getDemoData(area: SearchArea): SearchResult {
  const demoBusinesses = [
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
    {
      id: 'demo-3',
      name: 'Nordic Real Estate',
      address: 'Plaza de la Constitución 5, 03181 Torrevieja, Spain',
      phone: '+34 966 345 678',
      website: 'https://nordicrealestate.com',
      photoUrl: undefined,
      rating: 4.8,
      totalRatings: 45,
      types: ['real_estate_agency'],
      category: 'real_estate' as const,
      location: { lat: 37.9770, lng: -0.6850 },
      isSwedish: true,
      swedishConfidence: 40,
      swedishIndicators: ['Nyckelord: "nordic"'],
    },
    {
      id: 'demo-4',
      name: 'Scandinavian Hair Studio',
      address: 'Calle Ramón Gallud 12, 03181 Torrevieja, Spain',
      phone: '+34 965 234 567',
      website: undefined,
      photoUrl: undefined,
      rating: 4.6,
      totalRatings: 72,
      types: ['hair_care', 'beauty_salon'],
      category: 'beauty' as const,
      location: { lat: 37.9798, lng: -0.6795 },
      isSwedish: true,
      swedishConfidence: 45,
      swedishIndicators: ['Nyckelord: "scandinavian"'],
    },
    {
      id: 'demo-5',
      name: 'Köttbullar & More',
      address: 'Paseo Vista Alegre 8, 03182 Torrevieja, Spain',
      phone: '+34 966 456 789',
      website: undefined,
      photoUrl: undefined,
      rating: 4.3,
      totalRatings: 156,
      types: ['restaurant', 'food'],
      category: 'restaurant' as const,
      location: { lat: 37.9755, lng: -0.6888 },
      isSwedish: true,
      swedishConfidence: 60,
      swedishIndicators: ['Nyckelord: "köttbullar"', 'Svenskt tecken: "ö"'],
    },
    {
      id: 'demo-6',
      name: 'Swedish Medical Center',
      address: 'Calle Concordia 25, 03181 Torrevieja, Spain',
      phone: '+34 965 567 890',
      website: 'https://swedishmedical.es',
      photoUrl: undefined,
      rating: 4.9,
      totalRatings: 234,
      types: ['doctor', 'health'],
      category: 'health' as const,
      location: { lat: 37.9802, lng: -0.6778 },
      isSwedish: true,
      swedishConfidence: 70,
      swedishIndicators: ['Nyckelord: "swedish"'],
    },
    {
      id: 'demo-7',
      name: 'Malmö Bygg & Renovering',
      address: 'Calle Antonio Machado 18, 03183 Torrevieja, Spain',
      phone: '+34 966 678 901',
      website: undefined,
      photoUrl: undefined,
      rating: 4.4,
      totalRatings: 38,
      types: ['general_contractor', 'construction'],
      category: 'construction' as const,
      location: { lat: 37.9720, lng: -0.6910 },
      isSwedish: true,
      swedishConfidence: 55,
      swedishIndicators: ['Nyckelord: "malmö"', 'Svenskt tecken: "ö"'],
    },
    {
      id: 'demo-8',
      name: 'Göteborg Auto Service',
      address: 'Polígono Industrial, 03184 Torrevieja, Spain',
      phone: '+34 965 789 123',
      website: undefined,
      photoUrl: undefined,
      rating: 4.1,
      totalRatings: 67,
      types: ['car_repair', 'automotive'],
      category: 'automotive' as const,
      location: { lat: 37.9680, lng: -0.7050 },
      isSwedish: true,
      swedishConfidence: 50,
      swedishIndicators: ['Nyckelord: "göteborg"', 'Svenskt tecken: "ö"'],
    },
  ];

  return {
    businesses: demoBusinesses,
    total: demoBusinesses.length,
    swedishCount: demoBusinesses.filter((b) => b.isSwedish).length,
    searchArea: area,
  };
}
