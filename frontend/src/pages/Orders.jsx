import { useNavigate } from "react-router-dom";
import { useGetAllOrdersQuery } from "../redux/api/products";

function Orders() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllOrdersQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold">Loading Orders...</h2>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold">No Orders Found</h2>
        <p className="text-gray-500">You have not placed any orders yet</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            onClick={() => navigate(`/order/${order._id}`)}
            className="bg-white border rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-lg transition"
          >
            {/* Header */}

            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <div>
                <p className="font-semibold text-lg">
                  Order #{order.order_number}
                </p>

                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">₹{order.grand_total}</p>

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    order.order_status === "placed"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.order_status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* Items */}

            <div className="flex gap-4 overflow-x-auto pb-2">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 min-w-[200px]"
                >
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded border"
                  />

                  <div>
                    <p className="text-sm font-medium line-clamp-2">
                      {item.product_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <p>
                {order.items.length} item
                {order.items.length > 1 ? "s" : ""}
              </p>

              <p>Payment: {order.payment_method}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
