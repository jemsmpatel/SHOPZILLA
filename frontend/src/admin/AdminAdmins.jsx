import React, { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useToggleAdminStatusMutation,
  useDeleteAdminMutation,
} from "../redux/api/admin";

function AdminAdmins() {
  const { data, isLoading, refetch } = useGetAdminsQuery();

  const [createAdmin] = useCreateAdminMutation();
  const [toggleAdmin] = useToggleAdminStatusMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  const admins = data || [];

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    role: "STAFF",
  });

  const filtered = admins.filter((a) =>
    a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async () => {
    try {
      await createAdmin(form).unwrap();
      toast.success("Admin created");

      setShowModal(false);

      setForm({
        name: "",
        email: "",
        contact: "",
        password: "",
        role: "STAFF",
      });

      refetch();
    } catch {
      toast.error("Create failed");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await toggleAdmin(id).unwrap();
      toast.success("Status updated");
      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const removeAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    try {
      await deleteAdmin(id).unwrap();
      toast.success("Admin deleted");
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 overflow-y-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admins</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search admin by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-6 w-full rounded"
      />

      {/* Table */}

      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Role</th>
            <th className="p-3">Active</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((admin) => (
            <tr key={admin._id} className="border-t">
              <td className="p-3">{admin.name}</td>
              <td className="p-3">{admin.email}</td>
              <td className="p-3">{admin.contact}</td>
              <td className="p-3">{admin.role}</td>

              <td className="p-3">{admin.isActive ? "Active" : "Inactive"}</td>

              <td className="p-3 flex justify-center gap-3">
                <button
                  onClick={() => toggleStatus(admin._id)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  {admin.isActive ? (
                    <ToggleRight size={18} />
                  ) : (
                    <ToggleLeft size={18} />
                  )}
                </button>

                <button
                  onClick={() => removeAdmin(admin._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Admin Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[420px]">
            <h2 className="text-xl font-semibold mb-4">Create Admin</h2>

            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="border p-2 w-full mb-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="text"
              placeholder="Contact"
              className="border p-2 w-full mb-3"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-3"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <select
              className="border p-2 w-full mb-4"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAdmins;
