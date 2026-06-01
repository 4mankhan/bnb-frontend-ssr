"use client";

import Image from "next/image";
import { Heart, Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

function HotelCard({ hotel }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const toggleLike = (e) => {
    e.stopPropagation();
    setIsLiking(true);
    setLiked(!liked);
    setTimeout(() => setIsLiking(false), 300);
  };

  // Generate a consistent, stable, realistic price for each hotel based on its ID
  const price = useMemo(() => {
    if (!hotel._id) return 2500;
    const code = hotel._id.toString().slice(-4);
    const parsed = parseInt(code, 16) || 1234;
    return (parsed % 6) * 1200 + 2400;
  }, [hotel._id]);

  // Generate a consistent stable rating
  const rating = useMemo(() => {
    if (!hotel._id) return "4.8";
    const code = hotel._id.toString().slice(-2);
    const parsed = parseInt(code, 16) || 45;
    return (4.3 + (parsed % 7) * 0.1).toFixed(1);
  }, [hotel._id]);

  // Generate a consistent stable reviews count
  const reviewsCount = useMemo(() => {
    if (!hotel._id) return 85;
    const code = hotel._id.toString().slice(-3);
    const parsed = parseInt(code, 16) || 120;
    return (parsed % 180) + 24;
  }, [hotel._id]);

  return (
    <div
      onClick={() => router.push(`/hotel/${hotel._id}`)}
      className="group cursor-pointer flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/60 rounded-2xl p-3 shadow-xs hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700/80 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Photo Container */}
      <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-850 shrink-0">
        <Image
          src={hotel.photos?.[0] || "/fallback.jpg"}
          alt={hotel.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />

        {/* Heart Wishlist Button */}
        <button
          type="button"
          onClick={toggleLike}
          className={`absolute top-2.5 right-2.5 z-10 rounded-full p-2 bg-black/25 backdrop-blur-xs hover:bg-black/35 transition-all outline-none cursor-pointer ${
            isLiking ? "scale-125" : ""
          }`}
          aria-label="Save to wishlist"
        >
          <Heart
            className={`h-4.5 w-4.5 shrink-0 transition-all duration-300 ${
              liked
                ? "text-rose-500 fill-rose-500 scale-110"
                : "text-white hover:text-rose-400"
            }`}
            strokeWidth={liked ? 0 : 2}
          />
        </button>

        {/* Popular Badge */}
        <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-[2px] text-gray-900 dark:text-gray-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs tracking-wider uppercase">
          Popular
        </div>
      </div>

      {/* Info Details */}
      <div className="mt-3.5 flex flex-col flex-1">
        {/* Name & Rating */}
        <div className="flex items-start justify-between gap-2.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-rose-500 transition-colors truncate flex-1">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" strokeWidth={0} />
            <span className="text-xs font-bold text-gray-850 dark:text-gray-200 tabular-nums">{rating}</span>
          </div>
        </div>

        {/* Location & Details */}
        <div className="flex flex-col gap-1 mt-2 flex-1 justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
              <MapPin size={12} className="text-gray-400 shrink-0" />
              <span>{hotel.city}</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium truncate">
              {hotel.contactInfo?.completeAddress || hotel.contactInfo?.location || "Prime location stay"}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-550 font-semibold">
              {reviewsCount} reviews
            </p>
          </div>

          {/* Pricing Row */}
          <div className="pt-3.5 mt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
              Starting from
            </p>
            <p className="text-sm text-gray-950 dark:text-white font-black">
              ₹{price.toLocaleString("en-IN")}
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400"> / night</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hotels({ hotels }) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
