import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import SellerOrder from "../models/SellerOrder.js";
import Product from "../models/Product.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import Cart from "../models/Cart.js";
import razorpay from "../config/razorpay.js";


// Brevo config
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const createPaymentOrder = async (req, res) => {
  try {

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {

    console.error("Razorpay Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const placeOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile_number,
      address,
      payment_method
    } = req.body;

    const user_id = req.user._id;

    const cart = await Cart.findOne({ user: user_id });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    let totalAmount = 0;
    const sellerTotals = {};

    const order = await Order.create({
      order_number: "ORD-" + Date.now(),
      user_id,
      name,
      email,
      mobile_number,
      address,
      payment_method,
      total_amount: 0,
      grand_total: 0,
    });

    for (const item of cart.cartItems) {

      const product = await Product.findById(item.product);

      if (!product) {
        continue;
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`
        });
      }

      const itemTotal = product.price * item.qty;

      const discountPrice =
        (product.mrp_price - product.price) * item.qty;

      const commission = itemTotal * 0.1;

      const sellerEarning = itemTotal - commission;

      totalAmount += itemTotal;

      sellerTotals[product.seller_id] =
        (sellerTotals[product.seller_id] || 0) + itemTotal;

      await OrderItem.create({
        order_id: order._id,
        seller_id: product.seller_id,
        product_id: product._id,
        product_name: product.name,
        product_image: product.images?.[0] || "",
        discount_price: discountPrice,
        price: product.price,
        quantity: item.qty,
        total_price: itemTotal,
        commission,
        seller_earning: sellerEarning,
      });

      product.stock -= item.qty;
      await product.save();
    }

    for (const sellerId in sellerTotals) {
      await SellerOrder.create({
        order_id: order._id,
        seller_id: sellerId,
        seller_total: sellerTotals[sellerId],
      });
    }

    order.total_amount = totalAmount;
    order.grand_total = totalAmount;

    await order.save();

    cart.cartItems = [];
    await cart.save();

    // EMAIL SEND (SAFE BLOCK)

    try {

      const sendSmtpEmail = {
        to: [{ email }],
        sender: {
          email: process.env.MAIL_USERNAME,
          name: "Shoop Mart"
        },
        subject: "Order Placed Successfully",
        htmlContent: `
          <h2>Thank you for your order</h2>
          <p>Hello ${name},</p>
          <p>Your order has been placed successfully.</p>
          <p><strong>Order ID:</strong> ${order.order_number}</p>
          <p>We will notify you once the order is shipped.</p>
          <br/>
          <p>Thank you for shopping with Shoop Mart.</p>
        `
      };

      await emailApi.sendTransacEmail(sendSmtpEmail);

    } catch (mailError) {

      console.error("Email sending failed:", mailError.message);

      // retry once
      try {
        await emailApi.sendTransacEmail(sendSmtpEmail);
      } catch (retryError) {
        console.error("Email retry failed:", retryError.message);
      }

    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order_id: order._id
    });

  } catch (error) {

    console.error("Place Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const cancelOrder = async (req, res) => {
  try {

    const { order_id } = req.params;

    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.order_status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled"
      });
    }

    order.order_status = "cancelled";
    await order.save();

    const items = await OrderItem.find({ order_id });

    for (const item of items) {

      item.item_status = "cancelled";
      await item.save();

      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { stock: item.quantity } }
      );
    }

    // EMAIL SAFE BLOCK

    try {

      const sendSmtpEmail = {
        to: [{ email: order.email }],
        sender: {
          email: process.env.MAIL_USERNAME,
          name: "Shoop Mart"
        },
        subject: "Order Cancelled",
        htmlContent: `
          <h2>Your Order Has Been Cancelled</h2>
          <p>Hello ${order.name},</p>
          <p>Your order has been cancelled successfully.</p>
          <p><strong>Order ID:</strong> ${order.order_number}</p>
          <br/>
          <p>If payment was made online, refund will be processed soon.</p>
        `
      };

      await emailApi.sendTransacEmail(sendSmtpEmail);

    } catch (mailError) {

      console.error("Cancel email failed:", mailError.message);

      try {
        await emailApi.sendTransacEmail(sendSmtpEmail);
      } catch (retryError) {
        console.error("Retry cancel email failed:", retryError.message);
      }

    }

    return res.json({
      success: true,
      message: "Order cancelled successfully"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const items = await OrderItem.find({ order_id });

    return res.json({
      success: true,
      order,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {

    const user_id = req.user._id.toString();

    const orders = await Order.aggregate([
      { $match: { user_id } },
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "order_id",
          as: "items"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json({
      success: true,
      total_orders: orders.length,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  createPaymentOrder,
  placeOrder,
  cancelOrder,
  getOrderById,
  getUserOrders,
};