'use client';

import { Globe, ChevronDown } from 'lucide-react';
import { Nationality, nationalityConfigs } from '../types/business';

interface NationalityMenuProps {
  nationality: Nationality;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (nationality: Nationality) => void;
}

export default function NationalityMenu({ nationality, isOpen, onToggle, onChange }: NationalityMenuProps) {
  const currentConfig = nationalityConfigs.find(c => c.id === nationality) || nationalityConfigs[0];
  const rotateClass = isOpen ? 'rotate-180' : '';

  return (
    <div className="relative w-full sm:w-auto">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2.5 glass-panel rounded-lg sm:rounded-xl hover:bg-white/10 transition-colors min-w-0 sm:min-w-[180px] text-white border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          {currentConfig.countryCode ? (
            <span className={`fi fi-${currentConfig.countryCode} text-sm sm:text-lg rounded-sm shrink-0`} />
          ) : (
            <Globe className="text-yellow-500 w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] shrink-0" />
          )}
          <span className="font-medium flex-1 text-left tracking-wide text-xs sm:text-base truncate">{currentConfig.label}</span>
        </div>
        <ChevronDown size={14} className={'text-slate-400 transition-transform sm:w-4 sm:h-4 shrink-0 ' + rotateClass} />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full mt-2 left-0 min-w-[200px] w-full sm:min-w-[200px] sm:w-auto glass-panel rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[70] animate-fade-in border-white/10 max-h-[60vh] sm:max-h-[300px] overflow-y-auto custom-scrollbar">
            {nationalityConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => onChange(config.id)}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 transition-colors text-xs sm:text-base ${
                  nationality === config.id
                    ? 'bg-blue-600/30 text-white font-medium'
                    : 'text-slate-300 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {config.countryCode ? (
                  <span className={`fi fi-${config.countryCode} text-sm sm:text-lg rounded-sm shrink-0`} />
                ) : (
                   <Globe className={`w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] shrink-0 ${nationality === config.id ? 'text-yellow-400' : 'text-slate-400'}`} />
                )}
                <span className="truncate">{config.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
