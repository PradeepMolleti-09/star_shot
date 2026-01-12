import cloudinary from "../config/cloudinary.js";
import Event from "../models/Event.js";
import Photo from "../models/Photo.js";
import axios from "axios";

const FACE_ENGINE_URL = process.env.FACE_ENGINE_URL;

/* =================================================
   UPLOAD EVENT PHOTOS (ASYNC FACE PROCESSING)
================================================= */
export const uploadEventPhotos = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No photos uploaded",
            });
        }

        const createdPhotos = [];

        for (const file of req.files) {
            // 1️⃣ Upload to Cloudinary
            const cloudRes = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: `events/${event._id}`,
                    width: 1024,
                    height: 1024,
                    crop: "limit",
                    quality: "auto",
                }
            );

            // 2️⃣ Extract faces (WAIT)
            const faceRes = await axios.post(
                `${process.env.FACE_ENGINE_URL}/extract`,
                { imageUrl: cloudRes.secure_url },
                { timeout: 120000 }
            );

            const descriptors = faceRes.data.descriptors || [];

            // 🚫 Skip photos with NO faces
            if (!descriptors.length) {
                await cloudinary.uploader.destroy(cloudRes.public_id);
                continue;
            }

            // 3️⃣ Save ONLY AFTER processing
            const photo = await Photo.create({
                eventId: event._id,
                imageUrl: cloudRes.secure_url,
                cloudinaryId: cloudRes.public_id,
                faceDescriptors: descriptors,
                faceCount: descriptors.length,
                isDeleted: false,
            });

            createdPhotos.push(photo);
        }

        event.totalPhotos += createdPhotos.length;
        await event.save();

        return res.json({
            success: true,
            uploaded: createdPhotos.length,
            photos: createdPhotos,
        });

    } catch (error) {
        console.error("❌ uploadEventPhotos error:", error);
        return res.status(500).json({
            success: false,
            message: "Upload failed",
        });
    }
};


/* =================================================
   BACKGROUND FACE PROCESSING (FACE-ENGINE)
================================================= */
const processFaceAsync = async (photoId, imageUrl) => {
    try {
        if (!FACE_ENGINE_URL) {
            throw new Error("FACE_ENGINE_URL not configured");
        }

        const response = await axios.post(
            `${FACE_ENGINE_URL}/extract`,
            { imageUrl },
            { timeout: 120000 }
        );

        const descriptors = response.data.descriptors || [];

        await Photo.findByIdAndUpdate(photoId, {
            faceDescriptors: descriptors,
            faceCount: descriptors.length,
            isProcessed: true,
        });

        console.log(
            "🧠 Face processed:",
            photoId,
            "faces:",
            descriptors.length
        );

    } catch (error) {
        console.warn(
            "⚠️ Face processing failed:",
            photoId,
            error.message
        );

        await Photo.findByIdAndUpdate(photoId, {
            isProcessed: false,
        });
    }
};

/* =================================================
   GET PHOTOS BY EVENT
================================================= */
export const getPhotosByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const photos = await Photo.find({
            eventId,
            isDeleted: false,
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            photos,
        });

    } catch (error) {
        console.error("❌ getPhotosByEvent error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/* =================================================
   DELETE PHOTO (PERMANENT)
================================================= */
export const deletePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found",
            });
        }

        await cloudinary.uploader.destroy(photo.cloudinaryId);
        await Photo.findByIdAndDelete(photoId);

        await Event.findByIdAndUpdate(photo.eventId, {
            $inc: { totalPhotos: -1 },
        });

        return res.json({
            success: true,
            message: "Photo permanently deleted",
        });

    } catch (error) {
        console.error("❌ deletePhoto error:", error);
        return res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};

/* =================================================
   SOFT DELETE PHOTO
================================================= */
export const softDeletePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({
                success: false,
                message: "Photo not found",
            });
        }

        photo.isDeleted = true;
        photo.deletedAt = new Date();
        await photo.save();

        await Event.findByIdAndUpdate(photo.eventId, {
            $inc: { totalPhotos: -1 },
        });

        return res.json({
            success: true,
            message: "Photo moved to trash",
        });

    } catch (error) {
        console.error("❌ softDeletePhoto error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/* =================================================
   UNDO DELETE PHOTO
================================================= */
export const undoDeletePhoto = async (req, res) => {
    try {
        const { photoId } = req.params;

        const photo = await Photo.findById(photoId);
        if (!photo || !photo.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Invalid photo state",
            });
        }

        photo.isDeleted = false;
        photo.deletedAt = null;
        await photo.save();

        await Event.findByIdAndUpdate(photo.eventId, {
            $inc: { totalPhotos: 1 },
        });

        return res.json({
            success: true,
            message: "Photo restored",
        });

    } catch (error) {
        console.error("❌ undoDeletePhoto error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
