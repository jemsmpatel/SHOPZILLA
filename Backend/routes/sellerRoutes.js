import express from 'express';

//controllers
import {
    createUser,
    loginUser,
    logoutCurrentUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    getSellerOrders,
    shipOrderItem,
    getSellerShippedOrders,
    getSellerOrderHistory,
    getSellerPlacedOrders,
    confirmOrderItem,
    markItemDelivered,
    getSellerDashboard,
    getSellerByRetryToken,
    updateRejectedSeller,
    forgotPassword,
    resetPassword,
    changePassword,
} from '../controllers/sellerController.js';


//middlewares
import { sellerauthenticate } from '../middlewares/authMiddleware.js'


const router = express.Router();

router.post("/", createUser);


router.post("/login", loginUser);


router.post("/logout", logoutCurrentUser);

router.get("/retry/:token", getSellerByRetryToken);
router.put("/retry/:token", updateRejectedSeller);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/change-password", sellerauthenticate, changePassword);

router.route('/profile')
    .get(sellerauthenticate, getCurrentUserProfile)
    .put(sellerauthenticate, updateCurrentUserProfile);

router.get("/dashboard", sellerauthenticate, getSellerDashboard);

router.put("/orders/confirm/:id", sellerauthenticate, confirmOrderItem);
router.get("/orders/placed", sellerauthenticate, getSellerPlacedOrders);
router.get("/orders/pending", sellerauthenticate, getSellerOrders);
router.put("/orders/ship/:item_id", sellerauthenticate, shipOrderItem);
router.get("/orders/shipped", sellerauthenticate, getSellerShippedOrders);
router.get("/orders/history", sellerauthenticate, getSellerOrderHistory);
router.put("/orders/:itemId/delivered", sellerauthenticate, markItemDelivered);

export default router;