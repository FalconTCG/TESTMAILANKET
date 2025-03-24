'use client';

import { useState } from 'react';

interface RatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ 
  value = 0, 
  onChange, 
  readOnly = false,
  size = 'md'
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    if (readOnly) return;
    onChange?.(rating);
  };

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const textSize = sizeClasses[size];

  const renderStar = (rating: number) => {
    const filled = hoverRating ? hoverRating >= rating : value >= rating;
    const colorClass = filled 
      ? 'text-pastel-yellow shadow-md' 
      : 'text-gray-200';
    
    return (
      <span
        key={rating}
        className={`${textSize} cursor-${readOnly ? 'default' : 'pointer'} ${colorClass} transition-all duration-200 transform hover:scale-110`}
        onMouseEnter={() => handleMouseEnter(rating)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(rating)}
        style={{ 
          textShadow: filled ? '0 0 10px rgba(255, 242, 204, 0.6)' : 'none',
        }}
      >
        ★
      </span>
    );
  };

  return (
    <div className="flex space-x-2 items-center">
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
} 