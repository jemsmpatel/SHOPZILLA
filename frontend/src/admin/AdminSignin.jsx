import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "../redux/api/admin";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../redux/features/admin/adminauthSlice";

function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useAdminLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        email,
        password,
      }).unwrap();

      dispatch(setAdminCredentials(response));

      navigate("/admin/dashboard");

      toast.success("Admin successfully logged in.");
    } catch (err) {
      console.error("Login error:", err);

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
            Admin Sign In
          </h2>

          <p className="text-gray-500 text-sm">
            Login to manage the admin panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full mt-2 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full mt-2 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
            <div className="text-right">
              {/* Forgot Password Link */}
              <Link
                to="/admin/forgot-password"
                className="text-sm text-orange-500 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Back to{" "}
          <Link
            to="/"
            className="text-orange-500 font-semibold hover:underline"
          >
            Website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminSignin;
