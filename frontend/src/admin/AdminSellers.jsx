import React, { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  useAdmingetAllSellersQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
} from "../redux/api/admin";

function AdminSellers() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useAdmingetAllSellersQuery();

  const [approveSeller] = useApproveSellerMutation();
  const [rejectSeller] = useRejectSellerMutation();

  const sellers = data?.sellers || [];

  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = sellers.filter(
    (s) =>
      s.fname.toLowerCase().includes(search.toLowerCase()) ||
      s.shop_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const pending = filtered.filter((s) => s.status === "PENDING");
  const approved = filtered.filter((s) => s.status === "APPROVED");
  const rejected = filtered.filter((s) => s.status === "REJECTED");

  const handleApprove = async (id) => {
    try {
      await approveSeller(id).unwrap();
      toast.success("Seller Approved");
      refetch();
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async () => {
    if (!reason) {
      toast.error("Reason required");
      return;
    }

    try {
      await rejectSeller({ id: selectedId, reason }).unwrap();
      toast.success("Seller Rejected");

      setSelectedId(null);
      setReason("");

      refetch();
    } catch {
      toast.error("Reject failed");
    }
  };

  const Table = ({ sellers, type }) => (
    <table className="w-full border rounded-lg mb-10">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Seller</th>
          <th className="p-3">Shop</th>
          <th className="p-3">Email</th>
          <th className="p-3">Status</th>

          {type === "rejected" && <th className="p-3">Reason</th>}

          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {sellers.map((seller) => (
          <tr key={seller._id} className="border-t">
            <td className="p-3">{seller.fname}</td>
            <td className="p-3">{seller.shop_name}</td>
            <td className="p-3">{seller.email}</td>
            <td className="p-3">{seller.status}</td>

            {type === "rejected" && (
              <td className="p-3 text-red-600">
                {seller.rejectionReason || "No reason"}
              </td>
            )}

            <td className="p-3 flex gap-2 justify-center">
              <button
                onClick={() => navigate(`/admin/seller/${seller._id}`)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                <Eye size={18} />
              </button>

              {type === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(seller._id)}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    <CheckCircle size={18} />
                  </button>

                  <button
                    onClick={() => setSelectedId(seller._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <XCircle size={18} />
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Seller Management</h1>

      {/* Search */}

      <input
        type="text"
        placeholder="Search seller..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-8 w-full rounded"
      />

      {/* Pending */}

      <h2 className="text-xl font-semibold mb-4">Pending Sellers</h2>
      <Table sellers={pending} type="pending" />

      {/* Approved */}

      <h2 className="text-xl font-semibold mb-4">Approved Sellers</h2>
      <Table sellers={approved} type="approved" />

      {/* Rejected */}

      <h2 className="text-xl font-semibold mb-4">Rejected Sellers</h2>
      <Table sellers={rejected} type="rejected" />

      {/* Reject Modal */}

      {selectedId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-lg font-semibold mb-3">
              Enter Rejection Reason
            </h2>

            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSellers;
