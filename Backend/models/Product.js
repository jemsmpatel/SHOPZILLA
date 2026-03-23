import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        seller_id: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },

        mrp_price: {
            type: Number,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        discount_rate: {
            type: Number,
            required: true,
        },

        category_id: {
            type: String,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
        },

        sku: {
            type: String,
            required: true,
            unique: true,
        },

        tax: {
            type: Number,
            required: true,
        },

        reviews: {
            type: [mongoose.Schema.Types.Mixed],
            default: [],
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        brand: {
            type: String,
            required: true,
        },

        images: {
            type: [String],
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    }, { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
