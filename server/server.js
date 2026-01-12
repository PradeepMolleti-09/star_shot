import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { loadFaceModels } from "./faceEngine/faceLoader.js";

const startServer = async () => {
    try {
        // Connect DB
        await connectDB();

        // Load Face AI models
        await loadFaceModels();

        const PORT = process.env.PORT || 9000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
