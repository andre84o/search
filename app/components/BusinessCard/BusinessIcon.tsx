'use client';

import { categoryConfig } from '../../lib/categoryIcons';
import { BusinessCategory } from '../../types/business';

interface BusinessIconProps {
  category: BusinessCategory;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8 p-1.5',
  md: 'w-10 h-10 p-2',
  lg: 'w-12 h-12 p-2.5',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function BusinessIcon({ category, size = 'md' }: BusinessIconProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <div
      className={`${sizeClasses[size]} ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
    >
      <Icon className={config.color} size={iconSizes[size]} />
    </div>
  );
}
