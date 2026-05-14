"use client";

import { useTheme } from "@/utils/Theme/ThemeProvider";

export default function LoadingState({
  className = "",
  lines = 3,
}) {
  const { dark } = useTheme();

  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {/* Title skeleton */}
      <div
        className={`h-5 w-48 rounded-md transition-colors duration-300 ${
          dark ? "bg-slate-700" : "bg-slate-200"
        }`}
      />

      {/* Content lines */}
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 rounded-md transition-colors duration-300 ${
            dark ? "bg-slate-800" : "bg-slate-100"
          } ${
            index === lines - 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}