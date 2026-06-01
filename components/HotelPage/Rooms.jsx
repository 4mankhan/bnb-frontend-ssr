"use client";

import React from "react";
import Image from "next/image";
import { Users, Baby, BedDouble, Star, ShieldCheck } from "lucide-react";
import { useAuth } from "@/utils/authContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Rooms({ rooms, roomAvailability, selectedRoom, setSelectedRoom }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleSelect = (room) => {
    setSelectedRoom((prev) => (prev?._id === room._id ? null : room));
  };

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Select Available Rooms
          </h2>
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1">
            Choose a luxury room type that fits your party's details.
          </p>
        </div>

        <div className="space-y-6">
          {rooms.map((room) => {
            const isSelected = selectedRoom?._id === room._id;
            const available = roomAvailability?.[room._id] ?? room.totalCount;

            return (
              <div
                key={room._id}
                className={`group grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch rounded-2xl p-4.5 border transition-all duration-300 cursor-pointer
                ${
                  isSelected
                    ? "bg-rose-50/70 dark:bg-rose-950/20 border-rose-350 dark:border-rose-800 shadow-md ring-1 ring-rose-200 dark:ring-rose-900/40"
                    : "bg-white dark:bg-gray-900 border-gray-150 dark:border-gray-800 hover:border-gray-250 dark:hover:border-gray-700 hover:shadow-md"
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                {/* IMAGES COLUMN */}
                <div className="relative rounded-xl overflow-hidden min-h-[220px] md:min-h-auto bg-gray-50 dark:bg-gray-850">
                  <div className="grid grid-cols-2 gap-2 h-full w-full">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={room.photos?.[0] || "/fallback.jpg"}
                        alt="primary room photo"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={room.photos?.[1] || room.photos?.[0] || "/fallback.jpg"}
                        alt="secondary room photo"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                      <ShieldCheck size={12} strokeWidth={2.5} />
                      Your Selection
                    </div>
                  )}
                </div>

                {/* INFO COLUMN */}
                <div className="flex flex-col justify-between p-2 space-y-4">
                  <div className="space-y-3">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-rose-500 transition-colors">
                        {room.type}
                      </h3>
                      <div className="flex items-center text-rose-500 font-extrabold text-[10px] uppercase tracking-wider">
                        ⭐ Popular Choice
                      </div>
                    </div>

                    {/* Capacity Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                        <Users size={12} className="text-gray-400" /> {room.capacity.adults} Adults
                      </span>

                      {room.capacity.children > 0 && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                          <Users size={12} className="text-gray-400" /> {room.capacity.children} Kids
                        </span>
                      )}

                      {room.capacity.infants > 0 && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                          <Baby size={12} className="text-gray-400" /> {room.capacity.infants} Infants
                        </span>
                      )}

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                        available <= 1 
                          ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900" 
                          : "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/60"
                      }`}>
                        <BedDouble size={12} />
                        {available} {available === 1 ? "Room Left" : "Rooms Left"}
                      </span>
                    </div>

                    {/* Amenities List */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.amenities.map((a, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 bg-transparent"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                        Base Rate
                      </p>
                      <p className="text-lg font-black text-gray-950 dark:text-white mt-0.5">
                        ₹{room.basePrice.toLocaleString("en-IN")}
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500"> / night</span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!user) {
                          toast.error("Please login first to book a room", {
                            duration: 2000,
                          });

                          setTimeout(() => {
                            router.push("/login");
                          }, 2000);

                          return;
                        }

                        if (user.role === "owner") {
                          toast.error(
                            "Owners cannot book rooms. Please register a regular user account.",
                            {
                              duration: 2000,
                            },
                          );

                          setTimeout(() => {
                            router.push("/signup");
                          }, 2000);

                          return;
                        }

                        handleSelect(room);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer
                      ${
                        isSelected
                          ? "bg-rose-500 text-white hover:bg-rose-600"
                          : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Room"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Rooms;
