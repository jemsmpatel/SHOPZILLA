import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from '../utils/createToken.js';
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

// Brevo config (DO THIS ONCE)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// In-memory OTP store
const otpStore = {};

const createUser = asyncHandler(async (req, res) => {
    const { fname, email, contact } = req.body;

    if (!email) {
        throw new Error("Please fill all the fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).send("User Email is already exists");

    const newUser = new User({ fname, email, contact });

    try {
        await newUser.save();
        createToken(res, newUser._id);
        res.status(201).json({
            _id: newUser._id,
            fname: newUser.fname,
            email: newUser.email,
            contact: newUser.contact,
            isActive: newUser.isActive,
        })
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const request_otp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
        otp,
        timestamp: Date.now(),
    };

    const sendSmtpEmail = {
        to: [
            {
                email: email,
            },
        ],
        sender: {
            email: process.env.MAIL_USERNAME,
            name: "Shoop Mart",
        },
        subject: "Your OTP Code",
        htmlContent: `
            <h2>Your OTP Code</h2>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
        `,
    };

    try {
        await emailApi.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Brevo Error:", error.response?.body || error);
        res.status(500);
        throw new Error("Failed to send OTP");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error("Email and OTP required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const otpData = otpStore[email];

    if (!otpData) {
        res.status(400);
        throw new Error("OTP not requested");
    }

    if (Date.now() - otpData.timestamp > 5 * 60 * 1000) {
        delete otpStore[email];
        res.status(400);
        throw new Error("OTP expired");
    }

    if (otp.toString() !== otpData.otp) {
        res.status(400);
        throw new Error("Invalid OTP");
    }

    delete otpStore[email];

    createToken(res, user._id);

    res.status(200).json({
        _id: user._id,
        fname: user.fname,
        email: user.email,
        contact: user.contact,
        isActive: user.isActive
    });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie('jwtuser', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: "Logged out successfully" });
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            fname: user.fname,
            email: user.email,
            contact: user.contact,
        });
    } else {
        req.status(404);
        throw new Error("User not Found.");
    }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.fname = req.body.fname || user.fname;
        user.email = req.body.email || user.email;
        user.contact = req.body.contact || user.contact;

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
            contact: updatedUser.contact,
            isActive: updatedUser.isActive
        });
    } else {
        res.status(404);
        throw new Error("User Not Found.");
    }
});

const getUserReviews = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const products = await Product.find({
    "reviews.user": userId
  }).select("name images reviews");

  const userReviews = [];

  products.forEach((product) => {

    product.reviews.forEach((review) => {

      if (review.user.toString() === userId.toString()) {

        userReviews.push({
          review_id: review._id,
          product_id: product._id,
          product_name: product.name,
          product_image: product.images?.[0] || "",
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt
        });

      }

    });

  });

  res.status(200).json({
    success: true,
    count: userReviews.length,
    reviews: userReviews
  });

});

export {
    createUser,
    request_otp,
    loginUser,
    logoutCurrentUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    getUserReviews,
};
