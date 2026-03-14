import jwt from "jsonwebtoken";

const createAdminToken = (res, adminId) => {
    const token = jwt.sign(
        { adminId },
        process.env.JWT_ADMIN_SECRET,
        {
            expiresIn: "1d",
        }
    );

    res.cookie("jwtadmin", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
};

export default createAdminToken;
