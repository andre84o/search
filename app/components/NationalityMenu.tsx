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
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl hover:bg-white/10 transition-colors min-w-[180px] text-white border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      >
        {currentConfig.countryCode ? (
          <span className={`fi fi-${currentConfig.countryCode} text-lg rounded-sm `} />
        ) : (
          <Globe size={18} className="text-yellow-500" />
        )}
        <span className="font-medium flex-1 text-left tracking-wide">{currentConfig.label}</span>
        <ChevronDown size={16} className={'text-slate-400 transition-transform ' + rotateClass} />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full mt-2 left-0 w-full glass-panel rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] z-[70] animate-fade-in border-white/10 max-h-[300px] overflow-y-auto custom-scrollbar">
            {nationalityConfigs.map((config) => (
              <button
                key={config.id}
                onClick={() => onChange(config.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  nationality === config.id
                    ? 'bg-blue-600/30 text-white font-medium'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {config.countryCode ? (
                  <span className={`fi fi-${config.countryCode} text-lg rounded-sm`} />
                ) : (
                   <Globe size={18} className={nationality === config.id ? 'text-yellow-400' : 'text-slate-400'} />
                )}
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
