import * as faceapi from "face-api.js";
import "@tensorflow/tfjs";
import path from "path";

let faceEngineReady = false;

const MODEL_PATH = path.join(
    process.cwd(),
    "faceEngine",
    "models"
);

/**
 * Initialize face engine (LOCAL ONLY)
 * Safe for Render
 */
export const initFaceEngine = async () => {
    // 🚫 Disable on Render / production
    if (process.env.ENABLE_FACE_ENGINE !== "true") {
        console.log("⚠️ Face engine disabled (production)");
        return;
    }

    // ✅ canvas imported ONLY inside function
    const canvasModule = await import("canvas");
    const { Canvas, Image, ImageData } = canvasModule;

    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    faceEngineReady = true;
    console.log("🧠 Face AI models loaded");
};

export const isFaceEngineReady = () => faceEngineReady;
