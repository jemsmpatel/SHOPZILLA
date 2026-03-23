import React, { useEffect } from "react";
import {
  useGetUserCartQuery,
  useRemoveProductToCartMutation,
  useUpdateCartMutation,
} from "../redux/api/users";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { data, isLoading, refetch } = useGetUserCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const [removeItem] = useRemoveProductToCartMutation();
  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <h1 className="text-center mt-10 text-xl">Loading Cart...</h1>;
  }

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    await updateCart({
      id: productId,
      data: {
        qty: qty,
      },
    });
    refetch();
  };

  const handleRemove = async (id) => {
    await removeItem(id);
    refetch();
  };

  const cart = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        My Cart ({cart?.cartItems?.length})
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* CART ITEMS */}
        <div className="md:col-span-2 space-y-4">
          {cart?.cartItems?.map((item) => (
            <div
              key={item.product}
              className="flex gap-4 border p-4 rounded-lg bg-white shadow-sm"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xl font-bold">₹{item.price}</span>

                  <span className="line-through text-gray-400">
                    ₹{item.mrp_price}
                  </span>

                  <span className="text-green-600 text-sm font-semibold">
                    {item.discount_rate}% OFF
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">Tax: {item.tax}%</p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.product, item.qty - 1)}
                    disabled={item.qty === 1}
                    className="border px-3 py-1"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.qty}</span>

                  <button
                    onClick={() => updateQty(item.product, item.qty + 1)}
                    className="border px-3 py-1"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleRemove(item.product)}
                    className="ml-4 text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PRICE SUMMARY */}
        <div className="border p-5 rounded-lg h-fit bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Price Details</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Price</span>
              <span>₹{cart?.totalPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Total Tax</span>
              <span>₹{cart?.totalTax}</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total</span>
              <span>₹{cart?.grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded font-semibold hover:bg-orange-600"
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
