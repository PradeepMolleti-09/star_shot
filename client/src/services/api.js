import axios from "axios";

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    withCredentials: true,
    timeout: 120000, // ⏱ 2 minutes
});
