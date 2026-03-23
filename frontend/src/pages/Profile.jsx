import React, { useState } from "react";
import {
  Phone,
  Mail,
  Package,
  Star,
  Heart,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserCredentials,
  userLogout,
} from "../redux/features/auth/authSlice";
import {
  useLogoutMutation,
  useUpdateProfileMutation,
} from "../redux/api/users";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Profile() {
  const { userInfo } = useSelector((state) => state.userAuth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [Logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fname: userInfo?.fname || "",
    email: userInfo?.email || "",
    contact: userInfo?.contact || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const HandleLogout = async () => {
    await Logout();
    dispatch(userLogout());
  };

  const handleSave = async () => {
    // 👉 Yaha backend API call laga sakte ho
    console.log("Updated Data:", formData);

    const response = await updateProfile({
      fname: formData?.fname,
      email: formData?.email,
      contact: formData?.contact,
    }).unwrap();
    toast.success("Profile Updated Successfully");
    dispatch(setUserCredentials(response));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fname: userInfo?.fname,
      email: userInfo?.email,
      contact: userInfo?.contact,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-[90dvh] bg-gradient-to-br flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-28 bg-gradient-to-r from-orange-500 to-orange-400"></div>

        {/* Avatar */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <img
            src={`https://ui-avatars.com/api/?name=${formData.fname}&background=f97316&color=fff`}
            alt="User"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="px-6 pt-16 pb-8 text-center mt-2">
          {isEditing ? (
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              className="text-2xl font-bold mb-6 text-center border-b-2 border-orange-400 focus:outline-none"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {formData.fname}
            </h1>
          )}

          <div className="space-y-4 text-left">
            {/* Email */}
            <ProfileField
              icon={<Mail size={18} />}
              label="Email Address"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
            />

            {/* Contact */}
            <ProfileField
              icon={<Phone size={18} />}
              label="Contact Number"
              name="contact"
              value={formData.contact}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow"
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded-2xl shadow"
              >
                Cancel
              </button>
            </div>
          )}
          {/* Account Links */}
          <div className="mt-10 text-left">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">
              Account
            </h3>

            <div className="space-y-3">
              <AccountLink
                to="/orders"
                icon={<Package size={18} />}
                label="My Orders"
              />

              <AccountLink
                to="/reviews"
                icon={<Star size={18} />}
                label="My Reviews"
              />

              {/* <AccountLink
                to="/wishlist"
                icon={<Heart size={18} />}
                label="Wishlist"
              /> */}

              <button
                onClick={HandleLogout}
                className="flex w-full items-center justify-between p-4 bg-gray-100 rounded-2xl hover:bg-orange-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 text-orange-500 p-2 rounded-lg">
                    <LogOut size={18} />
                  </div>
                  <span className="font-semibold text-gray-700">Logout</span>
                </div>
                <ChevronRight
                  size={18}
                  className="text-gray-400 group-hover:text-orange-500 transition"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProfileField = ({ icon, label, name, value, isEditing, onChange }) => (
  <div className="flex items-center space-x-4 p-3 bg-gray-100 rounded-2xl">
    <div className="bg-orange-100 p-2 rounded-lg text-orange-500">{icon}</div>
    <div className="flex-1">
      <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
        {label}
      </p>

      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-b border-orange-400 focus:outline-none text-sm font-semibold"
        />
      ) : (
        <p className="text-gray-800 font-semibold text-sm">{value}</p>
      )}
    </div>
  </div>
);

const AccountLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl hover:bg-orange-100 transition group"
  >
    <div className="flex items-center gap-3">
      <div className="bg-orange-100 text-orange-500 p-2 rounded-lg">{icon}</div>
      <span className="font-semibold text-gray-700">{label}</span>
    </div>

    <ChevronRight
      size={18}
      className="text-gray-400 group-hover:text-orange-500 transition"
    />
  </Link>
);

export default Profile;
