"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import debounce from "@/utils/debounce";

export default function MobileSearchBar() {
  const [location, setLocation] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const router = useRouter();

  const debouncedSearch = useMemo(() => {
    return debounce((location, fromDate, toDate) => {
      router.replace(
        `/?location=${location}&fromDate=${fromDate}&toDate=${toDate}`
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

    const finalFromDate = fromDate || today;
    const finalToDate = toDate || today;

    debouncedSearch(location, finalFromDate, finalToDate);

    return () => {
      debouncedSearch.cancel();
    };
  }, [location, fromDate, toDate, debouncedSearch, router]);

  return (
    <div className="md:hidden mx-2 my-2 border border-gray-300 dark:border-gray-600 rounded-xl flex flex-col gap-2 p-2 bg-white dark:bg-gray-900 shadow-sm">
      
      {/* Location */}
      <input
        type="text"
        placeholder="Anywhere"
        className="w-full px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-500 bg-transparent outline-none border-b dark:border-gray-700"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Dates */}
      <div className="flex gap-2">
        <input
          type="date"
          className="flex-1 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 bg-transparent outline-none border rounded-lg dark:border-gray-700"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="flex-1 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 bg-transparent outline-none border rounded-lg dark:border-gray-700"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
    </div>
  );
}