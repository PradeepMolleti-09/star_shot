import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Protected from "./components/Protected";

import Home from "./pages/Home";
import Register from "./pages/Register"
import Login from "./pages/Login";
import EventDashboard from "./pages/EventDashboard";
import UploadPhotos from "./pages/UploadPhotos";
import FanUpload from "./pages/FanUpload";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event/:qrCodeId" element={<FanUpload />} />

        <Route
          path="/dashboard"
          element={
            <Protected>
              <EventDashboard />
            </Protected>
          }
        />

        <Route
          path="/upload/:eventId"
          element={
            <Protected>
              <UploadPhotos />
            </Protected>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
