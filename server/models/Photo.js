import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },
        imageUrl: String,

        cloudinaryId: {   // 🔥 REQUIRED
            type: String,
            required: true
        },

        faceDescriptors: {
            type: [Array],
            default: []
        },
        isProcessed: { type: Boolean, default: false },
        faceCount: { type: Number, default: 0 },

        // ❌ KEEP THESE OPTIONAL (not used for hard delete)
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },

    },
    { timestamps: true }
);

export default mongoose.model("Photo", photoSchema);
