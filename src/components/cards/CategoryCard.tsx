import React from 'react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      id={`cat-card-${category.slug}`}
      onClick={onClick}
      className={`group flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-300 text-center min-w-[90px] focus:outline-none ${
        isSelected
          ? 'bg-orange-50 ring-2 ring-orange-500 scale-105'
          : 'hover:bg-stone-50'
      }`}
    >
      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
        <div className="w-full h-full rounded-full overflow-hidden bg-white">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>
      <span className={`text-xs font-bold transition-colors line-clamp-1 ${
        isSelected ? 'text-orange-600 font-extrabold' : 'text-stone-700 group-hover:text-orange-600'
      }`}>
        {category.name}
      </span>
    </button>
  );
};
