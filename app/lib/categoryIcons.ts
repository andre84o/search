import {
  Utensils,
  Coffee,
  Wine,
  ShoppingBag,
  Wrench,
  Heart,
  Scissors,
  Home,
  HardHat,
  Car,
  GraduationCap,
  Landmark,
  Scale,
  Building2,
  type LucideIcon,
} from 'lucide-react';
import { BusinessCategory } from '../types/business';

interface CategoryConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}

export const categoryConfig: Record<BusinessCategory, CategoryConfig> = {
  restaurant: {
    icon: Utensils,
    label: 'Restaurang',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  cafe: {
    icon: Coffee,
    label: 'Café',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
  bar: {
    icon: Wine,
    label: 'Bar',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  shop: {
    icon: ShoppingBag,
    label: 'Butik',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  service: {
    icon: Wrench,
    label: 'Tjänster',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  health: {
    icon: Heart,
    label: 'Hälsa',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  beauty: {
    icon: Scissors,
    label: 'Skönhet',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  real_estate: {
    icon: Home,
    label: 'Fastigheter',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  construction: {
    icon: HardHat,
    label: 'Bygg',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  automotive: {
    icon: Car,
    label: 'Fordon',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  education: {
    icon: GraduationCap,
    label: 'Utbildning',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  finance: {
    icon: Landmark,
    label: 'Ekonomi',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  legal: {
    icon: Scale,
    label: 'Juridik',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
  },
  other: {
    icon: Building2,
    label: 'Övrigt',
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
  },
};

// Map Google Places types to our categories
export function mapGoogleTypeToCategory(types: string[]): BusinessCategory {
  const typeMapping: Record<string, BusinessCategory> = {
    restaurant: 'restaurant',
    food: 'restaurant',
    meal_takeaway: 'restaurant',
    meal_delivery: 'restaurant',
    cafe: 'cafe',
    bakery: 'cafe',
    bar: 'bar',
    night_club: 'bar',
    store: 'shop',
    shopping_mall: 'shop',
    clothing_store: 'shop',
    shoe_store: 'shop',
    jewelry_store: 'shop',
    supermarket: 'shop',
    grocery_or_supermarket: 'shop',
    convenience_store: 'shop',
    home_goods_store: 'shop',
    furniture_store: 'shop',
    hardware_store: 'shop',
    electronics_store: 'shop',
    book_store: 'shop',
    florist: 'shop',
    pet_store: 'shop',
    doctor: 'health',
    dentist: 'health',
    hospital: 'health',
    pharmacy: 'health',
    physiotherapist: 'health',
    veterinary_care: 'health',
    gym: 'health',
    health: 'health',
    hair_care: 'beauty',
    beauty_salon: 'beauty',
    spa: 'beauty',
    real_estate_agency: 'real_estate',
    general_contractor: 'construction',
    electrician: 'construction',
    plumber: 'construction',
    painter: 'construction',
    roofing_contractor: 'construction',
    car_dealer: 'automotive',
    car_rental: 'automotive',
    car_repair: 'automotive',
    car_wash: 'automotive',
    gas_station: 'automotive',
    school: 'education',
    university: 'education',
    library: 'education',
    bank: 'finance',
    accounting: 'finance',
    insurance_agency: 'finance',
    lawyer: 'legal',
    locksmith: 'service',
    moving_company: 'service',
    travel_agency: 'service',
    laundry: 'service',
    lodging: 'service',
  };

  for (const type of types) {
    if (typeMapping[type]) {
      return typeMapping[type];
    }
  }

  return 'other';
}
