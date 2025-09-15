import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const isNumber = typeof rating === "number" && !isNaN(rating);
  const rounded = isNumber ? Math.round(rating * 2) / 2 : 0;
  return (
    <div
      className="flex items-center"
      title={isNumber ? `${rating} out of 5` : "No rating"}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        if (rounded >= i) {
          return <FaStar key={i} className="text-yellow-400" />;
        } else if (rounded + 0.5 === i) {
          return <FaStar key={i} className="text-yellow-400 opacity-50" />;
        } else {
          return <FaStar key={i} className="text-gray-300" />;
        }
      })}
      {isNumber ? (
        <span className="ml-2 text-sm text-gray-700">{rating.toFixed(1)}</span>
      ) : (
        <span className="ml-2 text-sm text-gray-400">No rating</span>
      )}
    </div>
  );
};

export default StarRating;
