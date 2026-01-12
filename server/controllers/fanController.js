import cloudinary from "../config/cloudinary.js";
import Event from "../models/Event.js";
import FanSelfie from "../models/FanSelfie.js";
import Photo from "../models/Photo.js";
import axios from "axios";

/* =================================================
   1️⃣ UPLOAD FAN SELFIE
   POST /api/fan/upload/:qrCodeId
================================================= */
export const uploadFanSelfie = async (req, res) => {
    try {
        const { qrCodeId } = req.params;

        const event = await Event.findOne({ qrCodeId });
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Invalid QR code",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Selfie image is required",
            });
        }

        // Upload selfie to Cloudinary
        const upload = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            {
                folder: `fan-selfies/${event._id}`,
            }
        );

        const selfie = await FanSelfie.create({
            eventId: event._id,
            imageUrl: upload.secure_url,
        });

        event.totalFans += 1;
        await event.save();

        return res.status(201).json({
            success: true,
            selfieId: selfie._id,
        });

    } catch (error) {
        console.error("❌ uploadFanSelfie error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/* =================================================
   2️⃣ MATCH FAN SELFIE (PRODUCTION – RAILWAY)
   GET /api/fan/match/:selfieId
================================================= */
export const matchFanSelfie = async (req, res) => {
    try {
        const { selfieId } = req.params;

        if (!process.env.FACE_ENGINE_URL) {
            return res.status(500).json({
                success: false,
                message: "Face engine URL not configured",
            });
        }

        const selfie = await FanSelfie.findById(selfieId);
        if (!selfie) {
            return res.status(404).json({
                success: false,
                message: "Selfie not found",
            });
        }

        // Fetch processed photos for the event
        const photos = await Photo.find({
            eventId: selfie.eventId,
            isProcessed: true,
            isDeleted: false,
            faceCount: { $gt: 0 },
        });

        if (!photos.length) {
            return res.json({
                success: true,
                matchedImages: [],
            });
        }

        // Call Railway Face Engine
        const response = await axios.post(
            `${process.env.FACE_ENGINE_URL}/match`,
            {
                selfieUrl: selfie.imageUrl,
                photos: photos.map(photo => ({
                    imageUrl: photo.imageUrl,
                    faceDescriptors: photo.faceDescriptors,
                })),
            },
            {
                timeout: 120000, // ⏱️ 2 minutes (models load time)
            }
        );

        return res.json({
            success: true,
            matchedImages: response.data.matches || [],
        });

    } catch (error) {
        console.error("❌ matchFanSelfie error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Face matching failed",
        });
    }
};

/* =================================================
   3️⃣ ADMIN – GET ALL FAN SELFIES FOR EVENT
   GET /api/fan/event/:eventId
================================================= */
export const getEventMatches = async (req, res) => {
    try {
        const { eventId } = req.params;

        const selfies = await FanSelfie.find({ eventId })
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            selfies,
        });

    } catch (error) {
        console.error("❌ getEventMatches error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
