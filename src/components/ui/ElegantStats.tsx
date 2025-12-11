import React from 'react';
import { cn } from '@/utils/helpers';

interface Stat {
  number: string;
  label: string;
  icon?: React.ReactNode;
}

interface ElegantStatsProps {
  stats: Stat[];
  className?: string;
  variant?: 'light' | 'dark';
}

export const ElegantStats: React.FC<ElegantStatsProps> = ({ 
  stats, 
  className,
  variant = 'light' 
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8', className)}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center group">
          {stat.icon && (
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110',
              variant === 'light' 
                ? 'bg-red-100 text-red-600 group-hover:bg-red-200' 
                : 'bg-white/10 text-white group-hover:bg-white/20'
            )}>
              {stat.icon}
            </div>
          )}
          <div className={cn(
            'text-4xl font-bold mb-2 transition-colors',
            variant === 'light' ? 'text-gray-900' : 'text-white'
          )}>
            {stat.number}
          </div>
          <div className={cn(
            'text-sm font-medium transition-colors',
            variant === 'light' ? 'text-gray-600' : 'text-gray-300'
          )}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};