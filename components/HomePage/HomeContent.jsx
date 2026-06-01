"use client";

import Image from "next/image";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  Waves,
  Mountain,
  Building2,
  Wheat,
  Droplets,
  Sparkles,
  Tent,
  Landmark,
  Heart,
  Star,
  Menu,
  UserRound,
  SlidersHorizontal,
  Map,
  User,
  Calendar,
  Home,
  LogOut,
  LogIn,
} from "lucide-react";
import Pagination from "@/components/HomePage/Pagination";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/HomePage/Searchbar";
import ThemeToggle from "@/utils/Theme/ThemeToggle";
import { useSearchParams } from "next/navigation";
import SecondSearchBar from "@/components/HomePage/SecondSearchBar";
import { useAuth } from "@/utils/authContext";
import useResponsiveLimit from "@/utils/reposiveRateLimit";
import HotelCardSkeleton from "@/components/HotelCardSkeleton";
import Hotels from "./Hotels";

const categories = [
  { label: "Beachfront", Icon: Waves },
  { label: "Mountains", Icon: Mountain },
  { label: "City", Icon: Building2 },
  { label: "Countryside", Icon: Wheat },
  { label: "Lakefront", Icon: Droplets },
  { label: "Luxury", Icon: Sparkles },
  { label: "Cabins", Icon: Tent },
  { label: "Heritage", Icon: Landmark },
];

export default function HomeContent() {
  const [hotels, setHotels] = useState([]);
  const [page, setPage] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  
    const api = process.env.NEXT_PUBLIC_API_URL;
  
    const router = useRouter();
  
    const searchParams = useSearchParams();
  
    const location = searchParams.get("location");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
  
    const normalizedLocation = useMemo(() => {
      return location?.trim().toLowerCase() || "";
    }, [location]);
  
    const limit = useResponsiveLimit();
    useEffect(() => {
      const fetchHotels = async () => {
        setLoading(true);
        try {
          let res;
  
          if (normalizedLocation) {
            res = await axios.get(`${api}/hotels/browse`, {
              params: {
                location: normalizedLocation,
                fromDate,
                toDate,
              },
            });
          } else {
            res = await axios.get(`${api}/hotels?page=${page}&limit=${limit}`);
          }
  
          setHotels(res.data.data || res.data);
        } catch (error) {
          console.error("Error fetching hotels:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHotels();
    }, [page, normalizedLocation, fromDate, toDate, limit, api]);
  


  const handleLogout = () => {
    logout();
    console.log("logout");
  };

  return (
    <main className="bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {showMenu && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-150 dark:border-gray-850 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <h1
                className="text-2xl font-black text-rose-500 tracking-tight cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => router.push("/")}
              >
                amanbnb
              </h1>
            </div>

            <SearchBar />

            {/* Right Nav */}
            <div className="flex flex-row items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {/* <button className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2 transition-colors whitespace-nowrap">
                Airbnb your home
              </button> */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu((prev) => !prev)}
                  className="flex items-center gap-2 md:gap-10 border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Menu className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center">
                    <UserRound className="h-4 w-4 text-white" />
                  </div>
                </button>

                {/* 👇 PLACE IT HERE */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
                    <button
                      onClick={() => router.push("/account")}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User size={16} />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        if (!user) {
                          router.push("/login");
                          return;
                        }
                        router.push("/bookings");
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Calendar size={16} />
                      All Bookings
                    </button>

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    <button
                      onClick={() => router.push("/owner")}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Home size={16} />
                      Become a host
                    </button>

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />

                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push("/login")}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <LogIn size={16} />
                        Sign In
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>


  <SecondSearchBar />

      </header>

      {/* Category Filter Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800 sticky top-16 sm:top-20 z-40 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 md:gap-20 sm:gap-8 py-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat, i) => {
              const Icon = cat.Icon;
              return (
                <button
                  key={cat.label}
                  type="button"
                  className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 min-w-16 sm:min-w-0 transition-colors ${
                    i === 0
                      ? "border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-100"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Icon
                    className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="text-xs font-medium whitespace-nowrap text-center">
                    {cat.label}
                  </span>
                </button>
              );
            })}

            {/* Filter Button */}
            <div className="ml-auto pl-4 border-l border-gray-200 dark:border-gray-800">
              <button
                type="button"
                className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors shrink-0"
              >
                <SlidersHorizontal
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? <HotelCardSkeleton /> : <Hotels hotels={hotels} page={page} />}
      </section>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          type="button"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white text-sm font-medium px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-lg transition-colors max-w-[calc(100vw-2rem)]"
        >
          <Map className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
          <span className="truncate">Show map</span>
        </button>
      </div>
      <Pagination page={page} setPage={setPage} />
    </main>
  );
}
