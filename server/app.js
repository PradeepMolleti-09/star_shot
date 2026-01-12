import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import fanRoutes from "./routes/fanRoutes.js";

import { limiter, secureHeaders } from "./middleware/security.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/* ---------------- CORS CONFIG (VERY IMPORTANT) ---------------- */
const allowedOrigins = [
    "http://localhost:5173",
    "https://star-shot-sand.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow Postman, server-to-server requests
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

/* ---------------- CORE MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/fan", fanRoutes);

/* ---------------- SECURITY ---------------- */
app.use(secureHeaders);
app.use(limiter);

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorHandler);

export default app;
