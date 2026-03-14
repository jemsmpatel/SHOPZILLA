import React from "react";
import { useAdminProfileQuery } from "../redux/api/admin";
import { Link } from "react-router-dom";

function AdminProfile() {
  const { data: adminData, isLoading, error } = useAdminProfileQuery();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Profile fetch failed</div>;
  }

  return (
    <div className="sm:p-8 p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PROFILE CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
          <img
            src={`https://ui-avatars.com/api/?name=${adminData?.name}&background=f97316&color=fff`}
            alt="Admin"
            className="w-28 h-28 rounded-full mx-auto border-4 border-orange-400"
          />

          <h2 className="text-2xl capitalize font-semibold mt-4">
            {adminData?.name}
          </h2>

          <p className="text-gray-500">{adminData?.email}</p>

          <p
            className={`mt-2 font-bold text-lg ${
              adminData?.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {adminData?.isActive ? "ACTIVE" : "BLOCKED"}
          </p>

          <p className="mt-1 text-sm text-gray-500">Role: {adminData?.role}</p>

          <Link to={"/admin/profile/edit"}>
            <button className="mt-6 w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition">
              Edit Profile
            </button>
          </Link>
        </div>

        {/* RIGHT SIDE INFO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-gray-900">
            <h3 className="text-xl font-semibold mb-4">Admin Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Info label="Full Name" value={adminData?.name} />

              <Info label="Email Address" value={adminData?.email} />

              <Info label="Role" value={adminData?.role} />

              <Info label="Contact" value={adminData?.contact} />

              <Info
                label="Joined On"
                value={
                  adminData?.createdAt
                    ? new Date(adminData.createdAt).toLocaleDateString()
                    : ""
                }
              />
            </div>
          </div>

          {/* BLOCK REASON */}
          {!adminData?.isActive && adminData?.blockedReason && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl">
              <strong>Blocked Reason:</strong> {adminData.blockedReason}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default AdminProfile;
