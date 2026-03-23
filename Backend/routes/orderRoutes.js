import express from "express";
import {
    cancelOrder,
    createPaymentOrder,
    getOrderById,
    getUserOrders,
    placeOrder,
} from "../controllers/orderController.js";

//middlewares
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/create-payment-order", authenticate, createPaymentOrder);

router.post("/place-order", authenticate, placeOrder);
router.put("/cancel/:order_id", authenticate, cancelOrder);
router.get("/:order_id", authenticate, getOrderById);
router.get("/", authenticate, getUserOrders);

export default router;
