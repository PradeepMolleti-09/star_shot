// faceEngine/detectFaces.js

import * as faceapi from "face-api.js";
import canvas from "canvas";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_PATH = "./faceEngine/models";

let modelsLoaded = false;

export const loadModels = async () => {
    if (modelsLoaded) return;

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    modelsLoaded = true;
    console.log("🧠 Face AI models loaded");
};

export const extractFaceDescriptors = async (imageUrl) => {
    await loadModels();

    const img = await canvas.loadImage(imageUrl);

    const detections = await faceapi
        .detectAllFaces(
            img,
            new faceapi.SsdMobilenetv1Options({
                minConfidence: 0.6   // 🔥 higher = fewer false faces
            })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

    return detections.map(d => Array.from(d.descriptor));
};
