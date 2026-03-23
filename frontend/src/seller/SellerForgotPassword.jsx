import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSellerForgotPasswordMutation } from "../redux/api/seller";

function SellerForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading }] = useSellerForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white shadow-xl rounded-2xl w-[85%] max-w-md p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <ShoppingBag size={24} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Forgot Password
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email to receive reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{" "}
          <Link
            to="/seller/signin"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SellerForgotPassword;
