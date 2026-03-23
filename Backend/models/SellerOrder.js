import mongoose from "mongoose";

const sellerOrderSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        seller_id: {
            type: String,
            required: true,
        },

        seller_total: {
            type: Number,
            required: true,
        },

        seller_status: {
            type: String,
            enum: ["pending", "processing", "completed"],
            default: "pending",
        },

        payout_status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("SellerOrder", sellerOrderSchema);
