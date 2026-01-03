'use client';

import { MapPin, Phone, Globe, Star, Flag } from 'lucide-react';
import { Business } from '../../types/business';
import { categoryConfig } from '../../lib/categoryIcons';
import BusinessIcon from './BusinessIcon';

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const categoryLabel = categoryConfig[business.category]?.label || 'Övrigt';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image or placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200">
        {business.photoUrl ? (
          <img
            src={business.photoUrl}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BusinessIcon category={business.category} size="lg" />
          </div>
        )}

        {/* Swedish badge */}
        {business.isSwedish && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Flag size={12} />
            <span>Svenskt</span>
          </div>
        )}

        {/* Rating */}
        {business.rating && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span>{business.rating.toFixed(1)}</span>
            {business.totalRatings && (
              <span className="text-gray-500">({business.totalRatings})</span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <BusinessIcon category={business.category} size="sm" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
            <span className="text-xs text-gray-500">{categoryLabel}</span>
          </div>
        </div>

        {/* Swedish indicators */}
        {business.isSwedish && business.swedishIndicators.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {business.swedishIndicators.slice(0, 2).map((indicator, i) => (
              <span
                key={i}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
              >
                {indicator}
              </span>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="space-y-2">
          {/* Address */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin size={16} className="flex-shrink-0 mt-0.5 text-gray-400" />
            <span className="line-clamp-2">{business.address}</span>
          </div>

          {/* Phone */}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Phone size={16} className="flex-shrink-0" />
              <span>{business.phone}</span>
            </a>
          )}

          {/* Website */}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Globe size={16} className="flex-shrink-0" />
              <span className="truncate">Besök hemsida</span>
            </a>
          )}
        </div>

        {/* Confidence meter */}
        {business.isSwedish && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Svensk sannolikhet</span>
              <span>{business.swedishConfidence}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${business.swedishConfidence}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
