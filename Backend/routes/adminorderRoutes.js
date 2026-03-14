import express from "express";
import {
    getPlacedOrders,
    confirmOrderItem,
    shipOrderItem,
    markItemDelivered,
    getShippedOrders,
    getOrderHistory,
    getPendingOrders,
} from "../controllers/adminOrderController.js";
import { protectAdmin, allowRoles } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// ✅ Placed orders
router.get("/placed", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), getPlacedOrders);

// ✅ Confirm order item
router.put("/confirm/:item_id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), confirmOrderItem);

// ✅ Ship order item
router.put("/ship/:item_id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), shipOrderItem);

// ✅ Mark delivered
router.put("/deliver/:item_id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), markItemDelivered);

// ✅ Shipped orders
router.get("/shipped", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), getShippedOrders);

// ✅ Order history
router.get("/history", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), getOrderHistory);

router.get("/pending", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), getPendingOrders);

export default router;