import React from "react";
import {
  ShoppingBag,
  Users,
  BarChart3,
  Store,
  Layers,
  Package,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "../redux/api/admin";

const AdminDashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return <div className="p-8 text-lg">Loading Dashboard...</div>;
  }

  const stats = [
    {
      id: 1,
      name: "Total Revenue",
      value: `₹${data?.stats?.totalRevenue || 0}`,
      icon: BarChart3,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      id: 2,
      name: "Total Orders",
      value: data?.stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: 3,
      name: "Total Users",
      value: data?.stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 4,
      name: "Total Sellers",
      value: data?.stats?.totalSellers || 0,
      icon: Store,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      id: 5,
      name: "Total Products",
      value: data?.stats?.totalProducts || 0,
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      id: 6,
      name: "Total Categories",
      value: data?.stats?.totalCategories || 0,
      icon: Layers,
      color: "text-pink-600",
      bg: "bg-pink-100",
    },
  ];

  return (
    <div className="p-8 overflow-y-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">
            Monitor platform performance and activity
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
                <item.icon size={24} />
              </div>
            </div>

            <p className="text-gray-500 text-sm font-medium">{item.name}</p>

            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-50">
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {data?.recentOrders?.map((order) => (
                <TableRow
                  key={order.id}
                  name={order.customer}
                  product={order.product}
                  amount={`₹${order.amount}`}
                  status={order.status}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ name, product, amount, status }) => {
  const statusColors = {
    delivered: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    processing: "bg-blue-100 text-blue-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition">
      <td className="py-4 font-medium text-gray-800">{name}</td>

      <td className="py-4 text-gray-600">{product}</td>

      <td className="py-4 font-bold">{amount}</td>

      <td className="py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            statusColors[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
};

export default AdminDashboard;
