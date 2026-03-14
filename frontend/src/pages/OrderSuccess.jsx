import React from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <div className="bg-white shadow-lg rounded-lg p-10">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Order Placed Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
