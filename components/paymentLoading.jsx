"use client";

import { Loader2, ShieldCheck, Lock } from "lucide-react";

export default function PaymentLoadingOverlay({
  message
}) {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/80 backdrop-blur-xl px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Top Accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-rose-500 via-rose-400 to-rose-500" />

        <div className="p-8">
          {/* Loading Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/20">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
          </div>

          {/* Title */}
          <h2 className="mt-7 text-center text-2xl font-bold text-gray-900 dark:text-white">
            {message}
          </h2>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-gray-500 dark:text-gray-400">
            We&apos;re securely communicating with Razorpay to complete your booking.
            This usually takes only a few seconds.
          </p>

          {/* Animated Progress */}
          <div className="mt-8 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className="h-full w-1/3 rounded-full bg-rose-500 animate-[loading_1.6s_ease-in-out_infinite]" />
          </div>

          {/* Security Badge */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>256-bit SSL Secured via Razorpay</span>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/20">
                <Lock className="h-4 w-4 text-rose-500" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Please keep this page open
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Don&apos;t refresh the page, close the tab, or press the back
                  button until your payment and booking confirmation are
                  completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(420%);
          }
        }
      `}</style>
    </div>
  );
}