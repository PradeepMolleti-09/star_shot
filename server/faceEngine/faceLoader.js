import * as faceapi from "face-api.js";
import "@tensorflow/tfjs";
import path from "path";

let Canvas, Image, ImageData;

// Enable face engine ONLY in local / allowed environments
if (process.env.ENABLE_FACE_ENGINE === "true") {
    const canvasModule = await import("canvas");
    Canvas = canvasModule.Canvas;
    Image = canvasModule.Image;
    ImageData = canvasModule.ImageData;

    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
} else {
    console.log("⚠️ Face engine disabled (canvas not available)");
}

const MODEL_PATH = path.join(
    process.cwd(),
    "faceEngine",
    "models"
);

export const loadFaceModels = async () => {
    if (process.env.ENABLE_FACE_ENGINE !== "true") {
        console.log("🚫 Skipping face model loading");
        return;
    }

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    console.log("🧠 Face AI models loaded (tfjs)");
};
