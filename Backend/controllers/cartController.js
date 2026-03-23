import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// @desc    Get User Cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(200).json({ cartItems: [] });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add Item To Cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const { productId, qty } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                cartItems: [],
            });
        }

        const itemIndex = cart.cartItems.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].qty += qty;
        } else {
            cart.cartItems.push({
                product: product._id,
                seller_id: product.seller_id,
                name: product.name,
                image: product.images[0],
                price: product.price,
                mrp_price: product.mrp_price,
                discount_rate: product.discount_rate,
                tax: product.tax,
                qty,
            });
        }

        await cart.save();

        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Cart Item Quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { qty } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const item = cart.cartItems.find(
            (item) => item.product.toString() === req.params.productId
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        item.qty = qty;

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove Item From Cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeCartItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.cartItems = cart.cartItems.filter(
            (item) => item.product.toString() !== req.params.productId
        );

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
