import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔥 VERY IMPORTANT FIX
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await api.get("/auth/me");
                setUser(res.data.user);
            } catch (err) {
                // ❗ DO NOT REDIRECT
                // ❗ DO NOT TOAST
                // ❗ DO NOT TREAT AS ERROR
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMe();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
