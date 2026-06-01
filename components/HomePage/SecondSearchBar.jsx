"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import debounce from "@/utils/debounce";
import { Search, X, Calendar, MapPin } from "lucide-react";

export default function SecondSearchBar() {
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const debouncedSearch = useMemo(() => {
    return debounce((location, fromDate, toDate) => {
      router.replace(
        `/?location=${encodeURIComponent(location)}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }, 1000);
  }, [router]);

  useEffect(() => {
    if (!location && !fromDate && !toDate) {
      debouncedSearch.cancel();
      router.push("/");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    debouncedSearch(
      location,
      fromDate || today,
      toDate || today
    );

    return () => {
      debouncedSearch.cancel();
    };
  }, [location, fromDate, toDate, debouncedSearch, router]);

  const handleClear = () => {
    setLocation("");
    setFromDate("");
    setToDate("");
  };

  const handleSearchSubmit = () => {
    const today = new Date().toISOString().split("T")[0];

    router.push(
      `/?location=${encodeURIComponent(location)}&fromDate=${fromDate || today}&toDate=${toDate || today}`
    );

    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Search Trigger */}
      <div className="lg:hidden px-4 py-3 bg-white dark:bg-gray-950 border-b border-gray-150 dark:border-gray-850">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2.5 shadow-sm text-left hover:bg-gray-100 dark:hover:bg-gray-850 active:scale-[0.99] transition-all cursor-pointer"
        >
          <div className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-rose-500 shadow-xs shrink-0">
            <Search className="h-4 w-4" strokeWidth={2.5} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
              Where to?
            </p>

            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {location || "Anywhere"} ·{" "}
              {fromDate && toDate
                ? `${fromDate} to ${toDate}`
                : "Select dates"}
            </p>
          </div>
        </button>
      </div>

      {/* Full Screen Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 bg-gray-50 dark:bg-gray-950 overflow-y-auto flex flex-col">
          {/* Header */}
          <header className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
            >
              <X size={16} strokeWidth={2.5} />
            </button>

            <h2 className="text-base font-bold text-gray-950 dark:text-white">
              Stays Search
            </h2>

            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Location */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-150 dark:border-gray-800 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Where to go?
                </h3>
              </div>

              <input
                type="text"
                placeholder="Search destination cities (e.g. Paris, Goa)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-750 px-4 py-3 text-sm font-semibold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
              />
            </div>

            {/* Dates */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-150 dark:border-gray-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rose-500 shrink-0" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  When is your trip?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Check In
                  </label>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-750 px-3 py-2.5 text-xs font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Check Out
                  </label>

                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-750 px-3 py-2.5 text-xs font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                Search
              </span>

              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {location || "Anywhere"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSearchSubmit}
              className="flex items-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3.5 text-sm shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <Search size={16} strokeWidth={2.5} />
              Search Stays
            </button>
          </footer>
        </div>
      )}
    </>
  );
}