import express from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
} from "../controllers/cartController.js";

import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.route("/")
    .get(authenticate, getCart)
    .post(authenticate, addToCart)

router.route("/:productId")
    .put(authenticate, updateCartItem)
    .delete(authenticate, removeCartItem);

export default router;