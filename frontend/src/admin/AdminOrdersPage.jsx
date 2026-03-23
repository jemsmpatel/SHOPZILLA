import React, { useState } from "react";
import {
  useAdmingetPlacedOrdersQuery,
  useAdminconfirmOrderItemMutation,
  useAdminshipOrderItemMutation,
  useAdminmarkItemDeliveredMutation,
  useAdmingetShippedOrdersQuery,
  useAdmingetOrderHistoryQuery,
  useAdmingetPendingOrdersQuery,
} from "../redux/api/admin";
import { toast } from "react-toastify";

function AdminOrdersPage() {
  const [tab, setTab] = useState("placed");

  // Queries
  const {
    data: placedData,
    isLoading: placedLoading,
    refetch: refetchPlaced,
  } = useAdmingetPlacedOrdersQuery();
  const { data: pendingData, refetch: refetchPending } =
    useAdmingetPendingOrdersQuery();
  const { data: shippedData, refetch: refetchShipped } =
    useAdmingetShippedOrdersQuery();
  const { data: historyData } = useAdmingetOrderHistoryQuery();

  // Mutations
  const [confirmOrderItem] = useAdminconfirmOrderItemMutation();
  const [shipOrderItem] = useAdminshipOrderItemMutation();
  const [markDelivered] = useAdminmarkItemDeliveredMutation();

  // Handlers
  const handleConfirm = async (id) => {
    try {
      await confirmOrderItem(id).unwrap();
      toast.success("Order Confirmed");
      refetchPlaced();
      refetchPending();
    } catch (err) {
      toast.error("Error confirming order");
    }
  };

  const handleShip = async (id) => {
    try {
      await shipOrderItem(id).unwrap();
      toast.success("Order Shipped");
      refetchPending();
      refetchShipped();
    } catch (err) {
      toast.error("Error shipping order");
    }
  };

  const handleDeliver = async (id) => {
    try {
      await markDelivered(id).unwrap();
      toast.success("Order Delivered");
      refetchShipped();
    } catch (err) {
      toast.error("Error delivering order");
    }
  };

  const orders =
    tab === "placed"
      ? placedData?.orders
      : tab === "pending"
        ? pendingData?.orders
        : tab === "shipped"
          ? shippedData?.orders
          : historyData?.orders;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["placed", "pending", "shipped", "history"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded ${tab === t ? "bg-orange-500 text-white" : "bg-gray-200"}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order No</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Status</th>
              {(tab === "placed" || tab === "pending" || tab === "shipped") && (
                <th className="p-3">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {orders?.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">{item.order?.order_number}</td>
                <td className="p-3">{item.order?.name}</td>
                <td className="p-3">{item.product_name}</td>
                <td className="p-3">₹{item.price}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      item.item_status === "pending"
                        ? "bg-yellow-500"
                        : item.item_status === "confirmed"
                          ? "bg-blue-500"
                          : item.item_status === "shipped"
                            ? "bg-purple-500"
                            : "bg-green-500"
                    }`}
                  >
                    {item.item_status}
                  </span>
                </td>

                {/* Action Buttons */}
                {tab === "placed" && (
                  <td className="p-3">
                    <button
                      onClick={() => handleConfirm(item._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Confirm
                    </button>
                  </td>
                )}
                {tab === "pending" && (
                  <td className="p-3">
                    <button
                      onClick={() => handleShip(item._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Ship
                    </button>
                  </td>
                )}
                {tab === "shipped" && (
                  <td className="p-3">
                    <button
                      onClick={() => handleDeliver(item._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Deliver
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {placedLoading && (
          <div className="p-4 text-center">Loading orders...</div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
