import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { initFaceEngine } from "./faceEngine/faceLoader.js";

const startServer = async () => {
    try {
        // 1️⃣ Connect database (required)
        await connectDB();

        // 2️⃣ Start server FIRST (critical for Render)
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // 3️⃣ Initialize Face AI (NON-BLOCKING)
        // Disabled automatically on Render
        initFaceEngine();

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
