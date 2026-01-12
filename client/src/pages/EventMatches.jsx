import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

export default function EventMatches() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [selfies, setSelfies] = useState([]);

    const fetchMatches = async () => {
        try {
            const res = await api.get(`/fan/event/${eventId}`);
            setSelfies(res.data.selfies || []);
        } catch {
            toast.error("Failed to load matches");
        }
    };

    useEffect(() => {
        fetchMatches();
    }, []);

    return (
        <>
            <Navbar />
            <PageWrapper>
                <div className="min-h-screen pt-36 px-8 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">

                        {/* Header */}
                        <div className="mb-12">
                            <h1 className="text-4xl font-semibold tracking-tight">
                                Event Matches
                            </h1>
                            <button
                                onClick={() => navigate("/")}
                                className="mt-4 border px-6 py-2 rounded-full hover:bg-gray-50"
                            >
                                Back to Dashboard
                            </button>
                        </div>

                        {/* Matches */}
                        <div className="space-y-12 pb-24">
                            {selfies.map((selfie) => (
                                <div
                                    key={selfie._id}
                                    className="bg-white rounded-3xl shadow-xl p-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">

                                        {/* Fan Selfie */}
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Fan Selfie
                                            </p>
                                            <img
                                                src={selfie.imageUrl}
                                                className="rounded-xl shadow-md"
                                            />
                                        </div>

                                        {/* Matches */}
                                        <div className="md:col-span-3">
                                            <p className="text-sm text-gray-500 mb-4">
                                                Matched Photos
                                            </p>

                                            {selfie.matchedImages?.length ? (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {selfie.matchedImages.map((img, i) => (
                                                        <div key={i} className="text-center">
                                                            <img
                                                                src={img.imageUrl}
                                                                className="rounded-xl shadow-md"
                                                            />
                                                            <p className="text-xs mt-1 text-gray-500">
                                                                {img.confidence}%
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-400">
                                                    No strong matches
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}

                            {selfies.length === 0 && (
                                <p className="text-center text-gray-400">
                                    No fans yet
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </PageWrapper>
        </>
    );
}
