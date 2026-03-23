import { useGetSpecificProductQuery } from "../redux/api/products";
import { useSelector } from "react-redux";

const ReviewBox = ({
  item,
  handleReview,
  rating,
  setRating,
  comment,
  setComment,
}) => {
  const { userInfo } = useSelector((state) => state.userAuth);

  const { data } = useGetSpecificProductQuery(item.product_id);

  const product = data?.product;

  const alreadyReviewed = product?.reviews?.some(
    (r) => r.user === userInfo?._id,
  );

  if (item.item_status !== "delivered" || alreadyReviewed) return null;

  return (
    <div className="mt-4 border-t pt-4">
      <p className="font-semibold mb-2">Write Review</p>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded mb-2"
      >
        <option value="5">5 ⭐</option>
        <option value="4">4 ⭐</option>
        <option value="3">3 ⭐</option>
        <option value="2">2 ⭐</option>
        <option value="1">1 ⭐</option>
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border w-full p-2 rounded mb-2"
      />

      <button
        onClick={() => handleReview(item.product_id)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewBox;
