import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            toast.warning("All fields are required");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            toast.success("Registration successful");
            navigate("/login");

        } catch (error) {
            toast.error(
                error.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <PageWrapper>

                <div className="pt-40 flex justify-center">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                        <h2 className="text-3xl font-semibold mb-6">Create Account</h2>

                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full border rounded-xl px-4 py-3 mb-4"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border rounded-xl px-4 py-3 mb-4"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border rounded-xl px-4 py-3 mb-6"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full rounded-full py-3 bg-black text-white hover:bg-gray-900 transition"
                        >
                            {loading ? "Creating…" : "Register"}
                        </button>
                    </div>
                </div>

            </PageWrapper>
        </>
    );
}
