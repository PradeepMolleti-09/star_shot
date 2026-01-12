import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // 🔥 THIS MAKES EVENTS USER-SPECIFIC
        },
        eventName: String,
        celebrityName: String,
        qrCodeId: String,
        qrCodeImage: String,
        totalFans: { type: Number, default: 0 },
        totalPhotos: { type: Number, default: 0 },
        expiresAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
