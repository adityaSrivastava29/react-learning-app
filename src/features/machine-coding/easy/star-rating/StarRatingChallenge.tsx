import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

export const StarRatingChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [rating, setRating] = useState(3);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold flex items-center gap-1">
          <input
            type="checkbox"
            checked={isReadOnly}
            onChange={(e) => setIsReadOnly(e.target.checked)}
            className="rounded"
          />
          Read-Only Mode
        </label>
      </div>

      <div
        className={`p-6 rounded-lg border text-center space-y-3 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={isReadOnly}
              onClick={() => setRating(star)}
              onMouseEnter={() => !isReadOnly && setHoverRating(star)}
              onMouseLeave={() => !isReadOnly && setHoverRating(null)}
              className={`text-3xl transition-transform ${
                isReadOnly ? "cursor-default" : "cursor-pointer hover:scale-125"
              }`}>
              <span className={star <= displayRating ? "text-amber-400" : "text-gray-300 dark:text-gray-700"}>
                ★
              </span>
            </button>
          ))}
        </div>

        <p className="text-xs font-mono font-semibold opacity-80">
          Current Rating: <strong>{rating} / 5 Stars</strong> {isReadOnly && "(Read Only)"}
        </p>
      </div>
    </div>
  );
};
