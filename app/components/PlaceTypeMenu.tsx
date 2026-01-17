'use client';

import { ChevronDown, Search, Utensils, Coffee, Beer, ShoppingBag, Camera, Trees, Landmark, Umbrella, Briefcase } from 'lucide-react';
import { PlaceType, placeTypeConfigs } from '../types/business';

const iconMap: Record<string, React.ReactNode> = {
  'search': <Search size={16} />,
  'utensils': <Utensils size={16} />,
  'coffee': <Coffee size={16} />,
  'beer': <Beer size={16} />,
  'shopping-bag': <ShoppingBag size={16} />,
  'camera': <Camera size={16} />,
  'trees': <Trees size={16} />,
  'landmark': <Landmark size={16} />,
  'umbrella': <Umbrella size={16} />,
  'briefcase': <Briefcase size={16} />,
};

interface PlaceTypeMenuProps {
  placeType: PlaceType;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (placeType: PlaceType) => void;
}

export default function PlaceTypeMenu({ placeType, isOpen, onToggle, onChange }: PlaceTypeMenuProps) {
  const currentConfig = placeTypeConfigs.find(c => c.id === placeType) || placeTypeConfigs[0];
  const rotateClass = isOpen ? 'rotate-180' : '';

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl hover:bg-white/10 transition-colors min-w-[200px] text-white border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      >
        <span className="text-slate-300">{iconMap[currentConfig.icon]}</span>
        <span className="font-medium flex-1 text-left tracking-wide">{currentConfig.label}</span>
        <ChevronDown size={16} className={'text-slate-400 transition-transform ' + rotateClass} />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full mt-2 left-0 w-full glass-panel rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[70] overflow-hidden animate-fade-in border-white/10 max-h-[300px] overflow-y-auto custom-scrollbar">
            {placeTypeConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => onChange(config.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  placeType === config.id
                    ? 'bg-blue-600/30 text-white font-medium'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span className={placeType === config.id ? 'text-white' : 'text-slate-400'}>
                  {iconMap[config.icon]}
                </span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
