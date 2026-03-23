import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSellerResetPasswordMutation } from "../redux/api/seller";

function SellerResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [resetPassword, { isLoading }] = useSellerResetPasswordMutation();

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordRegex.test(password);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (value.length < 6) {
      setPasswordStrength("Weak");
    } else if (validatePassword(value)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      toast.error(
        "Password must contain 8 characters, uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({ token, password }).unwrap();

      toast.success("Password reset successfully");

      navigate("/seller/signin");
    } catch (err) {
      toast.error(err?.data?.message || "Reset failed");
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
            Reset Password
          </h2>

          <p className="text-gray-500 text-sm">
            Enter your new secure password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}

          <div>
            <label className="text-sm font-semibold text-gray-600">
              New Password <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter strong password"
                className="w-full mt-2 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-5 text-xs cursor-pointer text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {passwordStrength && (
              <p
                className={`text-sm mt-1 font-semibold ${
                  passwordStrength === "Strong"
                    ? "text-green-600"
                    : passwordStrength === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Confirm Password <span className="text-red-500">*</span>
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full mt-2 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 transition"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellerResetPassword;
