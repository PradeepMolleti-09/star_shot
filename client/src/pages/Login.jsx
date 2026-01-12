import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const location = useLocation(); // ✅ FIXED
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", { email, password });

            login(res.data.user); // ✅ update context first

            const from = location.state?.from || "/dashboard";

            toast.success("Login successful");

            navigate(from, { replace: true }); // ✅ SINGLE NAVIGATION
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <>
            <Navbar />

            <PageWrapper>
                <div className="pt-40 flex justify-center">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-10 rounded-2xl shadow-lg w-96"
                    >
                        <h2 className="text-2xl font-semibold mb-6">Login</h2>

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border px-4 py-2 rounded mb-4"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-4 py-2 rounded mb-6"
                        />

                        <button className="w-full bg-black text-white py-2 rounded-full">
                            Login
                        </button>
                    </form>
                </div>
            </PageWrapper>
        </>
    );
}
