import express from "express";
import upload from "../utils/multer.js";
import {
    uploadFanSelfie,
    matchFanSelfie,
    getEventMatches
} from "../controllers/fanController.js";

const router = express.Router();

router.post(
    "/upload/:qrCodeId",
    upload.single("selfie"),
    uploadFanSelfie
);

router.get(
    "/match/:selfieId",
    matchFanSelfie
);


router.get(
    "/event/:eventId",
    getEventMatches
);

export default router;
