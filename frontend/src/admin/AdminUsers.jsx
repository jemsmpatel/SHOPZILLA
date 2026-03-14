import React, { useState } from "react";
import { Search, UserCheck, UserX } from "lucide-react";
import { useAdmingetallUsersQuery } from "../redux/api/admin";

function AdminUsers() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useAdmingetallUsersQuery();

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (error)
    return <div className="p-8 text-red-500">Something went wrong</div>;

  const users = Array.isArray(data?.users) ? data.users : [];

  const filteredUsers = users.filter((user) =>
    user.fname?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
          <p className="text-sm text-gray-500">Manage website users</p>
        </div>

        {/* Search */}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                  No Users Found
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {user.fname}
                </td>

                <td className="px-6 py-4 text-gray-600">{user.email}</td>

                <td className="px-6 py-4 text-gray-600">{user.contact}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit
                    ${
                      user.isActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.isActive ? (
                      <>
                        <UserCheck size={14} /> Active
                      </>
                    ) : (
                      <>
                        <UserX size={14} /> Blocked
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
