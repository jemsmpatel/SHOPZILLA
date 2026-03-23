import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import Admin from "../models/Admin.js";

// ================= PROTECT ADMIN =================
const protectAdmin = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.jwtadmin) {
        token = req.cookies.jwtadmin;
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, admin token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        req.admin = await Admin.findById(decoded.adminId).select("-password");

        if (!req.admin || !req.admin.isActive) {
            res.status(401);
            throw new Error("Admin not authorized or inactive");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid admin token");
    }
});

// ================= SUPER ADMIN ONLY =================
const superAdmin = (req, res, next) => {
    if (req.admin && req.admin.role === "SUPER_ADMIN") {
        next();
    } else {
        res.status(403);
        throw new Error("Super admin access required");
    }
};

// ================= Allow Roles  =================
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            res.status(403);
            throw new Error("Access denied");
        }
        next();
    };
};

export { protectAdmin, allowRoles };
