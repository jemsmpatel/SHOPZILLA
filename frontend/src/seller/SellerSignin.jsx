import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSellerLoginMutation } from "../redux/api/seller";
import { toast } from "react-toastify";
import { setSellerCredentials } from "../redux/features/seller/sellerauthSlice";
import { useDispatch } from "react-redux";

function SellerSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useSellerLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      dispatch(setSellerCredentials(response));
      navigate("/seller/dashboard");
      toast.success("User successfully Login.");
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err?.data?.error ||
        err?.data?.message ||
        "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
      <div className="bg-white shadow-xl rounded-2xl w-[85%] max-w-md p-8 border border-gray-100">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md">
            <ShoppingBag size={24} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Seller Sign In
          </h2>
          <p className="text-gray-500 text-sm">Login to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-600">
                Password
              </label>
            </div>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
            <div className="text-right">
              {/* Forgot Password Link */}
              <Link
                to="/seller/forgot-password"
                className="text-sm text-orange-500 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/seller/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SellerSignin;
