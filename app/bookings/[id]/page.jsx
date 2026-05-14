"use client";

import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Home } from "lucide-react";
import  Loading  from "@/components/loading";

export default function BookingDetailsPage() {
  const { id } = useParams();
  // console.log("Params ID:", id);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

 const api = process.env.NEXT_PUBLIC_API_URL;

 

 
    const fetchBooking = useCallback( async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`${api}/booking/${id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBooking(res.data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    },[api, id]);

 useEffect(()=>{
     fetchBooking();
 },[fetchBooking])

 

  if (loading) {
    return (
       <Loading lines={10} className="px-4 pt-10" />
    );
  }

  if (!booking) {
    return (
      <div className="p-10 text-center text-red-500">Booking not found</div>
    );
  }

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
    <div
      className="max-w-3xl min-h-screen mx-auto p-5 my-auto sm:p-6 rounded-2xl
  bg-white dark:bg-gray-900
  border border-gray-200 dark:border-gray-800
  shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* HOTEL INFO */}

      <div className="flex items-center justify-between mb-6">
        <div className="mt-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {booking.hotel.name}
          </h2>

          <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
            {booking.hotel.contactInfo.completeAddress}
          </p>
        </div>

        <div
          onClick={() => router.push("/")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Home className="text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      {/* BOOKING INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-sm">
        {[
          [
            "Check-in",
            `${formatDate(booking.fromDate)} • ${formatTime(booking.fromDate)}`,
          ],
          [
            "Check-out",
            `${formatDate(booking.toDate)} • ${formatTime(booking.toDate)}`,
          ],
          ["Room Type", booking.room.type],
           [
      "Guests",
      `${booking.guests.adults} Adults, ${booking.guests.children} Children, ${booking.guests.infants} Infants`,
    ],
        ].map(([label, value], i) => (
          <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        ))}

        {/* PRICE */}
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total Price
          </p>
          <p className="font-bold text-lg text-green-600">
            ₹{booking.totalPrice}
          </p>
        </div>

        {/* STATUS */}
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
          <p className="font-semibold text-blue-600 dark:text-blue-400">
            {booking.status}
          </p>
        </div>
      </div>

      {/* AMENITIES */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
          Amenities
        </h3>

        <div className="flex flex-wrap gap-2">
          {booking.room.amenities.map((a, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full
          bg-gray-100 dark:bg-gray-800
          text-gray-700 dark:text-gray-300"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* META INFO */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>
          Booked on: {formatDate(booking.createdAt)} •{" "}
          {formatTime(booking.createdAt)}
        </p>

        <p>Expires at: {formatTime(booking.expiresAt)}</p>
      </div>
    </div>
  );
}
