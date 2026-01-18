'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SearchArea, Business, SearchResult, Nationality, PlaceType } from './types/business';
import BusinessList from './components/BusinessCard/BusinessList';
import { MapPin, Menu, X } from 'lucide-react';
import Logo from './components/Logo';
import NationalityMenu from './components/NationalityMenu';
import PlaceTypeMenu from './components/PlaceTypeMenu';

// Dynamic import for Map to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#0f172a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-2 border-yellow-500 border-t-transparent rounded-full" />
        <div className="text-slate-400 font-medium tracking-wide">Laddar karta...</div>
      </div>
    </div>
  ),
});

const FAVORITES_KEY = 'places-favorites';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [showOnlyMatching, setShowOnlyMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [nationality, setNationality] = useState<Nationality>('all');
  const [placeType, setPlaceType] = useState<PlaceType>('all');
  const [isNationalityMenuOpen, setIsNationalityMenuOpen] = useState(false);
  const [isPlaceTypeMenuOpen, setIsPlaceTypeMenuOpen] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false); // Controls mobile sheet visibility

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
    setShowMobileSheet(true); // Open sheet on search

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ area, nationality, placeType }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte hämta platser');
      }

      const data: SearchResult = await response.json();

      setBusinesses(data.businesses);
      setMatchCount(data.swedishCount);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett fel uppstod');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [nationality, placeType]);

  const handleToggleMatching = useCallback(() => {
    setShowOnlyMatching((prev) => !prev);
  }, []);

  const handleNationalityChange = (nat: Nationality) => {
    setNationality(nat);
    setIsNationalityMenuOpen(false);
    setHasSearched(false);
    setBusinesses([]);
  };

  const handlePlaceTypeChange = (type: PlaceType) => {
    setPlaceType(type);
    setIsPlaceTypeMenuOpen(false);
    setHasSearched(false);
    setBusinesses([]);
  };

  return (
    <div className="relative h-screen w-full bg-[#0B0E14] overflow-hidden text-slate-200">
      
      {/* Map Layer - Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <MapContainer onAreaSelected={handleAreaSelected} isLoading={isLoading} />
      </div>

      {/* UI Overlay Layer */}
      <div className="relative z-10 h-full w-full pointer-events-none flex flex-col">
        
        {/* Backdrop for closing menus */}
        {(isNationalityMenuOpen || isPlaceTypeMenuOpen) && (
          <div 
            className="absolute inset-0 z-40 pointer-events-auto bg-black/5 backdrop-blur-[1px]" 
            onClick={() => {
              setIsNationalityMenuOpen(false);
              setIsPlaceTypeMenuOpen(false);
            }}
          />
        )}
        
        {/* Floating Header */}
        <header className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 md:right-auto md:w-auto z-50 pointer-events-auto">
          <div className="glass-panel p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl flex flex-row items-center gap-2 sm:gap-4 border border-white/10 backdrop-blur-xl">
            {/* Brand */}
            <div className="flex items-center gap-2 sm:gap-4 pl-1 shrink-0">
              <div className="w-9 h-9 sm:w-[52px] sm:h-[52px] [&>svg]:w-full [&>svg]:h-full">
                <Logo />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Torrevieja</span> Guide
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                  <MapPin size={10} className="text-blue-500" />
                  UPPTÄCK COSTA BLANCA
                </p>
              </div>
            </div>

            <div className="w-px h-8 sm:h-10 bg-white/10 hidden sm:block" />

            {/* Filter Menus */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-1 sm:flex-none">
              <div className="flex-1 min-w-0 sm:flex-none">
                <NationalityMenu
                  nationality={nationality}
                  isOpen={isNationalityMenuOpen}
                  onToggle={() => {
                    setIsNationalityMenuOpen(!isNationalityMenuOpen);
                    setIsPlaceTypeMenuOpen(false);
                  }}
                  onChange={handleNationalityChange}
                />
              </div>
              <div className="flex-1 min-w-0 sm:flex-none">
                <PlaceTypeMenu
                  placeType={placeType}
                  isOpen={isPlaceTypeMenuOpen}
                  onToggle={() => {
                    setIsPlaceTypeMenuOpen(!isPlaceTypeMenuOpen);
                    setIsNationalityMenuOpen(false);
                  }}
                  onChange={handlePlaceTypeChange}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Error Notification */}
        {error && (
          <div className="absolute top-16 sm:top-24 left-2 right-2 sm:left-4 sm:right-auto sm:w-auto z-50 pointer-events-auto">
             <div className="glass-panel bg-red-500/20 border-red-500/30 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-xl flex items-center gap-2 sm:gap-3 backdrop-blur-md text-sm sm:text-base">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                <span className="truncate">{error}</span>
             </div>
          </div>
        )}

        {/* Desktop Sidebar Results */}
        <div className="hidden lg:flex absolute top-[6.5rem] left-4 bottom-4 w-[420px] glass-panel rounded-2xl pointer-events-auto flex-col overflow-hidden shadow-2xl border-white/10 backdrop-blur-xl transition-all duration-300">
           <BusinessList
            businesses={businesses}
            isLoading={isLoading}
            hasSearched={hasSearched}
            matchCount={matchCount}
            showOnlyMatching={showOnlyMatching}
            onToggleMatching={handleToggleMatching}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            nationality={nationality}
          />
        </div>

        {/* Mobile Bottom Sheet Toggle (Fab) - Only show if not open */}
        {!showMobileSheet && (
           <button
             onClick={() => setShowMobileSheet(true)}
             className="lg:hidden absolute bottom-4 sm:bottom-6 right-4 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-600/40 text-white flex items-center justify-center pointer-events-auto z-40 active:scale-95 hover:scale-105 transition-transform"
             aria-label="Öppna resultat"
           >
              <Menu size={20} className="sm:w-6 sm:h-6" />
           </button>
        )}

        {/* Mobile Bottom Sheet */}
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto transition-transform duration-300 ease-out ${
            showMobileSheet ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {/* Handle/Header for dragging (visual only for now) or toggling */}
          <div
            onClick={() => setShowMobileSheet(!showMobileSheet)}
            className="h-12 sm:h-14 glass-panel rounded-t-2xl sm:rounded-t-3xl flex items-center justify-center cursor-pointer border-b-0 relative touch-none"
          >
             <div className="w-10 sm:w-12 h-1 sm:h-1.5 bg-slate-500/50 rounded-full" />
             {showMobileSheet && (
               <button
                 onClick={(e) => { e.stopPropagation(); setShowMobileSheet(false); }}
                 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 active:text-white"
                 aria-label="Stäng resultat"
               >
                 <X size={18} className="sm:w-5 sm:h-5" />
               </button>
             )}
          </div>

          <div className="h-[70vh] sm:h-[75vh] glass-panel border-t-0 bg-[#0B0E14]/95 backdrop-blur-xl pb-safe">
             <BusinessList
              businesses={businesses}
              isLoading={isLoading}
              hasSearched={hasSearched}
              matchCount={matchCount}
              showOnlyMatching={showOnlyMatching}
              onToggleMatching={handleToggleMatching}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              nationality={nationality}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
