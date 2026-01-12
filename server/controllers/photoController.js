import cloudinary from "../config/cloudinary.js";
import Event from "../models/Event.js";
import Photo from "../models/Photo.js";
import { extractFaceDescriptors } from "../faceEngine/detectFaces.js";

export const uploadEventPhotos = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (!req.files?.length) {
            return res.status(400).json({ success: false, message: "No photos uploaded" });
        }

        const createdPhotos = [];

        for (const file of req.files) {
            const cloudRes = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                { folder: `events/${event._id}` }
            );

            // ✅ Save FIRST (FAST)
            const photo = await Photo.create({
                eventId: event._id,
                imageUrl: cloudRes.secure_url,
                cloudinaryId: cloudRes.public_id,
                isProcessed: true,   // 🔥 NOT READY YET
                faceDescriptors: [],
                faceCount: 0,
                isDeleted: false,
            });


            createdPhotos.push(photo);

            // 🔥 BACKGROUND FACE PROCESSING (NO AWAIT)
            processFaceAsync(photo._id, cloudRes.secure_url);
        }

        event.totalPhotos += createdPhotos.length;
        await event.save();

        // ✅ RESPOND IMMEDIATELY
        return res.json({
            success: true,
            uploaded: createdPhotos.length,
            photos: createdPhotos,
        });

    } catch (err) {
        console.error("❌ uploadEventPhotos error:", err);
        return res.status(500).json({ success: false, message: "Upload failed" });
    }
};


const processFaceAsync = async (photoId, imageUrl) => {
    try {
        const descriptors = await extractFaceDescriptors(imageUrl);

        await Photo.findByIdAndUpdate(photoId, {
            faceDescriptors: descriptors,
            faceCount: descriptors.length,
            isProcessed: true,
        });

        console.log("🧠 Face processed:", photoId);
    } catch (err) {
        console.warn("⚠️ Face processing failed:", photoId, err.message);
    }
};

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

        // 🔥 Cloudinary delete (SAFE)
        await cloudinary.uploader.destroy(photo.cloudinaryId);

        // 🔥 DB delete
        await Photo.findByIdAndDelete(photoId);

        // 🔥 Update event count safely
        await Event.findByIdAndUpdate(photo.eventId, {
            $inc: { totalPhotos: -1 },
        });

        res.json({
            success: true,
            message: "Photo permanently deleted",
        });
    } catch (error) {
        console.error("❌ deletePhoto error:", error);
        res.status(500).json({
            success: false,
            message: "Delete failed",
        });
    }
};


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

        // decrease count
        await Event.findByIdAndUpdate(photo.eventId, {
            $inc: { totalPhotos: -1 },
        });

        res.json({
            success: true,
            message: "Photo moved to trash",
        });
    } catch (error) {
        console.error("❌ softDeletePhoto error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


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

        res.json({
            success: true,
            message: "Photo restored",
        });
    } catch (error) {
        console.error("❌ undoDeletePhoto error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getPhotosByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const photos = await Photo.find({
            eventId,
            isDeleted: false,
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            photos,
        });
    } catch (error) {
        console.error("❌ getPhotosByEvent error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


