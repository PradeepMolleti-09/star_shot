import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";
import PageSkeleton from "../components/PageSkeleton";

export default function EventDashboard() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [eventName, setEventName] = useState("");
    const [celebrityName, setCelebrityName] = useState("");
    const [loading, setLoading] = useState(false);

    /* ---------------- FETCH EVENTS ---------------- */
    const fetchEvents = async () => {
        try {
            const res = await api.get("/events");
            setEvents(res.data.events || []);
        } catch {
            toast.error("Failed to load events");
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/events");
                setEvents(res.data.events || []);
            } catch {
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <>
                <Navbar />
                <PageSkeleton />
            </>
        );
    }

    /* ---------------- CREATE EVENT ---------------- */
    const handleCreateEvent = async () => {
        if (!eventName || !celebrityName) {
            toast.warning("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            await api.post("/events/create", {
                eventName,
                celebrityName,
            });

            toast.success("Event created successfully");
            setEventName("");
            setCelebrityName("");
            fetchEvents();
        } catch {
            toast.error("Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />


            <PageWrapper>
                <div className="min-h-screen pt-36 px-8 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto">

                        {/* HEADER */}
                        <div className="mb-14">
                            <h1 className="text-5xl font-semibold tracking-tight">
                                Events Dashboard
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Create and manage celebrity events
                            </p>
                        </div>

                        {/* CREATE EVENT CARD */}
                        <div className="bg-white rounded-3xl shadow-xl mb-16 p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

                                {/* FORM */}
                                <div>
                                    <h2 className="text-2xl font-medium mb-6">
                                        Create New Event
                                    </h2>

                                    <input
                                        type="text"
                                        placeholder="Event Name"
                                        className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                                        value={eventName}
                                        onChange={(e) => setEventName(e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Celebrity Name"
                                        className="w-full border rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-black"
                                        value={celebrityName}
                                        onChange={(e) => setCelebrityName(e.target.value)}
                                    />

                                    <button
                                        onClick={handleCreateEvent}
                                        disabled={loading}
                                        className="bg-black text-white px-10 py-3 rounded-full text-lg hover:opacity-90 transition disabled:opacity-50"
                                    >
                                        {loading ? "Creating…" : "Create Event"}
                                    </button>
                                </div>

                                {/* IMAGE */}
                                <div className="hidden md:flex justify-center">
                                    <img
                                        src="/Camera3DImage.jpg"
                                        alt="Event visual"
                                        className="max-w-full max-h-[320px] object-contain rounded-2xl shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* EVENTS GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-24">
                            {events.map((event) => (
                                <div
                                    key={event._id}
                                    className="bg-white rounded-3xl shadow-xl p-6 flex flex-col"
                                >
                                    <h3 className="text-xl font-medium mb-1">
                                        {event.eventName}
                                    </h3>

                                    <p className="text-gray-500 mb-4">
                                        {event.celebrityName}
                                    </p>

                                    <img
                                        src={event.qrCodeImage}
                                        alt="QR Code"
                                        className="w-36 h-36 mx-auto"
                                    />

                                    <p className="text-xs text-gray-400 mt-4 break-all text-center">
                                        {`${window.location.origin}/event/${event.qrCodeId}`}
                                    </p>

                                    <div className="flex justify-between text-sm text-gray-500 mt-6">
                                        <span>Fans: {event.totalFans}</span>
                                        <span>Photos: {event.totalPhotos}</span>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <button
                                        onClick={() => navigate(`/upload/${event._id}`)}
                                        className="mt-4 w-full rounded-full py-2 bg-black text-white hover:bg-gray-900 transition"
                                    >
                                        Upload / View Photos
                                    </button>

                                </div>
                            ))}

                            {events.length === 0 && (
                                <p className="text-gray-400 col-span-full text-center">
                                    No events created yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </PageWrapper>
        </>
    );
}
