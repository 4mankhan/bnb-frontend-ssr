"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useProcessPaymentMutation } from "@/lib/api";
import { Lock, CheckCircle2, X, AlertCircle } from "lucide-react";

export default function PaymentModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) {
  const [processPayment, { isLoading: loading }] = useProcessPaymentMutation();

  const [pin, setPin] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const pinInputRef = useRef(null);

  // Focus invisible input for easy typing
  useEffect(() => {
  if (!isOpen) return;

  const timer = setTimeout(() => {
    pinInputRef.current?.focus();
  }, 150);

  return () => clearTimeout(timer);
}, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
      setErrorMsg("");
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg("");
  };

  const triggerShake = (msg) => {
    setShake(true);
    setErrorMsg(msg);
    toast.error(msg);
    setTimeout(() => setShake(false), 500);
  };

  const handlePayment = async (finalPin) => {
    const activePin = finalPin || pin;

    if (activePin !== "1234") {
      triggerShake("Invalid secure PIN! Please try again.");
      setPin("");
      return;
    }

    try {
      await processPayment({
        bookingId: booking._id,
        success: true,
        method: "mock",
        pin: activePin,
      }).unwrap();

      setIsSuccess(true);
     setTimeout(() => {
  onSuccess();
  handleClose();
}, 2000);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Payment process failed");
    }
  };

  // Automatically submit when 4 digits are completed
  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(val);
    setErrorMsg("");

    if (val.length === 4) {
      handlePayment(val);
    }
  };


  const resetModal = () => {
  setPin("");
  setErrorMsg("");
  setIsSuccess(false);
};

const handleClose = () => {
  resetModal();
  onClose();
};


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 transition-all duration-300">
      
      {/* Invisible actual input to capture native focus and keyboard events */}
      <input
        ref={pinInputRef}
        type="text"
        pattern="\d*"
        inputMode="numeric"
        value={pin}
        onChange={handleInputChange}
        className="absolute h-0 w-0 opacity-0 pointer-events-none"
        aria-hidden="true"
        disabled={loading || isSuccess}
      />

      {/* MODAL MAIN FRAME */}
      <div 
        className={`w-full max-w-md rounded-3xl p-6.5 shadow-2xl bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 transition-all duration-300 relative overflow-hidden ${
          shake ? "animate-shake border-red-500 dark:border-red-800" : ""
        }`}
      >
        
        {/* SUCCESS STAGE */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-5 text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center shadow-lg border border-emerald-100 dark:border-emerald-900 animate-bounce">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Successful!</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                Your transaction has completed successfully.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-1 rounded-full animate-pulse">
              🎉 Redirecting to bookings...
            </div>
          </div>
        ) : (
          
          /* PAYMENT ENTRY STAGE */
          <div className="space-y-6">
            
            {/* Header Lock Info */}
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-150 dark:border-gray-805">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center border border-rose-100 dark:border-rose-900/40 shadow-xs">
                  <Lock size={14} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-950 dark:text-white">Secure Checkout</h2>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5">Mock payment gateway</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="h-7 w-7 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850 flex items-center justify-center text-gray-400 hover:text-rose-500 active:scale-90 transition-all cursor-pointer"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>

            {/* STAY RECEIPT BRIEF */}
            <div className="rounded-2xl p-4 bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 space-y-3.5 shadow-xs">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-500">
                  Stay Summary
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {booking?.hotel?.name || "Premium Stay Hotel"}
                </h3>
              </div>
              
              <div className="border-t border-dashed border-gray-250 dark:border-gray-700 pt-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Total Amount Due
                  </p>
                  <p className="text-lg font-black text-gray-950 dark:text-white mt-0.5">
                    ₹{booking?.totalPrice?.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-xs text-gray-500 dark:text-gray-400 cursor-default">
                  Mock Process
                </div>
              </div>
            </div>

            {/* SEGMENTED PIN DOTS BOXES */}
            <div 
              onClick={() => pinInputRef.current?.focus()}
              className="flex flex-col items-center justify-center space-y-3 cursor-pointer"
            >
              <label className="text-[10px] font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                Enter Security PIN
              </label>
              
              {/* Digit Box List */}
              <div className="flex gap-3 pt-1">
                {[0, 1, 2, 3].map((index) => {
                  const digit = pin[index];
                  return (
                    <div
                      key={index}
                      className={`h-11 w-11 rounded-xl border flex items-center justify-center font-black text-lg transition-all duration-150 shadow-xs ${
                        digit
                          ? "bg-rose-50 border-rose-400 text-rose-600 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-400"
                          : pin.length === index
                          ? "bg-white border-rose-500 dark:bg-gray-900 dark:border-rose-600 scale-102 ring-2 ring-rose-100 dark:ring-rose-950/40"
                          : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800"
                      }`}
                    >
                      {digit ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-scale-in" />
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </div>

              {errorMsg ? (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5 animate-pulse">
                  <AlertCircle size={10} /> {errorMsg}
                </p>
              ) : (
                <p className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 mt-1">
                  Default developer PIN is <span className="font-extrabold text-gray-850 dark:text-white">1234</span>
                </p>
              )}
            </div>

            {/* PREMIUM NUMERICAL KEYPAD */}
            <div className="grid grid-cols-3 gap-2.5 max-w-65 mx-auto pt-2 border-t border-gray-100 dark:border-gray-800">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num)}
                  disabled={loading}
                  className="h-11 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800/80 flex items-center justify-center font-bold text-base text-gray-800 dark:text-gray-250 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90 transition-all select-none cursor-pointer"
                >
                  {num}
                </button>
              ))}
              
              {/* Backspace / Delete */}
              <button
                type="button"
                onClick={handleBackspace}
                disabled={loading}
                className="h-11 rounded-xl bg-gray-50/50 dark:bg-gray-850/50 border border-transparent flex items-center justify-center font-bold text-xs text-gray-400 hover:text-rose-500 hover:bg-rose-50/30 dark:hover:bg-rose-950/10 active:scale-90 transition-all select-none cursor-pointer"
              >
                ⌫
              </button>

              <button
                type="button"
                onClick={() => handleKeyPress(0)}
                disabled={loading}
                className="h-11 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-100 dark:border-gray-800/80 flex items-center justify-center font-bold text-base text-gray-800 dark:text-gray-250 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90 transition-all select-none cursor-pointer"
              >
                0
              </button>

              <button
                type="button"
                onClick={() => pin.length === 4 && handlePayment()}
                disabled={loading || pin.length < 4}
                className={`h-11 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs active:scale-90 transition-all select-none cursor-pointer ${
                  pin.length === 4
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "..." : "Pay"}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Shake Keyframe styling and slide animations directly injected */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes scale-in {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}