import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const ProductCard = ({ id, image, name, price, oldPrice, rating = 4.5 }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div
      onClick={handleProductClick}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer group relative flex flex-col justify-between"
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute left-3 top-3 bg-green-600 text-white text-xs px-2 py-1 rounded">
          {discount}% OFF
        </span>
      )}

      {/* Image */}
      <div className="h-60 w-full flex justify-center items-center overflow-hidden mb-4 bg-gray-50 rounded-lg">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2">
        {name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center text-xs bg-green-600 text-white px-2 py-0.5 rounded">
          {rating} <Star size={12} fill="white" className="ml-1" />
        </span>

        <span className="text-xs text-gray-500">(120)</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-black">₹{price}</span>

        {oldPrice && (
          <span className="text-sm text-gray-400 line-through">
            ₹{oldPrice}
          </span>
        )}
      </div>

      {/* Button */}
      <button className="w-full mt-4 bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition active:scale-95">
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
