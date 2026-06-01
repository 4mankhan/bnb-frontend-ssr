"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "@/utils/debounce";
import { Search, MapPin, Calendar, X } from "lucide-react";

export default function SecondSearchBar() {
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const router = useRouter();

  const debouncedSearch = useMemo(() => {
    return debounce((location, fromDate, toDate) => {
      router.replace(
        `/?location=${encodeURIComponent(
          location,
        )}&fromDate=${fromDate}&toDate=${toDate}`,
      );
    }, 1000);
  }, [router]);

  useEffect(() => {
    if (!location && !fromDate && !toDate) {
      debouncedSearch.cancel();
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    debouncedSearch(location, fromDate || today, toDate || today);

    return () => debouncedSearch.cancel();
  }, [location, fromDate, toDate, debouncedSearch]);

  const handleClear = () => {
    setLocation("");
    setFromDate("");
    setToDate("");
    router.push("/");
  };

  const handleSearchSubmit = () => {
    const today = new Date().toISOString().split("T")[0];

    router.push(
      `/?location=${encodeURIComponent(
        location,
      )}&fromDate=${fromDate || today}&toDate=${toDate || today}`,
    );
  };

  const openFromPicker = () => {
    if (fromDateRef.current?.showPicker) {
      fromDateRef.current.showPicker();
    } else {
      fromDateRef.current?.click();
    }
  };

  const openToPicker = () => {
    if (toDateRef.current?.showPicker) {
      toDateRef.current.showPicker();
    } else {
      toDateRef.current?.click();
    }
  };

  return (
    <div className="md:hidden px-3 py-3 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center w-full border border-gray-200 dark:border-gray-800 rounded-full shadow-sm bg-white dark:bg-gray-900 p-1.5 gap-1">
        {/* Where */}
        <div className="flex flex-col flex-1 min-w-0 px-3 py-1">
          <label className="text-[12px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Where
          </label>

          <input
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent outline-none mt-0.5 text-gray-800 dark:text-gray-100 placeholder-gray-100"
          />
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 shrink-0" />

        {/* Check In */}
        <button
          onClick={openFromPicker}
          className="flex flex-col w-20 px-2 py-1 text-left rounded-full"
        >
          <span className="text-[0.75rem] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            From
          </span>

          <span className="text-[0.75rem] font-semibold text-gray-800 dark:text-gray-100 truncate">
            {fromDate
              ? new Date(fromDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Add"}
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 shrink-0" />

        {/* Check Out */}
        <button
          onClick={openToPicker}
          className="flex flex-col w-20 px-2 py-1 text-left rounded-full"
        >
          <span className="text-[0.75rem] font-extrabold uppercase tracking-wider text-gray-800 dark:text-gray-400">
            To
          </span>

          <span className="text-[0.75rem] font-semibold text-gray-800 dark:text-gray-100 truncate">
            {toDate
              ? new Date(toDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Add"}
          </span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="flex items-center justify-center h-10 w-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm shrink-0"
        >
          <Search size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* Hidden Date Inputs */}
      <input
        ref={fromDateRef}
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
      />

      <input
        ref={toDateRef}
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
      />
    </div>
  );
}
