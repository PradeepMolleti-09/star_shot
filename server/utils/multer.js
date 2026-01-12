import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB PER FILE
        files: 500
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only images are allowed"), false);
        } else {
            cb(null, true);
        }
    }
});

export default upload;
