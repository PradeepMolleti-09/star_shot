import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // 🔥 THIS IS CRITICAL
        next();          // 🔥 THIS WAS LIKELY MISSING

    } catch (error) {
        console.error("AUTH ERROR:", error.message);
        return res.status(401).json({ message: "Not authorized" });
    }
};

export default protect;
