import express from 'express';
import { protectAdmin, allowRoles } from "../middlewares/adminAuthMiddleware.js";
import { approveSeller, getAllSellers, getSellerById, rejectSeller, toggleSellerStatus } from '../controllers/adminsellerController.js';


const router = express.Router();

router.get("/", protectAdmin, allowRoles("ADMIN", "SUPER_ADMIN"), getAllSellers);

router.put("/:id/approve", protectAdmin, allowRoles("ADMIN", "SUPER_ADMIN"), approveSeller);

router.put("/:id/reject", protectAdmin, allowRoles("ADMIN", "SUPER_ADMIN"), rejectSeller);

router.get("/:id", protectAdmin, allowRoles("ADMIN", "SUPER_ADMIN"), getSellerById);

router.patch("/toggle/:id", protectAdmin, allowRoles("ADMIN", "SUPER_ADMIN"), toggleSellerStatus);



export default router;