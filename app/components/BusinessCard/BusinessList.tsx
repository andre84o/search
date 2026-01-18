'use client';

import { useState } from 'react';
import { Search, Building2, Heart } from 'lucide-react';
import { Business, Nationality, nationalityConfigs } from '../../types/business';
import BusinessCard from './BusinessCard';

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
  hasSearched: boolean;
  matchCount: number;
  showOnlyMatching: boolean;
  onToggleMatching: () => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  nationality: Nationality;
}

type ViewMode = 'all' | 'favorites';

export default function BusinessList({
  businesses,
  isLoading,
  hasSearched,
  matchCount,
  showOnlyMatching,
  onToggleMatching,
  favorites,
  onToggleFavorite,
  nationality,
}: BusinessListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const nationalityConfig = nationalityConfigs.find(c => c.id === nationality);

  // For now, show all businesses since filtering by nationality happens in the API
  const filteredBusinesses = businesses;

  const displayedBusinesses = viewMode === 'favorites'
    ? filteredBusinesses.filter((b) => favorites.has(b.id))
    : filteredBusinesses;

  const favoritesCount = filteredBusinesses.filter((b) => favorites.has(b.id)).length;

  return (
    <div className="h-full flex flex-col mx-auto max-w-full">
      {/* Header */}
      <div className="p-3 sm:p-5 pb-2 border-b border-white/10 shrink-0">
        <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-0.5 sm:mb-1">
          Sökresultat
        </h2>
        {hasSearched && (
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-slate-400">
              Hittade <span className="text-yellow-500 font-bold">{businesses.length}</span> platser
              {nationality !== 'all' && nationalityConfig && (
                <span className="ml-1 opacity-80">
                  {nationalityConfig.flag}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* View mode tabs */}
      {hasSearched && !isLoading && (
        <div className="flex border-b border-white/10 p-1.5 sm:p-2 gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all ${
              viewMode === 'all'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:bg-white/10'
            }`}
          >
            Alla ({filteredBusinesses.length})
          </button>
          <button
            onClick={() => setViewMode('favorites')}
            className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${
              viewMode === 'favorites'
                ? 'bg-red-500/20 text-red-400 border border-red-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <Heart size={12} className={`sm:w-3.5 sm:h-3.5 ${viewMode === 'favorites' ? 'fill-red-400' : ''}`} />
            Favoriter ({favoritesCount})
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-500">
            <div className="animate-spin h-8 w-8 sm:h-10 sm:w-10 border-2 border-yellow-500 border-t-transparent rounded-full mb-3 sm:mb-4 shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
            <p className="text-xs sm:text-sm tracking-wider uppercase font-medium">Söker efter platser...</p>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-500">
            <div className="p-3 sm:p-4 bg-white/5 rounded-full mb-3 sm:mb-4 ring-1 ring-white/10">
              <Search size={24} className="text-slate-400 sm:w-8 sm:h-8" />
            </div>
            <p className="text-center font-medium text-slate-400 text-sm sm:text-base px-4">
              Rita ett område på kartan <br /> för att hitta platser
            </p>
            <p className="text-[10px] sm:text-xs text-slate-600 mt-2">Använd ritverktygen uppe till vänster</p>
          </div>
        ) : displayedBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-slate-500">
            {viewMode === 'favorites' ? (
              <>
                <div className="p-3 sm:p-4 bg-red-500/10 rounded-full mb-3 sm:mb-4 ring-1 ring-red-500/20">
                  <Heart size={24} className="text-red-400 sm:w-8 sm:h-8" />
                </div>
                <p className="text-center text-slate-400 text-sm sm:text-base">
                  Inga sparade ställen ännu.
                </p>
              </>
            ) : (
              <>
                <div className="p-3 sm:p-4 bg-white/5 rounded-full mb-3 sm:mb-4 ring-1 ring-white/10">
                   <Building2 size={24} className="text-slate-400 sm:w-8 sm:h-8" />
                </div>
                <p className="text-center text-slate-400 text-sm sm:text-base">
                  Inga platser hittades i detta område
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-5 grid-cols-1 pb-16 sm:pb-20">
            {displayedBusinesses.map((business) => (
              <div key={business.id} className="animate-fade-in">
                <BusinessCard
                  business={business}
                  isFavorite={favorites.has(business.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
