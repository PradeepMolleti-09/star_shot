import Skeleton from "./Skeleton";

export default function PageSkeleton() {
    return (
        <div className="pt-40 max-w-7xl mx-auto px-6">
            {/* Header */}
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96 mb-10" />

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-3xl shadow p-6"
                    >
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-1/2 mb-6" />
                        <Skeleton className="h-32 w-full rounded-xl mb-4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
