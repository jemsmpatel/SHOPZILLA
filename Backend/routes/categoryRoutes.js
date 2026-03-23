import express from "express";

// controllers
import {
    createCategory,
    updateCategory,
    getAllCategories,
    getParentCategories,
    deleteCategory,
    toggleCategoryStatus,
    getCategoryById,
} from "../controllers/categoryController.js";

// middlewares
import { protectAdmin, allowRoles } from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// create category
router.post("/", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), createCategory);

// update category
router.put("/:id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), updateCategory);

// get all categories
router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

// get all parent categories
router.get("/parents", getParentCategories);

// delete category
router.delete("/:id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), deleteCategory);

// active / deactive category
router.patch("/status/:id", protectAdmin, allowRoles("STAFF", "ADMIN", "SUPER_ADMIN"), toggleCategoryStatus);

export default router;
