import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";
import UploadSkeleton from "../components/UploadSkeleton";

export default function UploadPhotos() {
    const { eventId } = useParams();
    const fileInputRef = useRef(null);

    const [event, setEvent] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    /* ================= FETCH EVENT ================= */
    useEffect(() => {
        if (!eventId) return;

        api.get(`/events/${eventId}`)
            .then((res) => setEvent(res.data.event))
            .catch(() => toast.error("Failed to load event"));
    }, [eventId]);

    /* ================= FETCH PHOTOS ================= */
    useEffect(() => {
        if (!eventId) return;

        api.get(`/photos/event/${eventId}`)
            .then((res) => setPhotos(res.data.photos || []))
            .catch(() => toast.error("Failed to load photos"));
    }, [eventId]);

    /* ================= PROGRESS SIMULATION ================= */
    const simulateProcessing = () => {
        let value = 60;

        const interval = setInterval(() => {
            value += Math.random() * 6;

            if (value >= 95) {
                clearInterval(interval);
                setProgress(100);

                setTimeout(() => {
                    setLoading(false);
                    setProgress(0);
                }, 500);
            } else {
                setProgress(Math.floor(value));
            }
        }, 300);
    };

    /* ================= UPLOAD ================= */
    const handleUpload = async () => {
        if (!files.length) {
            toast.warning("Please select photos");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            files.forEach((file) => formData.append("photos", file));

            const res = await api.post(`/photos/upload/${eventId}`, formData, {
                timeout: 300000, // ⏱️ 5 minutes safety
            });

            toast.success(`${res.data.uploaded} photos uploaded`);
            setPhotos((prev) => [...res.data.photos, ...prev]);
            setFiles([]);
        } catch (err) {
            toast.error("Upload failed. Please wait and refresh.");
        } finally {
            setLoading(false);
        }
    };


    /* ================= HARD DELETE ================= */
    const handleDelete = async (photoId) => {
        const previousPhotos = photos;

        // ⚡ Optimistic UI
        setPhotos((prev) => prev.filter((p) => p._id !== photoId));

        try {
            await api.delete(`/photos/${photoId}`);
            toast.success("Photo deleted permanently");
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
            setPhotos(previousPhotos); // rollback
        }
    };

    /* ================= DRAG & DROP ================= */
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = [...e.dataTransfer.files].filter((f) =>
            f.type.startsWith("image/")
        );

        if (droppedFiles.length) {
            setFiles(droppedFiles);
            toast.info(`${droppedFiles.length} photos ready to upload`);
        }
    };

    if (!event) {
        return (
            <>
                <Navbar />
                <UploadSkeleton />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <PageWrapper>
                <div className="pt-32 px-6 max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-10">
                        <h1 className="text-4xl font-semibold tracking-tight">
                            Upload Event Photos
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {event.eventName} · {event.celebrityName}
                        </p>
                    </div>

                    {/* UPLOAD CARD */}
                    <div className="bg-white rounded-3xl shadow-xl p-10 mb-14 grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* IMAGE */}
                        <div className="hidden md:flex justify-center items-center">
                            <img
                                src="/filesUpload.jpg"
                                alt="Upload"
                                className="max-h-[320px] rounded-2xl object-contain"
                            />
                        </div>

                        {/* FORM */}
                        <div className="flex flex-col justify-center">
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
                                    Drag & drop photos here
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    or click to browse
                                </p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    hidden
                                    onChange={(e) =>
                                        setFiles([...e.target.files])
                                    }
                                />
                            </div>

                            {files.length > 0 && (
                                <p className="text-sm text-gray-500 mt-4">
                                    {files.length} photos selected
                                </p>
                            )}

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
                                {loading ? "Uploading…" : "Upload Photos"}
                            </button>
                        </div>
                    </div>

                    {/* PHOTOS GRID */}
                    <h2 className="text-2xl font-medium mb-6">
                        Uploaded Photos ({photos.length})
                    </h2>

                    {photos.length === 0 ? (
                        <p className="text-gray-400">No photos uploaded yet</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-24">
                            {photos.map((photo) => (
                                <div
                                    key={photo._id}
                                    className="relative group"
                                >
                                    <img
                                        src={photo.imageUrl}
                                        alt="Event"
                                        className="rounded-2xl shadow-md object-cover w-full h-60"
                                    />

                                    {/* 🔄 PROCESSING BADGE */}
                                    {!photo.isProcessed && (
                                        <span className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">
                                            Processing…
                                        </span>
                                    )}

                                    <button
                                        onClick={() => handleDelete(photo._id)}
                                        className="absolute top-3 right-3 text-xs px-4 py-1.5 rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PageWrapper>
        </>
    );
}
