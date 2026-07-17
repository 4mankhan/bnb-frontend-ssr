"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Counter from "./Counter";
import {
  Calendar,
  Users,
  ChevronDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";

function BookingCard({
  selectedRoom,
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  onReserve,
  disabled = false,
}) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showGuests, setShowGuests] = useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowGuests(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const priceBreakdown = useMemo(() => {
    if (!selectedRoom) {
      return {
        base: 0,
        nights: 1,
        baseTotal: 0,
        extraAdultCost: 0,
        childCost: 0,
        total: 0,
      };
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const nights = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    );

    const base = selectedRoom.basePrice;

    const extraAdults = Math.max(0, adults - 2);

    const extraAdultCost = Math.round(
      extraAdults * (0.25 * base) * nights
    );

    const childCost = Math.round(
      children * (0.13 * base) * nights
    );

    const baseTotal = Math.round(base * nights);

    const total = Math.round(
      (base +
        extraAdults * (0.25 * base) +
        children * (0.13 * base)) *
        nights
    );

    return {
      base,
      nights,
      baseTotal,
      extraAdultCost,
      childCost,
      total,
    };
  }, [selectedRoom, checkIn, checkOut, adults, children]);

  return (
    <div className="sticky mb-20 top-24 h-fit overflow-visible">
      <div className="rounded-2xl p-6 shadow-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 transition-colors overflow-visible">
        {/* HEADER PRICE */}
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <p className="text-2xl font-black text-gray-950 dark:text-white">
              ₹{priceBreakdown.total.toLocaleString("en-IN")}
            </p>

            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">
              Total stay ({priceBreakdown.nights}{" "}
              {priceBreakdown.nights === 1 ? "night" : "nights"})
            </p>
          </div>

          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
            <Sparkles size={11} />
            Best Price
          </div>
        </div>

        {/* INPUT CONTAINER */}
        <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-visible bg-gray-50 dark:bg-gray-850">
          {/* CHECK-IN / CHECK-OUT */}
          <div className="grid grid-cols-2 border-b border-gray-250 dark:border-gray-750">
            <div className="p-3 pr-2.5 flex flex-col justify-center">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar size={10} className="text-rose-500" />
                Check-in
              </label>

              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent outline-none text-xs font-bold text-gray-850 dark:text-gray-150 mt-1"
              />
            </div>

            <div className="p-3 pl-2.5 border-l border-gray-250 dark:border-gray-750 flex flex-col justify-center">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar size={10} className="text-rose-500" />
                Check-out
              </label>

              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent outline-none text-xs font-bold text-gray-850 dark:text-gray-150 mt-1"
              />
            </div>
          </div>

          {/* GUESTS */}
          <div
            ref={ref}
            className="relative overflow-visible"
          >
            <button
              type="button"
              onClick={() => setShowGuests((prev) => !prev)}
              className="w-full p-3.5 hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-colors flex items-center justify-between text-left"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Users size={10} className="text-rose-500" />
                  Guests
                </span>

                <span className="text-xs font-bold text-gray-800 dark:text-gray-805 mt-1">
                  {adults} adults · {children + infants} guests
                </span>
              </div>

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform ${
                  showGuests ? "rotate-180" : ""
                }`}
              />
            </button>

            {showGuests && (
              <div className="absolute left-0 right-0 top-full mt-2 z-9999 rounded-xl shadow-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 space-y-4">
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
                  min={0}
                />

                <Counter
                  label="Infants"
                  value={infants}
                  setValue={setInfants}
                  min={0}
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
              total: priceBreakdown.total,
            })
          }
          disabled={!selectedRoom || disabled}
          className={`mt-5 w-full py-3.5 rounded-xl text-xs font-bold transition-all
            ${
              selectedRoom && !disabled
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          {disabled ? "Processing..." : "Reserve Stay"}
        </button>

        <p className="text-center text-[10px] text-gray-400 font-semibold mt-3">
          You wont be charged yet
        </p>

        {/* PRICE BREAKDOWN */}
        <div className="mt-5 pt-5 border-t border-gray-150 dark:border-gray-800 space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>
              ₹{priceBreakdown.base.toLocaleString("en-IN")} ×{" "}
              {priceBreakdown.nights}{" "}
              {priceBreakdown.nights === 1 ? "night" : "nights"}
            </span>

            <span>
              ₹{priceBreakdown.baseTotal.toLocaleString("en-IN")}
            </span>
          </div>

          {priceBreakdown.extraAdultCost > 0 && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                Extra adult fee
                <HelpCircle size={10} />
              </span>

              <span>
                ₹{priceBreakdown.extraAdultCost.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          {priceBreakdown.childCost > 0 && (
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                Child guest fee
                <HelpCircle size={10} />
              </span>

              <span>
                ₹{priceBreakdown.childCost.toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <hr className="border-gray-100 dark:border-gray-800" />

          <div className="flex justify-between text-sm font-black text-gray-950 dark:text-white">
            <span>Total before taxes</span>

            <span>
              ₹{priceBreakdown.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;