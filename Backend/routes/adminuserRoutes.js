import express from "express";
import { getAllUsers } from "../controllers/adminuserController.js";
import { protectAdmin, allowRoles } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", protectAdmin, allowRoles("ADMIN", "SUPER_ADMIN"), getAllUsers);





export default router;
