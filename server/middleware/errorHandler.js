export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return;
    }

    console.error("❌ Global Error:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Server error",
    });
};
