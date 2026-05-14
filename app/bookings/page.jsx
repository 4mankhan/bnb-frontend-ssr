"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import  Loading  from "@/components/loading";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${api}/booking/my-bookings`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.patch(
        `${api}/booking/cancel/${id}`,
        {}, // body
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // update UI instantly
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
      );
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  return (
    <main
      className="min-h-screen p-6 mt-2
bg-gray-50 dark:bg-black transition-colors"
    >
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Bookings
          </h1>

          <div
            onClick={() => router.push("/")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Home className="text-gray-700 dark:text-gray-300" />
          </div>
        </div>
{loading ? (
  <Loading lines={10} className="px-4 pt-10" />
) : bookings.length === 0 ? (
  <p className="text-gray-500 dark:text-gray-400">
    No bookings found.
  </p>
) : (
  <div className="space-y-5">
    {bookings.map((booking) => {
      const isCancelled = booking.status === "CANCELLED";
      const isExpired = booking.status === "EXPIRED";

      return (
        <div
          key={booking._id}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4
          p-5 rounded-2xl border transition-all duration-300
          bg-white dark:bg-gray-900
          border-gray-200 dark:border-gray-800
          hover:shadow-xl hover:-translate-y-1"
        >
          {/* LEFT */}
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {booking.hotel?.name || "Hotel"}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {booking.hotel?.city}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(booking.fromDate)} →{" "}
              {formatDate(booking.toDate)}
            </p>

            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={`font-medium ${
                  isCancelled
                    ? "text-red-500 bg-red-400/10"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {booking.status}
              </span>
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/bookings/${booking._id}`)}
              className="px-4 py-2 text-sm rounded-lg transition
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-white
              hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              View
            </button>

            {!isCancelled && !isExpired && (
              <button
                onClick={() => handleCancel(booking._id)}
                className="px-4 py-2 text-sm rounded-lg transition
                bg-red-500 text-white
                hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      );
    })}
  </div>
)}

       
      </div>
    </main>
  );
}
