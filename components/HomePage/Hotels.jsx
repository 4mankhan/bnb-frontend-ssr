"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import Pagination from "@/components/HomePage/Pagination";
import { useRouter } from "next/navigation";

function Hotels({ hotels }) {
 const router = useRouter();
    
  return (
    <div>
      <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="group cursor-pointer"
            onClick={() => router.push(`/hotel/${hotel._id}`)}
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={hotel.photos?.[0] || "/fallback.jpg"} //
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 rounded-full p-1.5 sm:p-2 bg-black/30 backdrop-blur-[2px] text-white hover:bg-black/45 hover:scale-110 active:scale-95 transition-transform"
                aria-label="Save to wishlist"
              >
                <Heart
                  className="h-4 w-4 sm:h-4.5 sm:w-4.5 shrink-0"
                  strokeWidth={2}
                  fill="currentColor"
                  aria-hidden
                />
              </button>

              <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                Popular
              </div>
            </div>

            <div className="mt-3 space-y-0.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {hotel.name}
                </h3>

                <div className="flex text-gray-500 dark:text-gray-400 items-center gap-0.5 sm:gap-1 shrink-0">
                  <Star
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-amber-500"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="text-sm font-medium tabular-nums">4.8</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hotel.city}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hotel.contactInfo?.location}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                120 reviews
              </p>

              <p className="text-sm text-gray-900 dark:text-gray-100 pt-1">
                <span className="font-semibold">₹5,000</span>
                <span className="text-gray-700 dark:text-gray-300"> night</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
