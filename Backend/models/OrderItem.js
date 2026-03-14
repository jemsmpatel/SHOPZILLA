import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
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

        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        product_name: String,

        product_image: String,

        discount_price: {
            type: Number, // ✅ ₹ amount
            default: 0,
        },

        price: Number,
        quantity: Number,
        total_price: Number,

        commission: Number,
        seller_earning: Number,

        item_status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    { timestamps: true }
);

export default mongoose.model("OrderItem", orderItemSchema);
