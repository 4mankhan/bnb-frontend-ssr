"use client";

import { useState } from "react";
import axios from "axios";

export default function PaymentModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (pin !== "1234") {
      alert("Invalid PIN");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/payment/process",
        {
          bookingId: booking._id,
          success: true,
          method: "mock",
          pin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(res.data);
      onClose();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      {/* MODAL */}
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl 
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-800 
      transition-colors">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Complete your payment
        </h2>

        {/* AMOUNT */}
        <div className="mb-6 p-4 rounded-xl 
        bg-gray-50 dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Amount
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            ₹{booking?.totalPrice}
          </p>
        </div>

        {/* PIN INPUT */}
        <div className="mb-4">
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Enter PIN
          </label>
          <input
            type="password"
            placeholder="1234"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-lg outline-none 
            border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100 
            focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* CTA */}
        <button
          onClick={handlePayment}
          disabled={loading || !pin}
          className={`w-full py-3 rounded-xl text-sm font-medium transition
          ${
            loading || !pin
              ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-rose-500 text-white hover:bg-rose-600"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        {/* CANCEL */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-sm text-gray-500 dark:text-gray-400 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}