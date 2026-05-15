"use client";

import { useTheme } from "@/utils/Theme/ThemeProvider";

function HotelCardSkeleton() {
  const { dark } = useTheme();

  const bgPrimary = dark ? "bg-slate-800" : "bg-slate-100";
  const bgSecondary = dark ? "bg-slate-700" : "bg-slate-200";

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        dark
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Hotel image */}
      <div className={`h-48 w-full animate-pulse ${bgSecondary}`} />

      <div className="space-y-4 p-4 animate-pulse">
        {/* Hotel name */}
        <div className={`h-5 w-3/4 rounded-md ${bgSecondary}`} />

        {/* Location */}
        <div className={`h-4 w-1/2 rounded-md ${bgPrimary}`} />

        {/* Rating + reviews */}
        <div className="flex items-center gap-2">
          <div className={`h-4 w-16 rounded-md ${bgPrimary}`} />
          <div className={`h-4 w-12 rounded-md ${bgPrimary}`} />
        </div>

        {/* Amenities */}
        <div className="flex gap-2">
          <div className={`h-8 w-20 rounded-full ${bgPrimary}`} />
          <div className={`h-8 w-24 rounded-full ${bgPrimary}`} />
        </div>

        {/* Price + button */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-2">
            <div className={`h-5 w-20 rounded-md ${bgSecondary}`} />
            <div className={`h-3 w-16 rounded-md ${bgPrimary}`} />
          </div>

          <div className={`h-10 w-28 rounded-xl ${bgSecondary}`} />
        </div>
      </div>
    </div>
  );
}

export default function HotelsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <HotelCardSkeleton key={index} />
      ))}
    </div>
  );
}