"use client";

import { useTheme } from "@/utils/Theme/ThemeProvider";

export default function HotelDetailsSkeleton() {
  const { dark } = useTheme();

  const bgPrimary = dark ? "bg-slate-800" : "bg-slate-100";
  const bgSecondary = dark ? "bg-slate-700" : "bg-slate-200";

  return (
    <div className="animate-pulse overflow-hidden rounded-3xl p-8">
      {/* Upper Half - Large Hotel Image */}
      <div
        className={`h-[45vh] w-full rounded-3xl transition-colors duration-300 ${bgSecondary}`}
      />

      {/* Lower Half - Hotel Details */}
      <div className="space-y-6 pt-6">
        {/* Hotel name + rating */}
        <div className="space-y-3">
          <div
            className={`h-8 w-3/4 rounded-xl transition-colors duration-300 ${bgSecondary}`}
          />
          <div
            className={`h-5 w-40 rounded-lg transition-colors duration-300 ${bgPrimary}`}
          />
        </div>

        {/* Location */}
        <div
          className={`h-4 w-52 rounded-lg transition-colors duration-300 ${bgPrimary}`}
        />

        {/* Description */}
        <div className="space-y-3">
          <div className={`h-4 w-full rounded-lg ${bgPrimary}`} />
          <div className={`h-4 w-full rounded-lg ${bgPrimary}`} />
          <div className={`h-4 w-5/6 rounded-lg ${bgPrimary}`} />
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <div
            className={`h-6 w-36 rounded-lg transition-colors duration-300 ${bgSecondary}`}
          />

          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-10 w-28 rounded-full transition-colors duration-300 ${bgPrimary}`}
              />
            ))}
          </div>
        </div>

        {/* Facilities / Room info */}
        <div className="grid grid-cols-2 gap-4 pt-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-20 rounded-2xl transition-colors duration-300 ${bgPrimary}`}
            />
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="space-y-2">
            <div className={`h-7 w-24 rounded-lg ${bgSecondary}`} />
            <div className={`h-4 w-20 rounded-lg ${bgPrimary}`} />
          </div>

          <div
            className={`h-12 w-36 rounded-2xl transition-colors duration-300 ${bgSecondary}`}
          />
        </div>
      </div>
    </div>
  );
}