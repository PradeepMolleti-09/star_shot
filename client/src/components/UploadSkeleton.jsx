import Skeleton from "./Skeleton";

export default function UploadSkeleton() {
    return (
        <div className="pt-40 max-w-4xl mx-auto px-6">
            <Skeleton className="h-8 w-72 mb-6" />

            <div className="bg-white rounded-3xl shadow p-10 grid md:grid-cols-2 gap-10">
                <Skeleton className="h-64 w-full rounded-2xl" />

                <div>
                    <Skeleton className="h-5 w-48 mb-4" />
                    <Skeleton className="h-32 w-full mb-6 rounded-xl" />
                    <Skeleton className="h-10 w-full rounded-full" />
                </div>
            </div>
        </div>
    );
}
