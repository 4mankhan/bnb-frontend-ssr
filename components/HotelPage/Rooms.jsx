"use client";

import React from "react";
import Image from "next/image";
import { Users, Baby, BedDouble } from "lucide-react";
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
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-0">
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-12 text-center">
          Available Rooms
        </h2>

        <div className="space-y-10">
          {rooms.map((room) => {
            const isSelected = selectedRoom?._id === room._id;
            const available = roomAvailability?.[room._id] ?? room.totalCount;

            return (
              <div
                key={room._id}
                className={`group grid md:grid-row gap-8 items-center rounded-2xl p-5 transition-all duration-300 cursor-pointer
                ${
                  isSelected
                    ? "bg-rose-50 dark:bg-rose-900/20 border border-rose-300 dark:border-rose-700 shadow-md"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg"
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                {/* IMAGES */}
                <div className="grid grid-cols-2 gap-3 h-64">
                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src={room.photos?.[0]}
                      alt="room"
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="relative rounded-xl overflow-hidden">
                    <Image
                      src={room.photos?.[1] || room.photos?.[0]}
                      alt="room"
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                </div>

                {/* INFO */}
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {room.type}
                  </h3>

                  {/* Capacity */}

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                      <Users size={14} /> {room.capacity.adults} Adults
                    </span>

                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                      <Users size={14} /> {room.capacity.children} Children
                    </span>

                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
                      <Baby size={14} /> {room.capacity.infants} Infants
                    </span>

                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 flex items-center gap-1">
                      <BedDouble size={14} />
                      {available} Rooms Left
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {room.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full border 
                        border-gray-300 dark:border-gray-700 
                        text-gray-700 dark:text-gray-300 
                        bg-gray-50 dark:bg-gray-800"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-4 flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      ₹{room.basePrice}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {" "}
                        / night
                      </span>
                    </p>

                    <button
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
                            "Owners cannot book rooms. Please register as a user account.",
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
                      className={`px-5 py-2 rounded-full text-sm font-medium transition
  ${
    isSelected
      ? "bg-rose-500 text-white hover:bg-rose-600"
      : "bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
  }`}
                    >
                      {isSelected ? "Selected" : "Reserve"}
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
