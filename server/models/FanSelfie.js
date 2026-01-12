import mongoose from "mongoose";

const fanSelfieSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        imageUrl: String,
        faceDescriptor: {
            type: Array,
            default: null
        },
        isMatched: { type: Boolean, default: false },
        matchConfidence: { type: Number, default: 0 },
        expiresAt: {
            type: Date,
            index: { expires: 0 }
        }
    },
    { timestamps: true }
);

export default mongoose.model("FanSelfie", fanSelfieSchema);
