import express from "express";
import protect from "../middleware/auth.js";
import {
    createEvent,
    getAllEvents,
    getEventById,
    getEventByQR
} from "../controllers/eventController.js";

const router = express.Router();

// FAN
router.get("/qr/:qrCodeId", getEventByQR);

// CAMERAMAN (AUTH REQUIRED)
router.post("/create", protect, createEvent);
router.get("/", protect, getAllEvents);
router.get("/:eventId", protect, getEventById);

export default router;
