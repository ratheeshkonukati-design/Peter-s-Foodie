import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showBadge?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'md',
  interactive = false,
  onRate,
  showBadge = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const currentVal = hoverRating !== null ? hoverRating : rating;

  if (showBadge && !interactive) {
    const isHigh = rating >= 4.5;
    const isGood = rating >= 4.0;
    const bgClass = isHigh
      ? 'bg-emerald-600 text-white'
      : isGood
      ? 'bg-emerald-500 text-white'
      : 'bg-amber-500 text-white';

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs ${bgClass}`}>
        <span>{rating.toFixed(1)}</span>
        <Star className="w-3 h-3 fill-current" />
        {count !== undefined && (
          <span className="opacity-80 font-normal">({count})</span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.round(currentVal);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRate && onRate(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${
                interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
              } p-0.5 focus:outline-none`}
              aria-label={`Rate ${starIndex} stars`}
            >
              <Star
                className={`${starSizes[size]} ${
                  filled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      {count !== undefined && !interactive && (
        <span className="text-xs text-stone-500 ml-1">
          {rating.toFixed(1)} ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export const VegBadge: React.FC<{ isVeg: boolean; size?: 'sm' | 'md' }> = ({ isVeg, size = 'md' }) => {
  const boxSize = size === 'sm' ? 'w-3.5 h-3.5 p-0.5' : 'w-4 h-4 p-0.5';
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';

  return (
    <div
      className={`inline-flex items-center justify-center border rounded-[3px] flex-shrink-0 ${boxSize} ${
        isVeg ? 'border-emerald-600 bg-emerald-50' : 'border-rose-600 bg-rose-50'
      }`}
      title={isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
    >
      <div
        className={`rounded-full ${dotSize} ${
          isVeg ? 'bg-emerald-600' : 'bg-rose-600'
        }`}
      />
    </div>
  );
};
