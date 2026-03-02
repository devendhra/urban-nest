export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading Urban Nest...</p>
            </div>
        </div>
    );
}
