"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import debounce from "@/utils/debounce";
import { SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  const debouncedSearch = useMemo(() => {
    return debounce((location, fromDate, toDate) => {
      // console.log(location);
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

  return (
    <div className="hidden md:flex flex-1 max-w-lg mx-8">
      <div className="flex items-center w-full border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden bg-white dark:bg-gray-900">
        <input
          type="text"
          placeholder="Anywhere"
          className="flex-1 min-w-0 px-5 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-transparent outline-none hover:bg-gray-50 dark:hover:bg-gray-800/80 focus:bg-gray-50 dark:focus:bg-gray-800/80 transition-colors"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <span className="text-gray-300 dark:text-gray-600 text-lg">|</span>

        <input
          type="date"
          className="flex-1 min-w-0 px-5 py-2 text-sm text-gray-800 dark:text-gray-100 bg-transparent outline-none hover:bg-gray-50 dark:hover:bg-gray-800/80 focus:bg-gray-50 dark:focus:bg-gray-800/80 transition-colors scheme-light-dark"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <span className="text-gray-300 dark:text-gray-600 text-lg">|</span>

        <input
          type="date"
          className="flex-1 min-w-0 px-5 py-2 text-sm text-gray-800 dark:text-gray-100 bg-transparent outline-none hover:bg-gray-50 dark:hover:bg-gray-800/80 focus:bg-gray-50 dark:focus:bg-gray-800/80 transition-colors scheme-light-dark"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

    </div>
  );
}
