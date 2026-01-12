import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const startServer = async () => {
    try {
        // 1️⃣ Connect database
        await connectDB();

        // 2️⃣ Start server
        const PORT = process.env.PORT || 10000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

        // 3️⃣ Load Face Engine ONLY if enabled
        if (process.env.ENABLE_FACE_ENGINE === "true") {
            const { initFaceEngine } = await import("./faceEngine/faceLoader.js");
            initFaceEngine();
        }

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
