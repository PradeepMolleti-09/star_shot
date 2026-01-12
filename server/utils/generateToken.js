import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,          // REQUIRED for HTTPS (Vercel + Render)
        sameSite: "none",      // REQUIRED for cross-site cookies
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export default generateToken;
