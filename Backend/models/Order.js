import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        order_number: {
            type: String,
            required: true,
            unique: true,
        },

        user_id: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        mobile_number: {
            type: String,
            required: true,
        },

        total_amount: {
            type: Number,
            required: true,
        },

        shipping_charge: {
            type: Number,
            default: 0,
        },

        grand_total: {
            type: Number,
            required: true,
        },

        payment_method: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true,
        },

        payment_status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        order_status: {
            type: String,
            enum: ["placed", "confirmed", "cancelled"],
            default: "placed",
        },

        address: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
