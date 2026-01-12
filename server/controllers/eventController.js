import Event from "../models/Event.js";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

/**
 * =========================
 * CREATE EVENT (USER-SPECIFIC)
 * POST /api/events/create
 * =========================
 */
export const createEvent = async (req, res) => {
    try {
        const { eventName, celebrityName } = req.body;

        if (!eventName || !celebrityName) {
            return res.status(400).json({
                success: false,
                message: "Event name and celebrity name are required",
            });
        }

        const qrCodeId = uuidv4();
        const qrUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/event/${qrCodeId}`;
        const qrCodeImage = await QRCode.toDataURL(qrUrl);

        const event = await Event.create({
            owner: req.user._id, // 🔥 LINK EVENT TO USER
            eventName,
            celebrityName,
            qrCodeId,
            qrCodeImage,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        return res.status(201).json({
            success: true,
            event,
        });
    } catch (error) {
        console.error("❌ createEvent error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * ==================================
 * GET EVENT BY QR CODE (FAN SIDE)
 * GET /api/events/qr/:qrCodeId
 * ==================================
 */
export const getEventByQR = async (req, res) => {
    try {
        const { qrCodeId } = req.params;

        const event = await Event.findOne({ qrCodeId });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired QR code",
            });
        }

        if (event.expiresAt && event.expiresAt < new Date()) {
            return res.status(410).json({
                success: false,
                message: "Event has expired",
            });
        }

        return res.json({
            success: true,
            event: {
                eventName: event.eventName,
                celebrityName: event.celebrityName,
                qrCodeId: event.qrCodeId,
            },
        });
    } catch (error) {
        console.error("❌ getEventByQR error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * =========================
 * GET LOGGED-IN USER EVENTS
 * GET /api/events
 * =========================
 */
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            events,
        });
    } catch (error) {
        console.error("❌ getAllEvents error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * =========================
 * GET EVENT BY ID (OWNER ONLY)
 * GET /api/events/:eventId
 * =========================
 */
export const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findOne({
            _id: eventId,
            owner: req.user._id, // 🔐 SECURITY
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.json({
            success: true,
            event,
        });
    } catch (error) {
        console.error("❌ getEventById error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
