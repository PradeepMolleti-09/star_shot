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

/* ---------------- CORE MIDDLEWARE ---------------- */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

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
