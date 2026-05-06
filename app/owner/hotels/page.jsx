"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000";

function getAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
}

export default function OwnerHotelsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const token = getAccessToken();
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE_URL}/owner/hotels`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch hotels.");
        const data = await res.json();
        setHotels(data?.data || data || []);
      } catch (err) {
        setError(err.message || "Could not load your hotels.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
        <div className="h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Hotels error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">My Hotels</h2>
        <Link
          href="/owner/hotels/new"
          className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white hover:bg-rose-600"
        >
          Create Hotel
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You have no hotels yet. Create your first listing.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {hotels.map((hotel) => (
            <article
              key={hotel._id}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-lg">{hotel.name || "Untitled hotel"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {hotel.city || "Unknown city"}
                  </p>
                  <span
                    className={`inline-flex mt-3 rounded-full px-3 py-1 text-xs font-medium ${
                      hotel.active
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                    }`}
                  >
                    {hotel.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <Link
                  href={`/owner/hotels/${hotel._id}`}
                  className="rounded-full border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
