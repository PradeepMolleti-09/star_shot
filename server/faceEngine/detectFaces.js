// server/faceEngine/detectFaces.js

import * as faceapi from "face-api.js";

const MODEL_PATH = "./faceEngine/models";

let modelsLoaded = false;

/**
 * Load face models (LOCAL ONLY)
 */
const loadModels = async () => {
    if (process.env.ENABLE_FACE_ENGINE !== "true") {
        throw new Error("Face engine disabled in production");
    }

    if (modelsLoaded) return;

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    modelsLoaded = true;
    console.log("🧠 Face AI models loaded");
};

/**
 * Extract face descriptors (LOCAL ONLY)
 */
export const extractFaceDescriptors = async (imageUrl) => {
    // 🚫 Render / production
    if (process.env.ENABLE_FACE_ENGINE !== "true") {
        throw new Error("Face engine disabled in production");
    }

    // ✅ canvas imported ONLY when function is called
    const canvasModule = await import("canvas");
    const { Canvas, Image, ImageData, loadImage } = canvasModule;

    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await loadModels();

    const img = await loadImage(imageUrl);

    const detections = await faceapi
        .detectAllFaces(
            img,
            new faceapi.SsdMobilenetv1Options({
                minConfidence: 0.6
            })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

    return detections.map(d => Array.from(d.descriptor));
};
