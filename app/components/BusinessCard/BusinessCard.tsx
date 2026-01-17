'use client';

import { MapPin, Phone, Globe, Star, Flag, Heart } from 'lucide-react';
import { Business } from '../../types/business';
import { categoryConfig } from '../../lib/categoryIcons';
import BusinessIcon from './BusinessIcon';

interface BusinessCardProps {
  business: Business;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function BusinessCard({ business, isFavorite, onToggleFavorite }: BusinessCardProps) {
  const categoryLabel = categoryConfig[business.category]?.label || 'Övrigt';

  return (
    <div className="lux-card rounded-xl overflow-hidden group">
      {/* Image or placeholder */}
      <div className="relative h-40 bg-slate-800/50">
        {business.photoUrl ? (
          <img
            src={business.photoUrl}
            alt={business.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <BusinessIcon category={business.category} size="lg" />
          </div>
        )}

        {/* Overlay gradient for text readability if needed, though we moved text out */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Favorite button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(business.id);
            }}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10"
            title={isFavorite ? 'Ta bort från måste-besöka' : 'Lägg till i måste-besöka'}
          >
            <Heart
              size={18}
              className={isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300'}
            />
          </button>
        )}

        {/* Swedish badge */}
        {business.isSwedish && (
          <div className="absolute top-2 right-2 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-blue-400/30">
            <Flag size={12} />
            <span>SVENSKT</span>
          </div>
        )}

        {/* Rating */}
        {business.rating && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 border border-white/10">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span>{business.rating.toFixed(1)}</span>
            {business.totalRatings && (
              <span className="text-slate-400">({business.totalRatings})</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-yellow-500/30 transition-colors">
             <BusinessIcon category={business.category} size="sm" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-100 truncate group-hover:text-yellow-400 transition-colors">{business.name}</h3>
            <span className="text-xs text-slate-400 uppercase tracking-wider">{categoryLabel}</span>
          </div>
        </div>

        {/* Swedish indicators */}
        {business.isSwedish && business.swedishIndicators.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {business.swedishIndicators.slice(0, 3).map((indicator, i) => (
              <span
                key={i}
                className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full"
              >
                {indicator}
              </span>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="space-y-2.5">
          {/* Address */}
          <div className="flex items-start gap-2.5 text-sm text-slate-300">
            <MapPin size={16} className="flex-shrink-0 mt-0.5 text-slate-500" />
            <span className="line-clamp-2">{business.address}</span>
          </div>

          {/* Phone */}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-yellow-400 transition-colors"
            >
              <Phone size={16} className="flex-shrink-0 text-slate-500" />
              <span>{business.phone}</span>
            </a>
          )}

          {/* Website */}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Globe size={16} className="flex-shrink-0" />
              <span className="truncate">Besök hemsida</span>
            </a>
          )}
        </div>

        {/* Confidence meter */}
        {business.isSwedish && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 uppercase tracking-wide font-medium">
              <span>Svensk sannolikhet</span>
              <span>{business.swedishConfidence}%</span>
            </div>
            <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${business.swedishConfidence}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
