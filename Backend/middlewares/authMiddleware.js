import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from './asyncHandler.js';
import Seller from '../models/Seller.js';

// Check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwtuser;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, token failed.")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token")
    }

});

const sellerauthenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwtseller;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SELLER_SECRET);
            req.user = await Seller.findById(decoded.userId).select('-password');
            next();

        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, token failed.")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token")
    }

});

// check if the user is admin or not
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        res.status(401).send("Not authorized as an admin");
    }
};

export { authenticate, sellerauthenticate, authorizeAdmin };
