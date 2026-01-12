import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

export default function CreateEvent() {
    const [eventName, setEventName] = useState("");
    const [celebrityName, setCelebrityName] = useState("");
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCreateEvent = async () => {
        if (!eventName || !celebrityName) {
            toast.warning("Please fill all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post("/events/create", {
                eventName,
                celebrityName,
            });

            setQrData(res.data.event);
            toast.success("Event created successfully");

        } catch (error) {
            toast.error("Failed to create event");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <PageWrapper>
                <div className="min-h-screen pt-36 px-6 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl p-10">

                        {/* Title */}
                        <h1 className="text-4xl font-semibold text-center mb-10">
                            Create Event
                        </h1>

                        {/* Event Name */}
                        <input
                            type="text"
                            placeholder="Event Name"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />

                        {/* Celebrity Name */}
                        <input
                            type="text"
                            placeholder="Celebrity Name"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
                            value={celebrityName}
                            onChange={(e) => setCelebrityName(e.target.value)}
                        />

                        {/* Create Button */}
                        <button
                            onClick={handleCreateEvent}
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-full text-lg hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Creating…" : "Create Event"}
                        </button>

                        {/* QR Code Section */}
                        {qrData && (
                            <div className="mt-12 text-center">
                                <h2 className="text-xl font-medium mb-4">
                                    Scan QR Code
                                </h2>

                                <img
                                    src={qrData.qrCodeImage}
                                    alt="QR Code"
                                    className="mx-auto w-52 h-52"
                                />

                                <p className="text-sm text-gray-500 mt-4 break-all">
                                    {`${window.location.origin}/event/${qrData.qrCodeId}`}
                                </p>

                                <p className="text-xs text-gray-400 mt-2">
                                    Share this link or QR with fans
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </PageWrapper>
        </>
    );
}
