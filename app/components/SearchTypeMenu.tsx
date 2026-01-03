'use client';

import { ChevronDown, Flag, Camera, Trees, Landmark, Utensils, Search } from 'lucide-react';
import { SearchType, searchTypeConfigs } from '../types/business';

const iconMap: Record<string, React.ReactNode> = {
  flag: <Flag size={16} />,
  camera: <Camera size={16} />,
  trees: <Trees size={16} />,
  landmark: <Landmark size={16} />,
  utensils: <Utensils size={16} />,
  search: <Search size={16} />,
};

interface SearchTypeMenuProps {
  searchType: SearchType;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (type: SearchType) => void;
}

export default function SearchTypeMenu({ searchType, isOpen, onToggle, onChange }: SearchTypeMenuProps) {
  const currentConfig = searchTypeConfigs.find(c => c.id === searchType) || searchTypeConfigs[0];
  const rotateClass = isOpen ? 'rotate-180' : '';

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {iconMap[currentConfig.icon]}
        <span className="font-medium">{currentConfig.label}</span>
        <ChevronDown size={16} className={'transition-transform ' + rotateClass} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="p-2">
              <p className="text-xs text-gray-500 px-3 py-2 font-medium">Valj vad du vill hitta</p>
              {searchTypeConfigs.map((config) => (
                <button
                  key={config.id}
                  onClick={() => onChange(config.id)}
                  className={searchType === config.id 
                    ? 'w-full flex items-start gap-3 p-3 rounded-lg text-left bg-blue-50 text-blue-700' 
                    : 'w-full flex items-start gap-3 p-3 rounded-lg text-left hover:bg-gray-50 text-gray-700'}
                >
                  <div className={searchType === config.id ? 'mt-0.5 text-blue-600' : 'mt-0.5 text-gray-400'}>
                    {iconMap[config.icon]}
                  </div>
                  <div>
                    <div className="font-medium">{config.label}</div>
                    <div className="text-xs text-gray-500">{config.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
