import express from "express";
import * as faceapi from "face-api.js";
import canvas from "canvas";
import path from "path";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
app.use(express.json({ limit: "10mb" }));

const MODEL_PATH = path.join(process.cwd(), "models");

let modelsLoaded = false;

async function loadModels() {
    if (modelsLoaded) return;

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);

    modelsLoaded = true;
    console.log("🧠 Face models loaded");
}

app.post("/match", async (req, res) => {
    try {
        await loadModels();

        const { selfieUrl, photos } = req.body;

        const selfieImg = await canvas.loadImage(selfieUrl);
        const selfieDetection = await faceapi
            .detectSingleFace(selfieImg)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!selfieDetection) {
            return res.json({ matches: [] });
        }

        const results = [];

        for (const photo of photos) {
            for (const descriptor of photo.faceDescriptors) {
                const distance = faceapi.euclideanDistance(
                    selfieDetection.descriptor,
                    descriptor
                );

                const confidence = Math.round(
                    Math.max(0, (1 - distance / 0.8)) * 100
                );

                if (confidence >= 20) {
                    results.push({
                        imageUrl: photo.imageUrl,
                        confidence
                    });
                }
            }
        }

        results.sort((a, b) => b.confidence - a.confidence);
        res.json({ matches: results });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Face matching failed" });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Face engine running on port ${PORT}`);
});