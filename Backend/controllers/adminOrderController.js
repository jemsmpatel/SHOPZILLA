import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";

// ✅ Get all placed orders with items
const getPlacedOrders = asyncHandler(async (req, res) => {
    const orders = await OrderItem.aggregate([
        // 1️⃣ join order table
        {
            $lookup: {
                from: "orders",
                localField: "order_id",
                foreignField: "_id",
                as: "order",
            },
        },
        { $unwind: "$order" },

        // 2️⃣ only placed orders (item_status pending)
        {
            $match: {
                "order.order_status": "placed",
                item_status: "pending" // ✅ only pending items
            },
        },

        // 3️⃣ latest first
        {
            $sort: { createdAt: -1 },
        },
    ]);

    res.json({
        success: true,
        total_items: orders.length,
        orders,
    });
});

// ✅ Confirm an order item
const confirmOrderItem = asyncHandler(async (req, res) => {
    const { item_id } = req.params;

    const item = await OrderItem.findById(item_id);
    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Order item not found",
        });
    }

    // Only pending or placed items can be confirmed
    if (item.item_status === "confirmed") {
        return res.status(400).json({
            success: false,
            message: "Item already confirmed",
        });
    }

    item.item_status = "confirmed";
    await item.save();

    res.json({
        success: true,
        message: "Order item confirmed successfully",
    });
});

// ✅ Ship an order item
const shipOrderItem = asyncHandler(async (req, res) => {
    const { item_id } = req.params;

    const item = await OrderItem.findById(item_id);
    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Order item not found",
        });
    }

    if (item.item_status !== "confirmed") {
        return res.status(400).json({
            success: false,
            message: "Only confirmed items can be shipped",
        });
    }

    item.item_status = "shipped";
    await item.save();

    res.json({
        success: true,
        message: "Item marked as shipped",
        item,
    });
});

// ✅ Delivered / Mark delivered
const markItemDelivered = asyncHandler(async (req, res) => {
    const { item_id } = req.params;

    const item = await OrderItem.findById(item_id);
    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Order item not found",
        });
    }

    if (item.item_status === "delivered") {
        return res.status(400).json({
            success: false,
            message: "Item already delivered",
        });
    }

    item.item_status = "delivered";
    await item.save();

    // check if all items of the order are delivered
    const items = await OrderItem.find({ order_id: item.order_id });
    const allDelivered = items.every((i) => i.item_status === "delivered");

    if (allDelivered) {
        await Order.findByIdAndUpdate(item.order_id, { order_status: "delivered" });
    }

    res.json({
        success: true,
        message: "Item marked as delivered",
    });
});

// ✅ Get shipped items
const getShippedOrders = asyncHandler(async (req, res) => {
    const orders = await OrderItem.aggregate([
        { $match: { item_status: "shipped" } },
        {
            $lookup: {
                from: "orders",
                localField: "order_id",
                foreignField: "_id",
                as: "order",
            },
        },
        { $unwind: "$order" },
        { $sort: { updatedAt: -1 } },
    ]);

    res.json({
        success: true,
        total_items: orders.length,
        orders,
    });
});

// ✅ Get order history (delivered/cancelled)
const getOrderHistory = asyncHandler(async (req, res) => {
    const orders = await OrderItem.aggregate([
        {
            $match: { item_status: { $in: ["delivered", "cancelled"] } },
        },
        {
            $lookup: {
                from: "orders",
                localField: "order_id",
                foreignField: "_id",
                as: "order",
            },
        },
        { $unwind: "$order" },
        { $sort: { updatedAt: -1 } },
    ]);

    res.json({
        success: true,
        total_items: orders.length,
        orders,
    });
});

const getPendingOrders = asyncHandler(async (req, res) => {
    const orders = await OrderItem.aggregate([
        {
            $match: {
                item_status: "confirmed", // pending ship ke liye
            },
        },
        {
            $lookup: {
                from: "orders",
                localField: "order_id",
                foreignField: "_id",
                as: "order",
            },
        },
        { $unwind: "$order" },
        { $sort: { createdAt: -1 } },
    ]);

    res.json({
        success: true,
        total_items: orders.length,
        orders,
    });
});

export {
    getPlacedOrders,
    confirmOrderItem,
    shipOrderItem,
    markItemDelivered,
    getShippedOrders,
    getOrderHistory,
    getPendingOrders,
};