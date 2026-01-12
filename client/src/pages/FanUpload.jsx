import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ResultGrid from "../components/ResultGrid";
import { api } from "../services/api";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

export default function FanUpload() {
    const { qrCodeId } = useParams();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    /* ---------------- UPLOAD HANDLER ---------------- */
    const handleUpload = async () => {
        if (!file) {
            toast.warning("Please upload a clear selfie");
            return;
        }

        if (!qrCodeId) {
            toast.error("Invalid QR code");
            return;
        }

        try {
            setLoading(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("selfie", file);

            toast.info("Uploading selfie…");

            const uploadRes = await api.post(
                `/fan/upload/${qrCodeId}`,
                formData,
                {
                    onUploadProgress: (e) => {
                        if (!e.total) return;
                        setProgress(Math.round((e.loaded * 60) / e.total));
                    }
                }
            );

            toast.info("Matching your photos…");

            const selfieId = uploadRes.data.selfieId;

            let matchRes;
            try {
                matchRes = await api.get(`/fan/match/${selfieId}`);
            } catch (err) {
                // 🟡 Face engine disabled in production
                if (err.response?.status === 503) {
                    toast.info("Face matching is disabled in production demo");
                    setResults([]);
                    setProgress(100);
                    return;
                }
                throw err; // other errors go to outer catch
            }

            setProgress(100);

            if (matchRes.data.matchedImages.length === 0) {
                toast.info("No strong matches found");
            } else {
                toast.success("Your photos are ready!");
            }

            setResults(matchRes.data.matchedImages);


        } catch (error) {
            toast.error(
                error.response?.data?.message || "Selfie upload failed"
            );
        } finally {
            setLoading(false);
            setTimeout(() => setProgress(0), 500);
        }
    };

    /* ---------------- DRAG & DROP ---------------- */
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = [...e.dataTransfer.files].find(f =>
            f.type.startsWith("image/")
        );

        if (droppedFile) {
            setFile(droppedFile);
            toast.info("Selfie selected");
        }
    };

    return (
        <>
            <Navbar />
            <Hero />

            <PageWrapper>

                {!results.length && (
                    <div className="pt-20 px-6 max-w-6xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">

                            {/* LEFT IMAGE */}
                            <div className="hidden md:flex justify-center items-center">
                                <img
                                    src="/filesUpload.jpg"
                                    alt="Fan upload"
                                    className="max-h-[320px] object-contain rounded-2xl"
                                />
                            </div>

                            {/* RIGHT FORM */}
                            <div className="flex flex-col justify-center">

                                <h2 className="text-2xl font-semibold tracking-tight mb-2">
                                    Upload Your Selfie
                                </h2>

                                <p className="text-gray-500 mb-6">
                                    Upload a clear photo of your face to find your moments
                                </p>

                                {/* DROP ZONE */}
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
                                    ${isDragging ? "border-black bg-gray-50" : "border-gray-300"}
                                `}
                                >
                                    <p className="text-lg font-medium">
                                        Drag & drop selfie here
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        or click to browse
                                    </p>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            setFile(e.target.files[0])
                                        }
                                    />
                                </div>

                                {file && (
                                    <p className="text-sm text-gray-500 mt-4">
                                        Selected: {file.name}
                                    </p>
                                )}

                                {/* PROGRESS BAR */}
                                {loading && (
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4 overflow-hidden">
                                        <div
                                            className="bg-black h-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="mt-6 w-full rounded-full py-3 bg-black text-white hover:bg-gray-900 transition"
                                >
                                    {loading ? "Processing…" : "Find My Photos"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* RESULTS */}
                {results.length > 0 && (
                    <ResultGrid images={results} />
                )}

            </PageWrapper>
        </>
    );
}
