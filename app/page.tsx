'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SearchArea, Business, SearchResult } from './types/business';
import BusinessList from './components/BusinessCard/BusinessList';
import { MapPin } from 'lucide-react';
import Logo from './components/Logo';

// Dynamic import for Map to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Laddar karta...</div>
    </div>
  ),
});

const FAVORITES_KEY = 'swedish-businesses-favorites';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [swedishCount, setSwedishCount] = useState(0);
  const [showOnlySwedish, setShowOnlySwedish] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavorites(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const handleToggleFavorite = useCallback((businessId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(businessId)) {
        next.delete(businessId);
      } else {
        next.add(businessId);
      }
      return next;
    });
  }, []);

  const handleAreaSelected = useCallback(async (area: SearchArea) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ area }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte hämta företag');
      }

      const data: SearchResult = await response.json();

      setBusinesses(data.businesses);
      setSwedishCount(data.swedishCount);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleSwedish = useCallback(() => {
    setShowOnlySwedish((prev) => !prev);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={48} />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Svenska Företag i Torrevieja
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              Hitta svenskägda företag i Costa Blanca
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>Rita ett område på kartan</p>
          <p>för att söka efter företag</p>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map - 60% width on desktop */}
        <div className="w-full lg:w-3/5 h-full">
          <MapContainer onAreaSelected={handleAreaSelected} isLoading={isLoading} />
        </div>

        {/* Business list - 40% width on desktop */}
        <div className="hidden lg:block lg:w-2/5 h-full border-l border-gray-200">
          <BusinessList
            businesses={businesses}
            isLoading={isLoading}
            hasSearched={hasSearched}
            swedishCount={swedishCount}
            showOnlySwedish={showOnlySwedish}
            onToggleSwedish={handleToggleSwedish}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {/* Mobile bottom sheet (simplified) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg max-h-[60vh] overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex justify-center">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="overflow-y-auto max-h-[calc(60vh-44px)]">
          <BusinessList
            businesses={businesses}
            isLoading={isLoading}
            hasSearched={hasSearched}
            swedishCount={swedishCount}
            showOnlySwedish={showOnlySwedish}
            onToggleSwedish={handleToggleSwedish}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
}
