import Skeleton from "./Skeleton";

export default function FanSkeleton() {
    return (
        <div className="pt-40 flex justify-center px-6">
            <div className="bg-white rounded-3xl shadow p-10 w-full max-w-md">
                <Skeleton className="h-6 w-40 mb-6" />
                <Skeleton className="h-40 w-full mb-4 rounded-xl" />
                <Skeleton className="h-10 w-full rounded-full" />
            </div>
        </div>
    );
}
