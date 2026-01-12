import express from "express";
import upload from "../utils/multer.js";
import {
    uploadEventPhotos,
    deletePhoto,
    softDeletePhoto,
    undoDeletePhoto,
    getPhotosByEvent
} from "../controllers/photoController.js";

import protect from "../middleware/auth.js";

const router = express.Router();

/* UPLOAD MANY PHOTOS */
router.post(
    "/upload/:eventId",
    protect,
    upload.array("photos", 500),
    uploadEventPhotos
);

/* FETCH PHOTOS */
router.get("/event/:eventId", protect, getPhotosByEvent);

/* DELETE */
router.patch("/soft-delete/:photoId", protect, softDeletePhoto);
router.patch("/undo-delete/:photoId", protect, undoDeletePhoto);
router.delete("/:photoId", protect, deletePhoto);

export default router;
