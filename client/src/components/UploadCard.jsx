export default function UploadCard({ onFileChange, onSubmit, loading }) {
    return (
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10 max-w-md w-full transition-all">
            <h2 className="text-2xl font-semibold text-center">
                Upload your selfie
            </h2>

            <p className="text-gray-500 text-center mt-3">
                Make sure your face is clearly visible and well lit.
            </p>

            <input
                type="file"
                accept="image/*"
                className="mt-8 w-full text-sm file:bg-black file:text-white file:px-6 file:py-2 file:rounded-full file:border-0 file:cursor-pointer"
                onChange={onFileChange}
            />

            <button
                onClick={onSubmit}
                disabled={loading}
                className="mt-8 w-full bg-black text-white py-4 rounded-full text-lg hover:opacity-90 transition disabled:opacity-50"
            >
                {loading ? "Processing…" : "Continue"}
            </button>
        </div>
    );
}
