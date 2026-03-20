import express from "express";
import { admincreateProduct, deleteProduct, getAllProduct, toggleProductStatus, updateSpesificProduct } from "../controllers/adminproductController.js";
import { protectAdmin, allowRoles } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), getAllProduct);

router.put("/:id/status", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), toggleProductStatus);

router.delete("/product/:id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), deleteProduct);

router.post("/", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), admincreateProduct);

router.put('/:id', protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), updateSpesificProduct);

export default router;
