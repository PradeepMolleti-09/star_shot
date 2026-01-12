export default function ResultGrid({ images }) {

    // ✅ CLEAN VALID IMAGES FIRST
    const validImages = (images || []).filter(
        img => img?.imageUrl && typeof img.imageUrl === "string"
    );

    const handleDownload = async (url, index) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `StarShot_${index + 1}.jpg`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(link.href);
        } catch {
            alert("Download failed. Please try again.");
        }
    };

    // ⛔ EMPTY STATE
    if (validImages.length === 0) {
        return (
            <div className="pt-32 text-center text-gray-400">
                No photos matched your selfie
            </div>
        );
    }

    return (
        <div className="px-6 max-w-7xl mx-auto pt-24 pb-24">

            {/* ✅ CORRECT COUNT */}
            <h2 className="text-3xl font-semibold tracking-tight mb-2 text-center">
                Your Photos ✨
            </h2>

            <p className="text-center text-gray-500 mb-10">
                {validImages.length} photo{validImages.length > 1 ? "s" : ""} found
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {validImages.map((img, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-3xl shadow-xl overflow-hidden group"
                    >
                        {/* IMAGE */}
                        <div className="relative">
                            <img
                                src={img.imageUrl}
                                alt="Matched"
                                className="w-full h-80 object-cover"
                                onError={(e) => {
                                    console.warn(
                                        "⚠️ Skipping failed image:",
                                        img.imageUrl
                                    );
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                            {/* CONFIDENCE */}
                            <span className="absolute top-4 left-4 bg-black text-white text-xs px-4 py-1.5 rounded-full">
                                {img.confidence}% Match
                            </span>
                        </div>

                        {/* ACTION */}
                        <div className="p-4 flex justify-center">
                            <button
                                onClick={() =>
                                    handleDownload(img.imageUrl, index)
                                }
                                className="px-6 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
