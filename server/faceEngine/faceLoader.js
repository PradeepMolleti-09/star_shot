import * as faceapi from "face-api.js";
import "@tensorflow/tfjs";
import canvas from "canvas";
import path from "path";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = path.join(
    process.cwd(),
    "faceEngine",
    "models"
);

export const loadFaceModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    console.log("🧠 Face AI models loaded (tfjs pure JS)");
};
