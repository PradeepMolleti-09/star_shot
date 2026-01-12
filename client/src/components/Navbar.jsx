import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // 🔥 Detect fan page (public QR page)
    const isFanPage = location.pathname.startsWith("/event/");

    const handleLogout = async () => {
        await logout();
        navigate("/", { replace: true }); // 🔥 FORCE HOME
    };

    // ⏳ Prevent auth flicker
    if (loading) {
        return (
            <nav className="fixed top-0 w-full z-50 bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-xl" />
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed top-0 w-full z-50 backdrop-blur bg-white/70 border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-semibold scale-x-110"
                >
                    StarShot
                </Link>

                {/* Right side */}

                {isFanPage && <h1>AI Powered Photo Recognition </h1>}

                {user && !isFanPage ? (
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-600 border border-black rounded-full px-4 py-1 hover:text-white hover:bg-black transition"
                    >
                        Logout
                    </button>
                ) : !user ? (
                    <div className="flex gap-6 text-sm">
                        <Link
                            to="/login"
                            className="text-gray-600 hover:text-black transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="text-gray-600 hover:text-black transition"
                        >
                            Get Started
                        </Link>
                    </div>
                ) : null}
            </div>
        </nav>
    );
}
