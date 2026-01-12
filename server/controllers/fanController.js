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

        // 1️⃣ Get event photos WITH faces
        const photos = await Photo.find({
            eventId: selfie.eventId,
            isDeleted: false,
            faceCount: { $gt: 0 },
        });

        if (!photos.length) {
            return res.json({
                success: true,
                matchedImages: [],
            });
        }

        // 2️⃣ Call face engine
        const response = await axios.post(
            `${process.env.FACE_ENGINE_URL}/match`,
            {
                selfieUrl: selfie.imageUrl,
                photos: photos.map(photo => ({
                    imageUrl: photo.imageUrl,
                    faceDescriptors: photo.faceDescriptors,
                })),
            },
            { timeout: 120000 }
        );

        const engineMatches = response.data.matches || [];

        // 3️⃣ HARD FILTER + BEST MATCH PER PHOTO
        const bestPerPhoto = new Map();

        for (const m of engineMatches) {
            // ❌ HARD REJECTION (MOST IMPORTANT PART)
            if (m.distance > 0.6) continue;
            if (m.confidence < 45) continue;

            const existing = bestPerPhoto.get(m.imageUrl);

            if (!existing || m.confidence > existing.confidence) {
                bestPerPhoto.set(m.imageUrl, m);
            }
        }

        // 4️⃣ FINAL RESULTS
        const finalMatches = Array.from(bestPerPhoto.values())
            .sort((a, b) => b.confidence - a.confidence);

        return res.json({
            success: true,
            matchedImages: finalMatches,
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
