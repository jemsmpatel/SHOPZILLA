import React from "react";
import { ShoppingBag, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetSellerDashboardQuery } from "../redux/api/seller";

const SellerDashboard = () => {
  const { data, isLoading } = useGetSellerDashboardQuery();

  if (isLoading) return <p className="p-10">Loading...</p>;

  const stats = data?.stats || {};
  const orders = data?.recentOrders || [];

  const statsData = [
    {
      name: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      name: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      name: "Total Products",
      value: stats.totalProducts,
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="p-8 overflow-y-auto">
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-500">Manage products, orders & earnings</p>
        </div>

        <Link to="/seller/products/add">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-xl">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow border">
            <div
              className={`${item.bg} ${item.color} p-3 w-fit rounded-lg mb-4`}
            >
              <item.icon size={24} />
            </div>

            <p className="text-gray-500">{item.name}</p>

            <h3 className="text-2xl font-bold">{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Recent Orders */}

      <div className="bg-white rounded-xl shadow border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusColor = {
                    delivered: "bg-green-100 text-green-600",
                    shipped: "bg-blue-100 text-blue-600",
                    pending: "bg-yellow-100 text-yellow-600",
                    cancelled: "bg-red-100 text-red-600",
                  };

                  return (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4 font-medium text-gray-700">
                        {order.customer}
                      </td>

                      <td className="py-4 px-4 text-gray-600">
                        {order.product}
                      </td>

                      <td className="py-4 px-4 font-semibold text-gray-800">
                        ₹{order.amount}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
