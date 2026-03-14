import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
    },

    contact: {
        type: String,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["SUPER_ADMIN", "ADMIN", "STAFF"],
        default: "STAFF",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    lastLoginAt: {
        type: Date,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {
    timestamps: true,
});

export default mongoose.model("Admin", adminSchema);