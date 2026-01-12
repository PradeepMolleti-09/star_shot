import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";

export default function Home() {
    const { user } = useAuth();

    // 🔒 If logged in → dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Navbar />
            <PageWrapper>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 pt-32">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

                        {/* LEFT — TEXT */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
                                Capture.
                                <br />
                                Match.
                                <br />
                                <span className="text-gray-400">
                                    Relive Moments.
                                </span>
                            </h1>

                            <p className="mt-6 text-lg text-gray-600 max-w-md">
                                StarShot uses AI face recognition to help fans
                                find their photos instantly from live events.
                            </p>

                            {/* CTA */}
                            <div className="mt-10 flex gap-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-3 rounded-full bg-black text-white text-sm hover:opacity-90 transition"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    to="/login"
                                    className="px-8 py-3 rounded-full border border-gray-300 text-sm hover:bg-gray-100 transition"
                                >
                                    Login
                                </Link>
                            </div>
                        </motion.div>

                        {/* RIGHT — IMAGE / VISUAL */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className="hidden md:flex justify-center"
                        >
                            <img
                                src="/HomeHero.jpg"
                                alt="StarShot AI"
                                className="max-w-full max-h-[420px] object-contain rounded-sm"
                            />
                        </motion.div>
                    </div>
                </div>
            </PageWrapper>
        </>
    );
}
