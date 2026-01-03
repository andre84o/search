'use client';

import { Search, Flag, Building2 } from 'lucide-react';
import { Business } from '../../types/business';
import BusinessCard from './BusinessCard';

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
  hasSearched: boolean;
  swedishCount: number;
  showOnlySwedish: boolean;
  onToggleSwedish: () => void;
}

export default function BusinessList({
  businesses,
  isLoading,
  hasSearched,
  swedishCount,
  showOnlySwedish,
  onToggleSwedish,
}: BusinessListProps) {
  const filteredBusinesses = showOnlySwedish
    ? businesses.filter((b) => b.isSwedish)
    : businesses;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Svenska Företag i Torrevieja
        </h2>
        {hasSearched && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {swedishCount} svenska av {businesses.length} företag funna
            </p>
            <button
              onClick={onToggleSwedish}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                showOnlySwedish
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Flag size={12} />
              {showOnlySwedish ? 'Visar svenska' : 'Visa endast svenska'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mb-3" />
            <p>Söker efter svenska företag...</p>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search size={48} className="mb-3 text-gray-300" />
            <p className="text-center">
              Rita ett område på kartan för att <br /> hitta svenska företag
            </p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Building2 size={48} className="mb-3 text-gray-300" />
            <p className="text-center">
              {showOnlySwedish
                ? 'Inga svenska företag hittades i detta område'
                : 'Inga företag hittades i detta område'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
