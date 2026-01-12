import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true ONLY in production https
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;
