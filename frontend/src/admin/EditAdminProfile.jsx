import React, { useState, useEffect } from "react";
import {
  useAdminProfileQuery,
  useAdminUpdateUserMutation,
} from "../redux/api/admin";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EditAdminProfile() {
  const { data: adminData } = useAdminProfileQuery();
  const [updateProfile, { isLoading }] = useAdminUpdateUserMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  useEffect(() => {
    if (adminData) {
      setFormData({
        name: adminData.name || "",
        email: adminData.email || "",
        contact: adminData.contact || "",
      });
    }
  }, [adminData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile Updated Successfully");
      navigate("/admin/profile");
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  return (
    <div className="sm:p-8 p-4 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Edit Admin Profile</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Contact Number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/profile")}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

export default EditAdminProfile;
