"use client";

export default function Pagination({ page, setPage }) {
  return (
    <div className="flex justify-center items-center gap-6 my-10">
      {/* Prev Button */}
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="px-4 py-2 border border-rose-500 dark:border-rose-400 rounded-xl bg-rose-500 text-white text-sm hover:bg-rose-600 dark:hover:bg-rose-600 disabled:opacity-50"
        disabled={page === 1}
      >
        Prev
      </button>

      {/* Page Number */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Page {page}
      </span>

      {/* Next Button */}
      <button
        onClick={() => setPage((prev) => prev + 1)}
        className="px-4 py-2 bg-rose-500 text-white border border-rose-500 dark:border-rose-400 rounded-xl text-sm hover:bg-rose-600 dark:hover:bg-rose-600"
      >
        Next
      </button>
    </div>
  );
}