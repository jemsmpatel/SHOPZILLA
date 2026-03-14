import asyncHandler from "../middlewares/asyncHandler.js";
import Seller from '../models/Seller.js';
import SibApiV3Sdk from "sib-api-v3-sdk";
import crypto from "crypto";

// Brevo config
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ================= CREATE ADMIN =================
const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await Seller.find({})
    .select("-password -aadhar -bank_account_no -bank_IFSC_code") // sensitive fields hide
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: sellers.length,
    sellers,
  });
});

const approveSeller = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  if (seller.status === "APPROVED") {
    res.status(400);
    throw new Error("Seller already approved");
  }

  seller.status = "APPROVED";
  seller.approvedBy = req.admin._id;
  seller.approvedAt = new Date();
  seller.rejectionReason = null;

  await seller.save();

  // EMAIL SEND (SAFE BLOCK)

  try {

    const sendSmtpEmail = {
      to: [{ email: seller.email }],
      sender: {
        email: process.env.MAIL_USERNAME,
        name: "Shoop Mart"
      },
      subject: "Seller Account Approved",
      htmlContent: `
      <h2>Congratulations ${seller.fname}</h2>
      <p>Your seller account has been <b>APPROVED</b>.</p>
      <p>You can now login and start selling products.</p>
      <br/>
      <p>Thanks,<br/>Shoop Mart Team</p>
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

  res.status(200).json({
    message: "Seller approved successfully",
    sellerId: seller._id,
    status: seller.status,
  });
});

const rejectSeller = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }

  // 🔐 Generate retry token
  const token = crypto.randomBytes(32).toString("hex");

  seller.status = "REJECTED";
  seller.rejectionReason = reason;
  seller.approvedBy = null;
  seller.approvedAt = null;

  seller.retryToken = token;
  seller.retryTokenExpiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  await seller.save();

  // 🔗 Frontend Edit Link
  const editLink = `${process.env.FRONTEND_URL}/seller/retry/${token}`;

  // EMAIL SEND (SAFE BLOCK)
  try {

    const sendSmtpEmail = {
      to: [{ email: seller.email }],
      sender: {
        email: process.env.MAIL_USERNAME,
        name: "Shoop Mart"
      },
      subject: "Seller Account Rejected",
      htmlContent: `
        <h2>Hello ${seller.fname}</h2>

        <p>Your seller account has been <b>REJECTED</b>.</p>

        <p><b>Reason:</b> ${reason}</p>

        <p>Please update your documents and apply again.</p>

        <br/>

        <a href="${editLink}"
        style="
        padding:12px 20px;
        background:#f97316;
        color:white;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
        ">
        Update Your Details
        </a>

        <br/><br/>

        <p>This link will expire in 24 hours.</p>

        <p>Thanks,<br/>Shoop Mart Team</p>
      `
    };

    await emailApi.sendTransacEmail(sendSmtpEmail);

  } catch (mailError) {

    console.error("Email sending failed:", mailError.message);

    try {
      await emailApi.sendTransacEmail(sendSmtpEmail);
    } catch (retryError) {
      console.error("Email retry failed:", retryError.message);
    }

  }

  res.status(200).json({
    message: "Seller rejected successfully",
    sellerId: seller._id,
    status: seller.status,
  });

});

const getSellerById = asyncHandler(async (req, res) => {

  const seller = await Seller.findById(req.params.id).select("-password");

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  res.status(200).json({
    success: true,
    seller,
  });

});

const toggleSellerStatus = asyncHandler(async (req, res) => {

  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    res.status(404);
    throw new Error("Seller not found");
  }

  seller.isActive = !seller.isActive;

  await seller.save();

  res.status(200).json({
    message: "Seller status updated successfully",
    sellerId: seller._id,
    isActive: seller.isActive
  });

});

export {
  getAllSellers,
  approveSeller,
  rejectSeller,
  getSellerById,
  toggleSellerStatus,
};
