import cloudinary from "../config/cloudinary.js";
import Event from "../models/Event.js";
import FanSelfie from "../models/FanSelfie.js";
import Photo from "../models/Photo.js";

import { extractFaceDescriptors } from "../faceEngine/detectFaces.js";
import { matchFace } from "../faceEngine/matchFaces.js";

/* =================================================
   1️⃣ UPLOAD FAN SELFIE
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

        const upload = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
            { folder: `fan-selfies/${event._id}` }
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
   2️⃣ MATCH FAN SELFIE WITH EVENT PHOTOS
================================================= */
export const matchFanSelfie = async (req, res) => {
    try {
        // 🚫 Face engine disabled in production
        if (process.env.ENABLE_FACE_ENGINE !== "true") {
            return res.status(503).json({
                success: false,
                message: "Face matching is disabled in production",
                matchedImages: []
            });
        }

        const { selfieId } = req.params;

        const selfie = await FanSelfie.findById(selfieId);
        if (!selfie) {
            return res.status(404).json({
                success: false,
                message: "Selfie not found",
            });
        }

        /* 🔍 Extract face from selfie */
        const fanFaces = await extractFaceDescriptors(selfie.imageUrl);

        if (!fanFaces || fanFaces.length !== 1) {
            return res.json({
                success: true,
                matchedImages: [],
            });
        }

        const fanDescriptor = fanFaces[0];

        /* 📸 Fetch event photos */
        const photos = await Photo.find({
            eventId: selfie.eventId,
            isProcessed: true,
            isDeleted: false,
            faceCount: { $gt: 0 },
        });

        const STRONG = 70;
        const GOOD = 55;
        const POSSIBLE = 20;

        const matches = [];

        for (const photo of photos) {
            let bestConfidence = 0;

            for (const face of photo.faceDescriptors) {
                if (!face || face.length !== fanDescriptor.length) continue;

                const distance = matchFace(fanDescriptor, face);
                const confidence = Math.round(
                    Math.max(0, (1 - distance / 0.8)) * 100
                );

                if (confidence > bestConfidence) {
                    bestConfidence = confidence;
                }
            }

            if (bestConfidence >= POSSIBLE) {
                matches.push({
                    imageUrl: photo.imageUrl,
                    confidence: bestConfidence,
                    level:
                        bestConfidence >= STRONG
                            ? "strong"
                            : bestConfidence >= GOOD
                                ? "good"
                                : "possible",
                });
            }
        }

        matches.sort((a, b) => b.confidence - a.confidence);

        return res.json({
            success: true,
            matchedImages: matches,
        });

    } catch (error) {
        console.error("❌ matchFanSelfie error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


/* =================================================
   3️⃣ ADMIN: GET ALL FAN MATCHES FOR EVENT
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
