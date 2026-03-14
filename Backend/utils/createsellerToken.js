import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SELLER_SECRET, { expiresIn: "2d", });

    // set jwt as an HTTP-Only Cookie
    res.cookie('jwtseller', token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return token;
}


export default generateToken;