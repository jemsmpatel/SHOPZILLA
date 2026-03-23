import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        seller_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        mrp_price: {
            type: Number,
        },

        discount_rate: {
            type: Number,
            default: 0,
        },

        tax: {
            type: Number,
            default: 0,
        },

        qty: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { _id: false }
);

const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // one cart per user
        },

        cartItems: [cartItemSchema],

        totalPrice: {
            type: Number,
            default: 0,
        },

        totalTax: {
            type: Number,
            default: 0,
        },

        grandTotal: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// 🔥 Auto Calculate Totals Before Save
cartSchema.pre("save", function (next) {
    this.totalPrice = this.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    this.totalTax = this.cartItems.reduce(
        (acc, item) =>
            acc + ((item.price * item.tax) / 100) * item.qty,
        0
    );

    this.grandTotal = this.totalPrice + this.totalTax;

    next;
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;