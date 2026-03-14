import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createsellerToken from '../utils/createsellerToken.js';
import Seller from "../models/Seller.js";
import OrderItem from "../models/OrderItem.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Brevo config (DO THIS ONCE)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const createUser = asyncHandler(async (req, res) => {
  const { fname, email, aadhar, contact, password, father_name, gender, dob, religion, home_address, home_country, home_state, home_city, pan_no, shop_name, shop_address, shop_country, shop_state, shop_city, gst_no, bank_account_holder_name, bank_name, bank_account_no, bank_IFSC_code, pan_card_copy, aadhar_card_copy, bank_passbook_copy } = req.body;

  if (!fname || !email || !aadhar || !contact || !password || !father_name || !gender || !dob || !religion || !home_address || !home_country || !home_state || !home_city || !pan_no || !shop_name || !shop_address || !shop_country || !shop_state || !shop_city || !gst_no || !bank_account_holder_name || !bank_name || !bank_account_no || !bank_IFSC_code || !pan_card_copy || !aadhar_card_copy || !bank_passbook_copy) {
    throw new Error("Please fill all the fields");
  }

  const userExists = await Seller.findOne({ email });
  if (userExists) return res.status(400).send("User Email is already exists");

  // Hash the user password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new Seller({ fname, email, aadhar, contact, password: hashedPassword, father_name, gender, dob, religion, home_address, home_country, home_state, home_city, pan_no, shop_name, shop_address, shop_country, shop_state, shop_city, gst_no, bank_account_holder_name, bank_name, bank_account_no, bank_IFSC_code, pan_card_copy, aadhar_card_copy, bank_passbook_copy });

  try {
    await newUser.save();
    createsellerToken(res, newUser._id);
    res.status(201).json({
      _id: newUser._id,
      fname: newUser.fname,
      email: newUser.email,
      aadhar: newUser.aadhar,
      contact: newUser.contact,
      father_name: newUser.father_name,
      gender: newUser.gender,
      dob: newUser.dob,
      religion: newUser.religion,
      home_address: newUser.home_address,
      home_country: newUser.home_country,
      home_state: newUser.home_state,
      home_city: newUser.home_city,
      pan_no: newUser.pan_no,
      shop_name: newUser.shop_name,
      shop_address: newUser.shop_address,
      shop_country: newUser.shop_country,
      shop_state: newUser.shop_state,
      shop_city: newUser.shop_city,
      gst_no: newUser.gst_no,
      bank_account_holder_name: newUser.bank_account_holder_name,
      bank_name: newUser.bank_name,
      bank_account_no: newUser.bank_account_no,
      bank_IFSC_code: newUser.bank_IFSC_code,
      pan_card_copy: newUser.pan_card_copy,
      aadhar_card_copy: newUser.aadhar_card_copy,
      bank_passbook_copy: newUser.bank_passbook_copy,
      isActive: newUser.isActive,
    })
  } catch (error) {
    // console.log("SAVE ERROR:", error);
    res.status(400).json({ message: error.message });
    throw new Error("Registration Error", error);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {

  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const seller = await Seller.findOne({ email });

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  seller.resetPasswordToken = hashedToken;
  seller.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await seller.save();

  // Reset link
  const resetUrl = `${process.env.FRONTEND_URL}/seller/reset-password/${resetToken}`;

  const sendSmtpEmail = {
    to: [
      {
        email: seller.email,
      },
    ],
    sender: {
      email: process.env.MAIL_USERNAME,
      name: "Shoop Mart",
    },
    subject: "Reset Your Password",
    htmlContent: `
        <h2>Password Reset Request</h2>

        <p>Hello ${seller.fname},</p>

        <p>You requested to reset your password.</p>

        <a href="${resetUrl}"
        style="padding:10px 20px;background:#ff6a00;color:white;text-decoration:none;border-radius:5px;">
        Reset Password
        </a>

        <p>This link is valid for 15 minutes.</p>

        <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {

    await emailApi.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({
      message: "Password reset email sent successfully",
    });

  } catch (error) {

    console.error("Brevo Error:", error.response?.body || error);

    res.status(500);
    throw new Error("Failed to send reset email");

  }

});

const resetPassword = asyncHandler(async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const seller = await Seller.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!seller) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }

  const salt = await bcrypt.genSalt(10);
  seller.password = await bcrypt.hash(password, salt);

  seller.resetPasswordToken = undefined;
  seller.resetPasswordExpire = undefined;

  await seller.save();

  res.json({
    message: "Password reset successful",
  });

});

const changePassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password are required",
    });
  }

  const seller = await Seller.findById(req.user._id);

  if (!seller) {
    return res.status(404).json({
      message: "Seller not found",
    });
  }

  // Verify old password
  const isMatch = await bcrypt.compare(oldPassword, seller.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Old password is incorrect",
    });
  }

  const salt = await bcrypt.genSalt(10);
  seller.password = await bcrypt.hash(newPassword, salt);

  await seller.save();

  res.status(200).json({
    message: "Password changed successfully",
  });

});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await Seller.findOne({ email });

  if (!existingUser) {
    return res.status(401).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid Password" });
  }

  // ✅ STATUS CHECK START
  if (existingUser.status === "PENDING") {
    return res.status(403).json({
      message: "Your account is under review. Please wait for admin approval."
    });
  }

  if (existingUser.status === "REJECTED") {
    return res.status(403).json({
      message: "Your account has been rejected. Please contact support."
    });
  }

  // ✅ Only APPROVED can login
  if (existingUser.status === "APPROVED") {

    createsellerToken(res, existingUser._id);

    return res.status(200).json({
      _id: existingUser._id,
      fname: existingUser.fname,
      email: existingUser.email,
      contact: existingUser.contact,
      isActive: existingUser.isActive,
      status: existingUser.status,
    });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwtseller', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await Seller.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      fname: user.fname,
      email: user.email,
      aadhar: user.aadhar,
      contact: user.contact,
      gender: user.gender,
      dob: user.dob,
      religion: user.religion,
      home_address: user.home_address,
      home_country: user.home_country,
      home_state: user.home_state,
      home_city: user.home_city,
      pan_no: user.pan_no,
      shop_name: user.shop_name,
      shop_address: user.shop_address,
      shop_country: user.shop_country,
      shop_state: user.shop_state,
      shop_city: user.shop_city,
      gst_no: user.gst_no,
      bank_account_holder_name: user.bank_account_holder_name,
      bank_name: user.bank_name,
      bank_account_no: user.bank_account_no,
      bank_IFSC_code: user.bank_IFSC_code,
      pan_card_copy: user.pan_card_copy,
      aadhar_card_copy: user.aadhar_card_copy,
      bank_passbook_copy: user.bank_passbook_copy,
      status: user.status,
      approvedAt: user.approvedAt,
      createdAt: user.createdAt,
      isActive: user.isActive,
    });
  } else {
    req.status(404);
    throw new Error("User not Found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await Seller.findById(req.user._id);

  if (user) {
    user.fname = req.body.fname || user.fname;
    user.email = req.body.email || user.email;
    user.aadhar = req.body.aadhar || user.aadhar;
    user.contact = req.body.contact || user.contact;
    user.father_name = req.body.father_name || user.father_name;
    user.gender = req.body.gender || user.gender;
    user.dob = req.body.dob || user.dob;
    user.religion = req.body.religion || user.religion;
    user.home_address = req.body.home_address || user.home_address;
    user.home_country = req.body.home_country || user.home_country;
    user.home_state = req.body.home_state || user.home_state;
    user.home_city = req.body.home_city || user.home_city;
    user.pan_no = req.body.pan_no || user.pan_no;
    user.shop_name = req.body.shop_name || user.shop_name;
    user.shop_address = req.body.shop_address || user.shop_address;
    user.shop_country = req.body.shop_country || user.shop_country;
    user.shop_state = req.body.shop_state || user.shop_state;
    user.shop_city = req.body.shop_city || user.shop_city;
    user.gst_no = req.body.gst_no || user.gst_no;
    user.bank_account_holder_name = req.body.bank_account_holder_name || user.bank_account_holder_name;
    user.bank_name = req.body.bank_name || user.bank_name;
    user.bank_account_no = req.body.bank_account_no || user.bank_account_no;
    user.bank_IFSC_code = req.body.bank_IFSC_code || user.bank_IFSC_code;
    user.pan_card_copy = req.body.pan_card_copy || user.pan_card_copy;
    user.aadhar_card_copy = req.body.aadhar_card_copy || user.aadhar_card_copy;
    user.bank_passbook_copy = req.body.bank_passbook_copy || user.bank_passbook_copy;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      fname: updatedUser.fname,
      email: updatedUser.email,
      aadhar: updatedUser.aadhar,
      contact: updatedUser.contact,
      father_name: updatedUser.father_name,
      gender: updatedUser.gender,
      dob: updatedUser.dob,
      religion: updatedUser.religion,
      home_address: updatedUser.home_address,
      home_country: updatedUser.home_country,
      home_state: updatedUser.home_state,
      home_city: updatedUser.home_city,
      pan_no: updatedUser.pan_no,
      shop_name: updatedUser.shop_name,
      shop_address: updatedUser.shop_address,
      shop_country: updatedUser.shop_country,
      shop_state: updatedUser.shop_state,
      shop_city: updatedUser.shop_city,
      gst_no: updatedUser.gst_no,
      bank_account_holder_name: updatedUser.bank_account_holder_name,
      bank_name: updatedUser.bank_name,
      bank_account_no: updatedUser.bank_account_no,
      bank_IFSC_code: updatedUser.bank_IFSC_code,
      pan_card_copy: updatedUser.pan_card_copy,
      aadhar_card_copy: updatedUser.aadhar_card_copy,
      bank_passbook_copy: updatedUser.bank_passbook_copy,
      isActive: updatedUser.isActive
    });
  } else {
    res.status(404);
    throw new Error("User Not Found.");
  }
});

const getSellerOrders = asyncHandler(async (req, res) => {

  const seller_id = req.user._id.toString();

  const orders = await OrderItem.aggregate([

    // 1️⃣ seller ke items
    {
      $match: {
        seller_id,
        item_status: "confirmed"
      }
    },

    // 2️⃣ join order table
    {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order"
      }
    },

    // 3️⃣ order array → object
    {
      $unwind: "$order"
    },

    // 4️⃣ only placed orders
    {
      $match: {
        "order.order_status": "placed",
        "order.payment_status": { $in: ["paid", "pending"] }
      }
    },

    // 5️⃣ latest first
    {
      $sort: { createdAt: -1 }
    }

  ]);

  res.json({
    success: true,
    total_items: orders.length,
    orders
  });

});

const confirmOrderItem = asyncHandler(async (req, res) => {

  const item = await OrderItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Order item not found"
    });
  }

  item.item_status = "confirmed";

  await item.save();

  res.json({
    success: true,
    message: "Order confirmed successfully"
  });

});

const shipOrderItem = asyncHandler(async (req, res) => {
  const { item_id } = req.params;
  const seller_id = req.user._id.toString();

  const item = await OrderItem.findOne({
    _id: item_id,
    seller_id,
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Order item not found or not authorized",
    });
  }

  // Only confirmed items can be shipped
  if (item.item_status !== "confirmed") {
    return res.status(400).json({
      success: false,
      message: "Only confirmed items can be shipped",
    });
  }

  item.item_status = "shipped";

  await item.save();

  res.json({
    success: true,
    message: "Item marked as shipped",
    item,
  });
});

const getSellerShippedOrders = asyncHandler(async (req, res) => {

  const seller_id = req.user._id.toString();

  const orders = await OrderItem.aggregate([
    {
      $match: {
        seller_id,
        item_status: "shipped"
      }
    },

    {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order"
      }
    },

    {
      $unwind: "$order"
    },

    {
      $sort: { updatedAt: -1 }
    }

  ]);

  res.json({
    success: true,
    total_items: orders.length,
    orders
  });

});

const getSellerOrderHistory = asyncHandler(async (req, res) => {
  const seller_id = req.user._id.toString();

  const orders = await OrderItem.aggregate([
    {
      $match: {
        seller_id,
        item_status: { $in: ["delivered", "cancelled"] }
      }
    },
    {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order"
      }
    },
    { $unwind: "$order" },
    {
      $sort: { updatedAt: -1 }
    }
  ]);

  res.json({
    success: true,
    total_items: orders.length,
    orders
  });
});

const getSellerPlacedOrders = asyncHandler(async (req, res) => {
  const seller_id = req.user._id.toString();

  const orders = await OrderItem.aggregate([

    // 1️⃣ seller ke items
    {
      $match: {
        seller_id,
        item_status: "pending",
      },
    },

    // 2️⃣ order join
    {
      $lookup: {
        from: "orders",
        localField: "order_id",
        foreignField: "_id",
        as: "order",
      },
    },

    // 3️⃣ array → object
    {
      $unwind: "$order",
    },

    // 4️⃣ only placed orders
    {
      $match: {
        "order.order_status": "placed",
      },
    },

    // 5️⃣ latest first
    {
      $sort: { createdAt: -1 },
    },

  ]);

  res.json({
    success: true,
    total_orders: orders.length,
    orders,
  });
});

const markItemDelivered = asyncHandler(async (req, res) => {
  try {
    const { itemId } = req.params;

    const seller_id = req.user._id.toString();

    const item = await OrderItem.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found"
      });
    }

    // security check
    if (item.seller_id !== seller_id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // already delivered
    if (item.item_status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Item already delivered"
      });
    }

    item.item_status = "delivered";

    await item.save();

    const items = await OrderItem.find({ order_id: item.order_id });

    const allDelivered = items.every(i => i.item_status === "delivered");

    if (allDelivered) {
      await Order.findByIdAndUpdate(item.order_id, {
        order_status: "delivered"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item marked as delivered"
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
});

const getSellerDashboard = async (req, res) => {
  try {

    const sellerId = req.user._id.toString();

    // total products
    const totalProducts = await Product.countDocuments({
      seller_id: sellerId
    });

    // total orders
    const totalOrders = await OrderItem.countDocuments({
      seller_id: sellerId
    });

    // revenue
    const items = await OrderItem.find({
      seller_id: sellerId,
      item_status: "delivered"
    });

    const totalRevenue = items.reduce(
      (acc, item) => acc + item.seller_earning,
      0
    );

    // recent orders
    const recentItems = await OrderItem.find({
      seller_id: sellerId
    })
      .populate("product_id", "name images")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOrders = await Promise.all(
      recentItems.map(async (item) => {
        const order = await Order.findById(item.order_id);

        return {
          _id: item._id,
          product: item.product_name,
          image: item.product_image,
          amount: item.total_price,
          status: item.item_status,
          customer: order?.name || "Customer"
        };
      })
    );

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        activeUsers: totalOrders
      },
      recentOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getSellerByRetryToken = asyncHandler(async (req, res) => {

  const seller = await Seller.findOne({
    retryToken: req.params.token,
    retryTokenExpiry: { $gt: Date.now() }
  });

  if (!seller) {
    res.status(400);
    throw new Error("Invalid or expired link");
  }

  res.json({
    success: true,
    seller
  });

});

const updateRejectedSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findOne({
    retryToken: req.params.token,
    retryTokenExpiry: { $gt: Date.now() }
  });

  if (!seller) {
    res.status(400);
    throw new Error("Invalid or expired link");
  }

  const data = req.body;

  // 🔥 Verify password with existing password
  if (data.password) {
    const isMatch = await bcrypt.compare(data.password, seller.password);

    if (!isMatch) {
      res.status(400);
      throw new Error("Password is incorrect");
    }
  }

  // 🔥 Update fields
  Object.keys(data).forEach((key) => {
    if (key !== "password") {
      seller[key] = data[key];
    }
  });

  seller.status = "PENDING";
  seller.rejectionReason = null;

  seller.retryToken = null;
  seller.retryTokenExpiry = null;

  await seller.save();

  res.json({
    success: true,
    message: "Seller updated and resubmitted"
  });
});

export {
  createUser,
  forgotPassword,
  resetPassword,
  changePassword,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getSellerOrders,
  confirmOrderItem,
  shipOrderItem,
  getSellerShippedOrders,
  getSellerOrderHistory,
  getSellerPlacedOrders,
  markItemDelivered,
  getSellerDashboard,
  getSellerByRetryToken,
  updateRejectedSeller,
};
