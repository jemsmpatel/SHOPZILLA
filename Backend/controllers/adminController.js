import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createAdminToken from "../utils/createAdminToken.js";
import Admin from "../models/Admin.js";
import User from "../models/user.js";
import Seller from "../models/Seller.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Brevo config (DO THIS ONCE)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================= CREATE ADMIN =================
const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, contact, password, role } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Email and password are required");
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
        res.status(400);
        throw new Error("Admin already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
        name,
        email,
        contact,
        password: hashedPassword,
        role: role || "ADMIN",
    });

    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
        });
    } else {
        res.status(400);
        throw new Error("Invalid admin data");
    }
});

const adminForgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await admin.save();

    const resetUrl = `${process.env.FRONTEND_URL}/admin/reset-password/${resetToken}`;

    const sendSmtpEmail = {
        to: [{ email: admin.email }],
        sender: {
            email: process.env.MAIL_USERNAME,
            name: "Shoop Mart Admin",
        },
        subject: "Admin Password Reset",
        htmlContent: `
            <h2>Password Reset</h2>
            <p>Hello ${admin.name}</p>
            <a href="${resetUrl}"
            style="padding:10px 20px;background:#ff6a00;color:white;text-decoration:none;border-radius:5px;">
            Reset Password
            </a>
            <p>This link expires in 15 minutes</p>
        `,
    };

    await emailApi.sendTransacEmail(sendSmtpEmail);

    res.json({ message: "Password reset email sent" });

});

const adminResetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const admin = await Admin.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
        res.status(400);
        throw new Error("Invalid or expired token");
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ message: "Password reset successful" });

});

const adminChangePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id);

    const isMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isMatch) {
        res.status(400);
        throw new Error("Old password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({
        message: "Password updated successfully",
    });

});

// ================= LOGIN ADMIN =================
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
        if (!admin.isActive) {
            res.status(403);
            throw new Error("Admin account is disabled");
        }

        admin.lastLoginAt = new Date();
        await admin.save();

        createAdminToken(res, admin._id);

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            contact: admin.contact,
            role: admin.role,
            isActive: admin.isActive,
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// ================= LOGOUT ADMIN =================
const logoutAdmin = asyncHandler(async (req, res) => {
    res.cookie("jwtadmin", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Admin logged out successfully" });
});

// ================= GET ADMIN PROFILE =================
const getAdminProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (admin) {
        res.json(admin);
    } else {
        res.status(404);
        throw new Error("Admin not found");
    }
});

// ================= UPDATE ADMIN PROFILE =================
const updateAdminProfile = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    // ✅ Allowed self-updates only
    admin.name = req.body.name ?? admin.name;
    admin.contact = req.body.contact ?? admin.contact;
    admin.email = req.body.email ?? admin.email;

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(req.body.password, salt);
    }

    await admin.save();

    res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,      // READ ONLY
        isActive: admin.isActive,
    });
});

// ================= UPDATE ADMIN ROLE =================
const updateAdminRole = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    admin.role = req.body.role;
    await admin.save();

    res.json({
        message: "Admin role updated",
        role: admin.role,
    });
});

// ================= EXTRA ADMIN ROUTES =================
// Get all admins (SUPER_ADMIN only)
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find({
        isActive: { $in: [true, false] }   // null exclude ho jayega
    }).select("-password");

    res.json(admins);
});

// Activate / Deactivate admin
const toggleAdminStatus = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        res.status(404);
        throw new Error("Admin not found");
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.json({ message: "Admin status updated", isActive: admin.isActive });
});

const deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        // SUPER ADMIN ko delete nahi kar sakte
        if (admin.role === "SUPER_ADMIN") {
            return res.status(400).json({
                message: "Super admin cannot be deleted",
            });
        }

        // Soft delete
        admin.isActive = null; // ya false (recommended)

        await admin.save();

        res.status(200).json({
            message: "Admin removed successfully",
            adminId: admin._id,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

const getDashboardStats = asyncHandler(async (req, res) => {
    // USERS
    const totalUsers = await User.countDocuments();

    // SELLERS
    const totalSellers = await Seller.countDocuments();
    const pendingSellers = await Seller.countDocuments({ status: "PENDING" });

    // PRODUCTS
    const totalProducts = await Product.countDocuments();

    // CATEGORIES
    const totalCategories = await Category.countDocuments();

    // ORDERS
    const totalOrders = await Order.countDocuments();

    // REVENUE
    const revenueResult = await OrderItem.aggregate([
        { $match: { item_status: "delivered" } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$total_price" },
            },
        },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // RECENT ORDERS
    const recentOrders = await OrderItem.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("product_id", "name images");

    const formattedOrders = recentOrders.map((item) => ({
        id: item._id,
        customer: item.product_name,
        product: item.product_name,
        amount: item.total_price,
        status: item.item_status,
    }));

    res.json({
        stats: {
            totalUsers,
            totalSellers,
            pendingSellers,
            totalProducts,
            totalCategories,
            totalOrders,
            totalRevenue,
        },
        recentOrders: formattedOrders,
    });
});

export {
    createAdmin,
    adminForgotPassword,
    adminResetPassword,
    adminChangePassword,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
    updateAdminProfile,
    updateAdminRole,
    getAllAdmins,
    toggleAdminStatus,
    deleteAdmin,
    getDashboardStats,
};
