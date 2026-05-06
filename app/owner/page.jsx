"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
}

export default function OwnerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [hotels, setHotels] = useState([]);


  useEffect(() => {
    const fetchDashboard = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        setError("No access token found.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [profileRes, hotelsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE_URL}/owner/hotels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!profileRes.ok) throw new Error("Unable to load profile.");
        if (!hotelsRes.ok) throw new Error("Unable to load hotels.");

        const profileData = await profileRes.json();
        const hotelsData = await hotelsRes.json();

        setProfile(profileData?.data || profileData?.user || profileData);
        setHotels(hotelsData?.data || hotelsData || []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

const total = hotels.length;

const active = useMemo(() => {
  return hotels.filter(h => h.active).length;
}, [hotels]);

const inactive = total - active;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Dashboard error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <h2 className="text-2xl font-semibold">Welcome, {profile?.name || "Owner"}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Manage hotels, rooms, and activation status from one place.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/owner/hotels" className="rounded-full bg-rose-500 text-white px-4 py-2 text-sm hover:bg-rose-600">
            Manage Hotels
          </Link>
          <Link href="/owner/hotels/new" className="rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            Add New Hotel
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Hotels</p>
          <p className="text-3xl font-semibold mt-2">{total}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Hotels</p>
          <p className="text-3xl font-semibold mt-2 text-green-600"> {active}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Inactive Hotels</p>
          <p className="text-3xl font-semibold mt-2 text-amber-600"> {inactive || 0}</p>
        </div>
      </div>
    </section>
  );
}
