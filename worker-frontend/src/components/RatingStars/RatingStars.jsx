import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({
  rating = 5.0,
  maxRating = 5,
  size = 'sm', // 'xs' | 'sm' | 'md' | 'lg'
  showScore = true,
  reviewsCount = null,
  className = '',
}) {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(maxRating)].map((_, index) => {
          const filled = index + 1 <= Math.floor(rating);
          const half = !filled && index < rating;
          return (
            <Star
              key={index}
              className={`${currentSize} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
              }`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {reviewsCount !== null && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
}
