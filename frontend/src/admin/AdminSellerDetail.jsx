import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetSellerByIdQuery,
  useApproveSellerMutation,
  useRejectSellerMutation,
  useToggleSellerStatusMutation,
} from "../redux/api/admin";

function AdminSellerDetail() {
  const { id } = useParams();

  const { data, refetch } = useGetSellerByIdQuery(id);

  const [approveSeller] = useApproveSellerMutation();
  const [rejectSeller] = useRejectSellerMutation();
  const [toggleSeller] = useToggleSellerStatusMutation();
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState("");
  const seller = data?.seller;

  if (!seller) return <div className="p-6">Loading...</div>;

  const approve = async () => {
    await approveSeller(id);
    toast.success("Seller Approved");
    refetch();
  };

  const handleReject = async () => {
    if (!reason) {
      toast.error("Please enter rejection reason");
      return;
    }

    try {
      await rejectSeller({ id: selectedId, reason }).unwrap();

      toast.success("Seller Rejected");
      setSelectedId(null);
      setReason("");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject seller");
    }
  };

  const toggle = async () => {
    await toggleSeller(id);
    toast.success("Status Updated");
    refetch();
  };

  return (
    <div className="p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Seller Details</h1>

      {/* Basic Info */}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <p>
          <b>Name:</b> {seller.fname}
        </p>
        <p>
          <b>Email:</b> {seller.email}
        </p>
        <p>
          <b>Contact:</b> {seller.contact}
        </p>
        <p>
          <b>Gender:</b> {seller.gender}
        </p>
        <p>
          <b>DOB:</b> {seller.dob}
        </p>
        <p>
          <b>Religion:</b> {seller.religion}
        </p>
      </div>

      {/* Shop */}

      <h2 className="text-xl font-semibold mb-3">Shop Info</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <p>
          <b>Shop Name:</b> {seller.shop_name}
        </p>
        <p>
          <b>GST:</b> {seller.gst_no}
        </p>
        <p>
          <b>Address:</b> {seller.shop_address}
        </p>
      </div>

      {/* Bank */}

      <h2 className="text-xl font-semibold mb-3">Bank Info</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <p>
          <b>Account Holder:</b> {seller.bank_account_holder_name}
        </p>
        <p>
          <b>Bank:</b> {seller.bank_name}
        </p>
        <p>
          <b>Account No:</b> {seller.bank_account_no}
        </p>
        <p>
          <b>IFSC:</b> {seller.bank_IFSC_code}
        </p>
      </div>

      {/* Documents */}

      <h2 className="text-xl font-semibold mb-3">Documents</h2>

      <div className="flex gap-6 mb-10">
        <div>
          <p className="font-medium mb-2">PAN Card</p>
          <img
            src={seller.pan_card_copy}
            alt=""
            className="w-60 border rounded"
          />
        </div>

        <div>
          <p className="font-medium mb-2">Aadhar Card</p>
          <img
            src={seller.aadhar_card_copy}
            alt=""
            className="w-60 border rounded"
          />
        </div>

        <div>
          <p className="font-medium mb-2">Bank Passbook</p>
          <img
            src={seller.bank_passbook_copy}
            alt=""
            className="w-60 border rounded"
          />
        </div>
      </div>

      {/* Actions */}

      <div className="flex gap-4">
        {seller.status === "PENDING" && (
          <>
            <button
              onClick={approve}
              className="bg-green-500 text-white px-5 py-2 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => setSelectedId(id)}
              className="bg-red-500 text-white px-5 py-2 rounded"
            >
              Reject
            </button>
          </>
        )}

        {seller.status === "APPROVED" && (
          <button
            onClick={toggle}
            className="bg-blue-500 text-white px-5 py-2 rounded"
          >
            {seller.isActive ? "Deactivate Seller" : "Activate Seller"}
          </button>
        )}
        {seller.status === "REJECTED" && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-8">
            <h3 className="font-semibold text-lg mb-1">Seller Rejected</h3>
            <p>
              <b>Reason:</b> {seller.rejectionReason || "No reason provided"}
            </p>
          </div>
        )}
      </div>
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

export default AdminSellerDetail;
