"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import debounce from "@/utils/debounce";
import { Search, Calendar } from "lucide-react";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

    const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  const router = useRouter();

  const debouncedSearch = useMemo(() => {
    return debounce((location, fromDate, toDate) => {
      router.replace(
        `/?location=${location}&fromDate=${fromDate}&toDate=${toDate}`,
      );
    }, 1000);
  }, [router]);

  useEffect(() => {
    if (!location && !fromDate && !toDate) {
      debouncedSearch.cancel(); // clear pending timer
      router.push("/");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const finalFromDate = fromDate || today;
    const finalToDate = toDate || today;

    debouncedSearch(location, finalFromDate, finalToDate);

    return () => {
      debouncedSearch.cancel();
    };
  }, [location, fromDate, toDate, debouncedSearch, router]);

  const openFromPicker = () => {
  fromDateRef.current?.showPicker?.();
};

const openToPicker = () => {
  toDateRef.current?.showPicker?.();
};

  return (
    <div className="hidden lg:flex flex-1 max-w-2xl mx-6">
      <div className="flex items-center w-full border border-gray-200 dark:border-gray-800 rounded-full shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 bg-white dark:bg-gray-900 p-1.5 pl-6 gap-2">
        
        {/* Where Segment */}
        <div className="flex flex-col flex-1 min-w-0 pr-2 group hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-full px-3 py-0 transition-colors duration-150">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Where
          </label>
          <input
            type="text"
            placeholder="Search destinations"
            className="w-full text-xs font-semibold text-gray-800 dark:text-gray-100 placeholder-gray-100 dark:placeholder-gray-550 bg-transparent outline-none mt-0.5"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 shrink-0 self-center" />

        {/* Check In Segment */}
       <div
  onClick={openFromPicker}
  className="flex flex-col w-24 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-full px-3 py-1 transition-colors duration-150"
>
  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
    When
  </label>

  <div className="flex items-center gap-2 mt-0.5">
    <Calendar
      size={14}
      className={fromDate ? "text-rose-500" : "text-gray-400"}
    />

    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
      {fromDate ? "" : "Add"}
    </span>
  </div>
</div>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 shrink-0 self-center" />

        {/* Check Out Segment */}
      <div
  onClick={openToPicker}
  className="flex flex-col w-24 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded-full px-3 py-1 transition-colors duration-150"
>
  <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
    Until
  </label>

  <div className="flex items-center gap-2 mt-0.5">
    <Calendar
      size={14}
      className={toDate ? "text-rose-500" : "text-gray-400"}
    />

    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
      {toDate ? "" : "Add"}
    </span>
  </div>
</div>

        {/* Search Action Button */}
        <button
          type="button"
          onClick={() => {
            const today = new Date().toISOString().split("T")[0];
            router.push(`/?location=${location}&fromDate=${fromDate || today}&toDate=${toDate || today}`);
          }}
          className="flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <Search size={16} strokeWidth={2.5} />
        </button>


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
    </div>
  );
}
