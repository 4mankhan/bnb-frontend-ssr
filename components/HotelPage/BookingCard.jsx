"use client";

import React, { useState, useRef, useEffect } from "react";
import Counter from "./Counter";

function BookingCard({
  selectedRoom,
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  onReserve,
}) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showGuests, setShowGuests] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;

    const base = selectedRoom.basePrice;
    const nights = getNights();

    const extraAdults = Math.max(0, adults - 2);
    const adultCost = extraAdults * (0.25 * base);

    const childCost = children * (0.13 * base);

    const totalPerNight = base + adultCost + childCost;

    return Math.round(totalPerNight * nights);
  };

  const total = calculateTotal();

  return (
    <div className="sticky top-24 h-fit mb-20">
      <div
        className="rounded-2xl p-6 shadow-xl border 
      bg-white dark:bg-gray-900 
      border-gray-200 dark:border-gray-800 
      transition-colors"
      >
        {/* PRICE */}
        <div className="mb-6">
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            ₹{total}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {" "}
              total
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getNights()} night(s)
          </p>
        </div>

        {/* INPUTS */}
        <div className="space-y-4">
          {/* Check-in */}
          <div
            className="border rounded-xl p-3 
          border-gray-300 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-800"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Check-in
            </p>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent outline-none 
              text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Check-out */}
          <div
            className="border rounded-xl p-3 
          border-gray-300 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-800"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Check-out
            </p>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent outline-none 
              text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Guests */}
          {/* <div className="border rounded-xl p-3 
          border-gray-300 dark:border-gray-700 
          bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {selectedRoom
                ? `${selectedRoom.capacity} guests`
                : "Select a room"}
            </p>
          </div> */}

          <div className="relative">
            <div
              onClick={() => setShowGuests(!showGuests)}
              className="border rounded-xl p-3 cursor-pointer 
    bg-gray-50 dark:bg-gray-800 
    border-gray-300 dark:border-gray-700"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {adults} adults · {children} children · {infants} infants
              </p>
            </div>

            {showGuests && (
              <div
                className="absolute z-50 mt-2 w-full rounded-xl shadow-lg border 
    bg-white dark:bg-gray-900 
    border-gray-200 dark:border-gray-700 p-4 space-y-4"
    ref={ref}
              >
                <Counter
                  label="Adults"
                  value={adults}
                  setValue={setAdults}
                  min={1}
                />
                <Counter
                  label="Children"
                  value={children}
                  setValue={setChildren}
                />
                <Counter
                  label="Infants"
                  value={infants}
                  setValue={setInfants}
                />
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <button
         onClick={() =>
    onReserve({
      adults,
      children,
      infants,
      checkIn,
      checkOut,
      total,
    })
  }
  disabled={!selectedRoom}

          className={`mt-6 w-full py-3 rounded-xl text-sm font-medium transition
          ${
            selectedRoom
              ? "bg-rose-500 text-white hover:bg-rose-600"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          Reserve
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
          You won’t be charged yet
        </p>
      </div>
    </div>
  );
}

export default BookingCard;
