import express from 'express';

//controllers
import {
    createUser,
    loginUser,
    logoutCurrentUser,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    request_otp,
    getUserReviews,
} from '../controllers/userController.js';


//middlewares
import { authenticate } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post("/", createUser);


router.post("/request_otp", request_otp);

router.post("/login", loginUser);


router.post("/logout", logoutCurrentUser);


router.route('/profile')
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);

router.get("/reviews", authenticate, getUserReviews);


export default router;