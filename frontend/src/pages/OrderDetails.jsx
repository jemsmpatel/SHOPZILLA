import { Link, useParams } from "react-router-dom";
import {
  useCancelOrderMutation,
  useCreateProductReviewMutation,
  useGetSpecificOrderQuery,
} from "../redux/api/products";
import { toast } from "react-toastify";
import React, { useState } from "react";
import ReviewBox from "../components/ReviewBox";

const OrderDetails = () => {
  const { id } = useParams();

  const { data, isLoading, refetch } = useGetSpecificOrderQuery(id);

  const [cancelOrder, { isLoading: cancelLoading }] = useCancelOrderMutation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [createReview] = useCreateProductReviewMutation();

  const handleCancel = async () => {
    try {
      await cancelOrder(id).unwrap();

      toast.success("Order Cancelled");

      refetch();
    } catch (error) {
      toast.error("Cancel failed");
    }
  };

  const handleReview = async (productId) => {
    try {
      await createReview({
        id: productId,
        rating,
        comment,
      }).unwrap();

      toast.success("Review submitted");

      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error?.data?.message || "Review failed");
    }
  };

  if (isLoading) return <p className="p-10">Loading...</p>;

  const order = data?.order;
  const items = data?.items;

  const steps = ["pending", "confirmed", "shipped", "delivered"];

  const getStepIndex = (status) => steps.indexOf(status);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Order Info */}

      <div className="border p-4 mb-6 rounded space-y-1">
        <p>
          <b>Order Number:</b> {order?.order_number}
        </p>
        <p>
          <b>Name:</b> {order?.name}
        </p>
        <p>
          <b>Email:</b> {order?.email}
        </p>
        <p>
          <b>Mobile:</b> {order?.mobile_number}
        </p>
        <p>
          <b>Payment Method:</b> {order?.payment_method}
        </p>
        <p>
          <b>Payment Status:</b> {order?.payment_status}
        </p>
        <p>
          <b>Order Status:</b> {order?.order_status}
        </p>

        <p>
          <b>Address:</b> {order?.address?.address_line1},{" "}
          {order?.address?.address_line2}, {order?.address?.city},{" "}
          {order?.address?.state}, {order?.address?.country} -{" "}
          {order?.address?.pincode}
        </p>

        <p>
          <b>Total:</b> ₹{order?.grand_total}
        </p>
      </div>

      {/* Items */}

      <h2 className="text-xl font-semibold mb-4">Items</h2>

      {items?.map((item) => {
        const currentStep = getStepIndex(item?.item_status);

        return (
          <div key={item?._id} className="border p-4 mb-4 rounded">
            <div className="flex gap-4 mb-4">
              <img
                src={item?.product_image}
                alt={item?._id}
                className="w-24 h-24 object-cover"
              />

              <div>
                <Link
                  to={`/product/${item?.product_id}`}
                  className="font-semibold"
                >
                  {item?.product_name}
                </Link>
                <p>Price: ₹{item?.discount_price}</p>
                <p>Quantity: {item?.quantity}</p>
                <p>Total: ₹{item?.total_price}</p>
              </div>
            </div>

            {/* Tracking */}

            {item?.item_status === "cancelled" ? (
              <p className="text-red-500 font-semibold">Product Cancelled</p>
            ) : (
              <div className="flex items-center mt-6">
                {steps.map((step, index) => (
                  <React.Fragment key={step}>
                    {/* Step Circle */}

                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white
                        ${index <= currentStep ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {index + 1}
                      </div>

                      <p className="text-xs mt-2 capitalize">{step}</p>
                    </div>

                    {/* Line */}

                    {index !== steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2
                        ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <p className="mt-3 text-sm">
              <b>Current Status:</b>{" "}
              <span className="capitalize">{item?.item_status}</span>
            </p>

            <ReviewBox
              item={item}
              handleReview={handleReview}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
            />
          </div>
        );
      })}

      {/* Cancel Button */}

      {order?.order_status === "placed" && (
        <button
          onClick={handleCancel}
          disabled={cancelLoading}
          className="bg-red-500 text-white px-6 py-3 rounded mt-4"
        >
          {cancelLoading ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
};

export default OrderDetails;
