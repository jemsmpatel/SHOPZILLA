import React, { useState } from "react";
import { ShoppingCart, Zap, Star, Plus, Minus } from "lucide-react";
import ReviewsSection from "../components/Review";
import { useGetSpecificProductQuery } from "../redux/api/products";
import { useNavigate, useParams } from "react-router-dom";
import { useAddToCartMutation } from "../redux/api/users";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading } = useGetSpecificProductQuery(id);
  const [addToCart, { isLoading: cartLoading }] = useAddToCartMutation();
  const navigate = useNavigate();
  const product = data?.product;

  const handleQuantity = (type) => {
    if (type === "plus") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  if (isLoading) {
    return <h1 className="text-center mt-10 text-xl">Loading Product...</h1>;
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({
        productId: product._id,
        qty: quantity,
      }).unwrap();

      toast.success("Product added to cart");
    } catch (error) {
      console.error(error);
      if (error.data.message === "Not authorized, no token") {
        toast.error("Login First, Not Authorized Propper");
        navigate("/signin");
      } else {
        toast.error("Failed to add product");
      }
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };
  return (
    <div className="w-full px-2 md:px-6 py-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* IMAGE GALLERY */}
        <div className="md:w-[45%] lg:w-[40%] flex gap-4 h-fit md:sticky md:top-4">
          <div className="flex flex-col gap-2">
            {product?.images?.map((img, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setSelectedImage(idx)}
                className={`w-16 h-20 border-2 cursor-pointer overflow-hidden ${
                  selectedImage === idx
                    ? "border-blue-600"
                    : "border-gray-200 hover:border-blue-400"
                }`}
              >
                <img
                  src={img}
                  alt="thumb"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex-1 border border-gray-200 bg-gray-50">
            <img
              src={product?.images[selectedImage]}
              alt="main"
              className="w-full h-[400px] object-contain hover:scale-110 transition"
            />
          </div>
        </div>

        {/* PRODUCT DETAILS */}
        <div className="md:w-[55%] lg:w-[60%] flex flex-col px-2 md:px-4">
          <h2 className="text-gray-500 font-bold text-xl uppercase">
            {product?.brand}
          </h2>

          <h1 className="text-2xl text-gray-800 mb-2 font-medium">
            {product?.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="bg-green-700 text-white text-sm px-2 py-0.5 rounded font-bold flex items-center gap-1">
              4.5 <Star size={14} fill="white" />
            </span>

            <span className="text-gray-500 text-sm font-semibold border-l pl-3 border-gray-300">
              {product?.numReviews} Reviews
            </span>
          </div>

          {/* PRICE */}
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-4xl font-bold text-gray-900">
              ₹{product?.price}
            </span>

            <span className="text-gray-400 line-through text-lg">
              ₹{product?.mrp_price}
            </span>

            <span className="text-green-600 font-bold text-lg">
              {product?.discount_rate}% OFF
            </span>
          </div>

          <p className="text-sm font-semibold text-green-700 mb-6">
            Inclusive of all taxes
          </p>

          {/* QUANTITY */}
          <div className="mb-8 flex items-center gap-6">
            <span className="font-bold text-gray-700 uppercase text-sm">
              Quantity
            </span>

            <div className="flex items-center border rounded-md">
              <button
                onClick={() => handleQuantity("minus")}
                className="p-2 border-r"
              >
                <Minus size={18} />
              </button>

              <span className="px-6 font-bold">{quantity}</span>

              <button
                onClick={() => handleQuantity("plus")}
                className="p-2 border-l"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-3 mb-6">
            {product?.description &&
              Object.entries(product.description)
                .slice(0, showAll ? Object.keys(product.description).length : 4)
                .map(([key, value]) => (
                  <p key={key}>
                    <b className="capitalize">{key} :</b> {value}
                  </p>
                ))}

            {product?.description &&
              Object.keys(product.description).length > 4 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-blue-600 font-semibold text-sm"
                >
                  {showAll ? "Read Less" : "Read More"}
                </button>
              )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading}
              className="flex-1 bg-[#ff9f00] text-white py-4 font-bold flex justify-center items-center gap-2"
            >
              <ShoppingCart size={22} />
              {cartLoading ? "ADDING..." : "ADD TO CART"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={cartLoading}
              className="flex-1 bg-[#fb641b] text-white py-4 font-bold flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {cartLoading ? (
                <>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={22} />
                  BUY NOW
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-12 border-t pt-8">
        <ReviewsSection reviews={product?.reviews} />
      </div>
    </div>
  );
};

export default ProductDetails;
