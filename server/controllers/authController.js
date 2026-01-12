import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ DO NOT HASH HERE
        const user = await User.create({
            name,
            email,
            password, // plain password
        });

        generateToken(res, user._id);

        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("❌ Register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateToken(res, user._id);

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.json({ success: true });
};

/* ================= ME ================= */
export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};
