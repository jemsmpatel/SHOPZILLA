import React, { useState } from "react";
import { Star } from "lucide-react";

const ReviewsSection = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">No Reviews Yet</div>
    );
  }

  const visibleReviews = showAll ? reviews : reviews.slice(0, 3);

  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="max-w-6xl mx-auto bg-white border rounded">
      {/* HEADER */}

      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Ratings & Reviews</h3>

          <div className="flex items-center gap-3 mt-2">
            <span className="bg-green-700 text-white px-2 py-1 rounded flex items-center gap-1">
              {avg.toFixed(1)}
              <Star size={14} fill="white" />
            </span>

            <span className="text-gray-500">{reviews.length} Reviews</span>
          </div>
        </div>
      </div>

      {/* REVIEWS */}

      <div className="divide-y">
        {visibleReviews.map((rev, index) => (
          <div key={index} className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-700 text-white px-2 py-0.5 text-xs rounded flex items-center gap-1">
                {rev.rating}
                <Star size={12} fill="white" />
              </span>

              <span className="text-gray-800 font-semibold">Review</span>
            </div>

            <p className="text-gray-700 text-sm mb-3">{rev.comment}</p>

            <p className="text-xs text-gray-400">
              {new Date(rev.createdAt).toDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTON */}

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-4 text-blue-600 font-bold border-t"
        >
          {showAll ? "SHOW LESS" : `VIEW ALL ${reviews.length} REVIEWS`}
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;
