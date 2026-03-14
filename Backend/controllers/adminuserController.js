import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";


// ================= GET ALL USERS =================
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
        .select("-password") // hide password
        .sort({ createdAt: -1 });

    res.status(200).json({
        count: users.length,
        users,
    });
});

export { getAllUsers };