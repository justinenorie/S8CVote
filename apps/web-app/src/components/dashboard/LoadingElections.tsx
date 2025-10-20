export default function LoadingElections() {
  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-6 break-inside-avoid">
            <div className="animate-pulse rounded-xl border bg-gray-200 p-4">
              <div className="mb-3 h-6 rounded bg-gray-300"></div>
              <div className="mb-4 space-y-2">
                <div className="animate-pulse rounded-md border p-3 transition hover:bg-gray-300">
                  <div className="mb-2 h-4 rounded bg-gray-300"></div>
                  <div className="flex flex-row items-center justify-between text-gray-500">
                    <div className="h-4 rounded bg-gray-300"></div>
                    <div className="h-4 rounded bg-gray-300"></div>
                  </div>
                  <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-300">
                    <div className="h-full bg-gray-400 transition-all"></div>
                  </div>
                </div>
                <div className="animate-pulse rounded-md border p-3 transition hover:bg-gray-300">
                  <div className="mb-2 h-4 rounded bg-gray-300"></div>
                  <div className="flex flex-row items-center justify-between text-gray-500">
                    <div className="h-4 rounded bg-gray-300"></div>
                    <div className="h-4 rounded bg-gray-300"></div>
                  </div>
                  <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-300">
                    <div className="h-full bg-gray-400 transition-all"></div>
                  </div>
                </div>
              </div>
              <button
                className="h-10 w-full animate-pulse rounded bg-gray-300"
                disabled
              ></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
