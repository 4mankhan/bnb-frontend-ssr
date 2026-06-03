"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLazyGetProfileQuery } from "@/lib/api";

function getAccessToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

export default function OwnerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [fetchProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const verifyOwner = async () => {
      try {
        setStatus("checking");
        setError("");

        const user = await fetchProfile().unwrap();

        if (!user) {
          router.replace("/login");
          return;
        }

        if (user.role !== "owner") {
          router.replace("/");
          return;
        }

        setStatus("allowed");
      } catch (err) {
        setError(err?.data?.message || "Could not verify your account.");
        setStatus("error");
      }
    };

    verifyOwner();
  }, [pathname, router, fetchProfile]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
        Checking owner access...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Access check failed</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-3 rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center justify-between">
          <h1 className="font-semibold">Owner Panel</h1>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800"
              href="/account"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
