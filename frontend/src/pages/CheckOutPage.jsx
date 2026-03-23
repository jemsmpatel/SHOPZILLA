import React, { useState } from "react";
import {
  useGetUserCartQuery,
  useRemoveProductToCartMutation,
} from "../redux/api/users";
import {
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
} from "../redux/api/products";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CheckOutPage() {
  const { data, isLoading, refetch } = useGetUserCartQuery();
  const [removeItem] = useRemoveProductToCartMutation();

  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();

  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  const cartItems = data?.cartItems || [];
  const cart = data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    payment_method: "",
    address: {
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
  });

  // normal fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // address fields
  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  // FORM VALIDATION
  const validateForm = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    if (!formData.payment_method) {
      toast.error("Please select payment method");
      return false;
    }

    if (
      !formData.name ||
      !formData.mobile_number ||
      !formData.address.address_line1 ||
      !formData.address.city ||
      !formData.address.state ||
      !formData.address.country ||
      !formData.address.pincode
    ) {
      toast.error("Please fill all required fields");
      return false;
    }

    return true;
  };

  // COD ORDER
  const placeOrder = async () => {
    if (!validateForm()) return;

    try {
      await createOrder(formData).unwrap();

      toast.success("Order placed successfully");

      navigate("/order-success");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.data?.message || "Something went wrong while placing order",
      );
    }
  };

  // ONLINE PAYMENT
  const handleOnlinePayment = async () => {
    if (!validateForm()) return;

    try {
      setPaymentLoading(true);

      const data = await createRazorpayOrder({
        amount: cart.grandTotal,
      }).unwrap();

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Shoop Mart",
        description: "Order Payment",
        order_id: data.order.id,

        handler: async function (response) {
          await createOrder({
            ...formData,
            payment_method: "ONLINE",
            razorpay_payment_id: response.razorpay_payment_id,
          }).unwrap();

          toast.success("Payment Successful");
          navigate("/order-success");
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile_number,
        },

        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();

      rzp.on("payment.failed", function () {
        toast.error("Payment Failed");
      });
    } catch (error) {
      toast.error("Payment initialization failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCheckout = () => {
    if (formData.payment_method === "ONLINE") {
      handleOnlinePayment();
    } else {
      placeOrder();
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeItem(id);

      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading cart...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 overflow-y-auto">
      {/* LEFT FORM */}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="mobile_number"
          placeholder="Mobile Number"
          onChange={handleChange}
          maxLength={10}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="address_line1"
          placeholder="Address Line 1"
          onChange={handleAddressChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="address_line2"
          placeholder="Address Line 2"
          onChange={handleAddressChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleAddressChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleAddressChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleAddressChange}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleAddressChange}
          className="w-full border p-3 rounded mb-4"
        />

        <select
          name="payment_method"
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="">Select Payment Method</option>
          <option value="COD">Cash On Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>

        <button
          onClick={handleCheckout}
          disabled={orderLoading || paymentLoading}
          className={`w-full py-3 rounded font-semibold text-white 
            ${
              orderLoading || paymentLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
        >
          {orderLoading || paymentLoading ? "Processing..." : "Place Order"}
        </button>
      </div>

      {/* RIGHT SUMMARY */}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        {cartItems.map((item) => (
          <div
            key={item.product}
            className="flex items-center gap-4 border-b py-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>

              <p className="text-gray-500">
                ₹{item.price} × {item.qty}
              </p>
            </div>

            <p className="font-semibold">₹{item.price * item.qty}</p>

            <button
              onClick={() => handleRemove(item.product)}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="mt-6 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{cart?.totalPrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{cart?.totalTax?.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Grand Total</span>
            <span>₹{cart?.grandTotal?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutPage;

// Step 3

// Ye test UPI ID use karo:

// success@razorpay

// Ya

// failure@razorpay

// Result:

// UPI ID	Result
// success@razorpay	Payment Success
// failure@razorpay	Payment Failed
