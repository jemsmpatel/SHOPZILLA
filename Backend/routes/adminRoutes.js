import express from 'express';

//controllers
import {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    getAdminProfile,
    updateAdminProfile,
    getAllAdmins,
    toggleAdminStatus,
    updateAdminRole,
    deleteAdmin,
    getDashboardStats,
    adminForgotPassword,
    adminResetPassword,
    adminChangePassword,
} from "../controllers/adminController.js";

import { protectAdmin, allowRoles } from "../middlewares/adminAuthMiddleware.js";


const router = express.Router();

router.post("/", protectAdmin, allowRoles("SUPER_ADMIN"), createAdmin);
router.post("/login", loginAdmin);
router.post("/logout", protectAdmin, logoutAdmin);

router.post("/forgot-password", adminForgotPassword);

router.put("/reset-password/:token", adminResetPassword);

router.put("/change-password", protectAdmin, adminChangePassword);

router.put("/:id/role", protectAdmin, allowRoles("SUPER_ADMIN"), updateAdminRole);

router.get("/profile", protectAdmin, getAdminProfile);
router.put("/profile", protectAdmin, updateAdminProfile);

router.get("/", protectAdmin, allowRoles("SUPER_ADMIN"), getAllAdmins);
router.put("/:id/status", protectAdmin, allowRoles("SUPER_ADMIN"), toggleAdminStatus);

router.delete("/:id", protectAdmin, allowRoles("SUPER_ADMIN"), deleteAdmin);

router.get("/dashboard", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), getDashboardStats);



export default router;