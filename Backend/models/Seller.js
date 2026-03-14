import mongoose from "mongoose";

const sellerSchema = mongoose.Schema({

    fname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    aadhar: {
        type: Number,
        required: true,
        unique: true,
    },

    contact: {
        type: Number,
        required: true,   // ⚠ require -> required
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    father_name: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: true,
    },

    dob: {
        type: String,
        required: true,
    },

    religion: {
        type: String,
        required: true,
    },

    home_address: {
        type: String,
        required: true,
    },

    home_country: {
        type: String,
        required: true,
    },

    home_state: {
        type: String,
        required: true,
    },

    home_city: {
        type: String,
        required: true,
    },

    pan_no: {
        type: String,
        required: true,
        unique: true,
    },

    shop_name: {
        type: String,
        required: true,
    },

    shop_address: {
        type: String,
        required: true,
    },

    shop_country: {
        type: String,
        required: true,
    },

    shop_state: {
        type: String,
        required: true,
    },

    shop_city: {
        type: String,
        required: true,
    },

    gst_no: {
        type: String,
        required: true,
        unique: true,
    },

    bank_account_holder_name: {
        type: String,
        required: true,
    },

    bank_name: {
        type: String,
        required: true,
    },

    bank_account_no: {
        type: Number,
        required: true,
        unique: true,
    },

    bank_IFSC_code: {
        type: String,
        required: true,
    },

    pan_card_copy: {
        type: String,
        required: true,
    },

    aadhar_card_copy: {
        type: String,
        required: true,
    },

    bank_passbook_copy: {
        type: String,
        required: true,
    },

    // Admin approval system
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING",
    },

    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },

    approvedAt: {
        type: Date,
    },

    rejectionReason: {
        type: String,
    },

    blockedReason: {
        type: String,
    },

    // Retry registration
    retryToken: {
        type: String,
    },

    retryTokenExpiry: {
        type: Date,
    },

    // 🔐 Forgot Password fields
    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpire: {
        type: Date,
    },

    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },

}, { timestamps: true });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;