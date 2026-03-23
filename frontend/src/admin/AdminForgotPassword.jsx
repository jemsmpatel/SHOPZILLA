import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminForgotPasswordMutation } from "../redux/api/admin";

function AdminForgotPassword() {
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading }] = useAdminForgotPasswordMutation();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl w-[85%] max-w-md p-8 border">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
            <ShoppingBag size={24} />
          </div>

          <h2 className="mt-4 text-2xl font-bold">Admin Forgot Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded-xl">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Back to{" "}
          <Link to="/admin/signin" className="text-orange-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminForgotPassword;
