import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Edit, Trash2, Power, Package } from "lucide-react";
import { useGetSpecificProductQuery } from "../redux/api/products";
import { toast } from "react-toastify";
import { useDeleteProductMutation, useToggleProductStatusMutation } from "../redux/api/admin";

function AdminProductDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, error, refetch } = useGetSpecificProductQuery(id);
  const [DeleteProducte, { isLoading: delete_isLoading }] =
    useDeleteProductMutation();
  const [ToggleProduct, { isLoading: ToggleProduct_isLoading }] =
    useToggleProductStatusMutation();

  const [selectedImage, setSelectedImage] = useState(0);

  const product = data?.product;

  // ✅ Average Rating (always top level hook)
  const averageRating = useMemo(() => {
    if (!product?.reviews?.length) return 0;
    const total = product.reviews.reduce((acc, item) => acc + item.rating, 0);
    return (total / product.reviews.length).toFixed(1);
  }, [product]);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error)
    return <div className="p-8 text-red-500">Something went wrong</div>;

  const descriptionPoints =
    typeof product?.description === "object"
      ? Object.entries(product.description)
      : [];

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await DeleteProducte(id);
      refetch();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleProducte = async () => {
    await ToggleProduct(id);
    refetch();
  };

  return (
    <div className="overflow-y-auto">
      <div className="w-full px-6 py-8 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LEFT IMAGE SECTION */}
            <div className="lg:w-1/2 flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {product?.images?.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-20 border-2 cursor-pointer rounded overflow-hidden ${selectedImage === idx
                        ? "border-blue-600"
                        : "border-gray-200"
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

              {/* Main Image */}
              <div className="flex-1 border rounded bg-gray-100 flex items-center justify-center">
                <img
                  src={product?.images?.[selectedImage]}
                  alt={product?.name}
                  className="max-h-[400px] object-contain"
                />
              </div>
            </div>

            {/* RIGHT DETAILS SECTION */}
            <div className="lg:w-1/2 flex flex-col">
              <h2 className="text-gray-500 font-bold uppercase text-sm">
                {product?.brand}
              </h2>

              <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                {product?.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-green-700 text-white px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                  {averageRating} <Star size={14} fill="white" />
                </span>
                <span className="text-gray-500 text-sm">
                  {product?.numReviews} Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product?.price}
                </span>
                <span className="text-gray-400 line-through">
                  ₹{product?.mrp_price}
                </span>
                <span className="text-green-600 font-bold">
                  {product?.discount_rate}% off
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Tax: {product?.tax}% | SKU: {product?.sku}
              </p>

              {/* Status & Stock */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Package size={18} />
                  <span className="font-semibold">Stock: {product?.stock}</span>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold ${product?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {product?.isActive === null
                      ? "Null"
                      : product?.isActive
                        ? "ACTIVE"
                        : "INACTIVE"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-2">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {descriptionPoints.map(([key, value]) => (
                    <div key={key} className="text-sm text-gray-700">
                      <span className="font-semibold capitalize">{key}:</span>{" "}
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              {/* ADMIN ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-auto">
                <Link
                  to={`/admin/products/edit/${product?._id}`}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded font-semibold"
                >
                  <Edit size={18} /> Edit
                </Link>

                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded font-semibold"
                >
                  <Trash2 size={18} />{" "}
                  {delete_isLoading ? "Loading..." : "Delete"}
                </button>

                <button
                  onClick={handleToggleProducte}
                  className={`flex items-center gap-2 px-5 py-3 rounded font-semibold ${product?.isActive
                      ? "bg-gray-700 hover:bg-gray-800 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                >
                  <Power size={18} />
                  {ToggleProduct_isLoading
                    ? "Loading..."
                    : product?.isActive
                      ? "Deactivate"
                      : "Activate"}
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold mb-4">
              Customer Reviews ({product?.reviews?.length})
            </h3>

            {product?.reviews?.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {product?.reviews?.map((rev, index) => (
                  <div key={index} className="border rounded p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-700 text-white px-2 py-1 text-xs rounded">
                        {rev.rating} ★
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProductDetailsPage;
