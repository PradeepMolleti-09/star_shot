import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="pt-40 text-center text-gray-500">
                Checking authentication…
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}
