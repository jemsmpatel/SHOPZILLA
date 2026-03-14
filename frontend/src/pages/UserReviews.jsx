import React, { useState } from "react";
import {
  useGetUserReviewsQuery,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
} from "../redux/api/products";
import { toast } from "react-toastify";

function UserReviews() {
  const { data, isLoading, refetch } = useGetUserReviewsQuery();

  const [updateReview] = useUpdateProductReviewMutation();
  const [deleteReview] = useDeleteProductReviewMutation();

  const [editId, setEditId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) return <p className="p-10">Loading...</p>;

  const reviews = data?.reviews || [];

  const startEdit = (review) => {
    setEditId(review.review_id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleUpdate = async (productId) => {
    try {
      await updateReview({
        id: productId,
        rating,
        comment,
      }).unwrap();

      toast.success("Review updated");

      setEditId(null);
      refetch();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReview(productId).unwrap();

      toast.success("Review deleted");

      refetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      {reviews.length === 0 && <p>No reviews found</p>}

      {reviews.map((review) => (
        <div
          key={review.review_id}
          className="border p-4 rounded mb-4 flex gap-4"
        >
          <img
            src={review.product_image}
            alt={review.review_id}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1">
            <h2 className="font-semibold">{review.product_name}</h2>

            {editId === review.review_id ? (
              <>
                <div className="mt-2">
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="border p-1"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Star
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  className="border w-full mt-2 p-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleUpdate(review.product_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditId(null)}
                    className="bg-gray-400 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-yellow-500 mt-1">
                  {"⭐".repeat(review.rating)}
                </p>

                <p className="mt-1">{review.comment}</p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => startEdit(review)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(review.product_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserReviews;
