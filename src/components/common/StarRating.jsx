import { useState } from 'react';
import { RATING_CONFIG } from '../../config/constants';

export default function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showLabel = false,
  id = 'star-rating',
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (star) => {
    if (!readonly && onChange) {
      onChange(star);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex-gap">
      <div
        className={`star-rating ${readonly ? 'readonly' : ''} ${size}`}
        id={id}
        role="radiogroup"
        aria-label="Rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= displayValue ? 'active' : ''} ${!readonly && star <= hoverValue ? 'hover' : ''}`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            role={readonly ? 'img' : 'radio'}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-checked={star === value}
          >
            ★
          </span>
        ))}
      </div>
      {showLabel && value > 0 && (
        <span className="star-label">
          {RATING_CONFIG.STAR_LABELS[value - 1]}
        </span>
      )}
    </div>
  );
}
