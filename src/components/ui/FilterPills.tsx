import React from 'react';
import { cn } from '@/utils/helpers';

interface FilterPillsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className
}) => {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-6 py-2.5 rounded-full font-medium transition-all duration-200 text-sm',
            'hover:scale-105 active:scale-95',
            selectedCategory === category
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};