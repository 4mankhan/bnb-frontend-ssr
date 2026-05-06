import { Suspense } from "react";
import HomeContent from "../components/HomePage/HomeContent";

function HomeFallback() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="sticky top-0 z-50 h-16 sm:h-20 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800/80 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
