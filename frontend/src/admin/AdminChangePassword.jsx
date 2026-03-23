import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { useAdminChangePasswordMutation } from "../redux/api/admin";

function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [changePassword, { isLoading }] = useAdminChangePasswordMutation();

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

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
      await changePassword({
        oldPassword,
        newPassword: password,
      }).unwrap();

      toast.success("Password updated successfully");

      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl w-[90%] max-w-md p-8 border">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
            <ShoppingBag size={24} />
          </div>

          <h2 className="mt-4 text-2xl font-bold">Admin Settings</h2>

          <p className="text-gray-500 text-sm">Change your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            placeholder="Old Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="w-full bg-orange-500 text-white py-3 rounded-xl">
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminChangePassword;
