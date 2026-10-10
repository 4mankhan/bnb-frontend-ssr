
"use client";

import {
  Loader2,
  ShieldCheck,
  LockKeyhole,
  CreditCard,
  Fingerprint,
  Sparkles,
} from "lucide-react";

export default function PaymentLoadingOverlay({
  message = "Processing your payment",
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-loading-title"
      aria-describedby="payment-loading-description"
    >
      {/* Ambient background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/15 blur-[120px]"
      />

      <div className="relative my-auto w-full max-w-[440px] animate-[payment-enter_0.45s_cubic-bezier(0.16,1,0.3,1)]">
        {/* Premium outer glow */}
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[32px] bg-gradient-to-b from-white/70 via-rose-200/40 to-white/10 opacity-80"
        />

        <div className="relative overflow-hidden rounded-[31px] border border-white/70 bg-white shadow-[0_32px_100px_-24px_rgba(0,0,0,0.6)] dark:border-white/10 dark:bg-slate-950">
          {/* Top accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-rose-300 via-rose-500 to-orange-400" />

          {/* Subtle decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-20 h-48 w-64 -translate-x-1/2 rounded-full bg-rose-100/70 blur-[70px] dark:bg-rose-500/[0.08]"
          />

          <div className="relative px-6 pb-7 pt-7 sm:px-9 sm:pb-9 sm:pt-8">
            {/* Brand / checkout identity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-rose-100 bg-gradient-to-br from-white to-rose-50 shadow-sm dark:border-rose-500/20 dark:from-rose-500/10 dark:to-rose-500/5">
                  <CreditCard className="h-[19px] w-[19px] text-rose-600 dark:text-rose-400" />
                </div>

                <div>
                  <p className="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Secure checkout
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
                    PAYMENT AUTHENTICATION
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-1.5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  In progress
                </span>
              </div>
            </div>

            {/* Animated payment emblem */}
            <div className="relative mx-auto mt-10 flex h-[142px] w-[142px] items-center justify-center">
              {/* Orbital rings */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-rose-200/80 dark:border-rose-400/15"
              />

              <div
                aria-hidden="true"
                className="absolute inset-[10px] rounded-full border border-dashed border-rose-300/80 payment-orbit dark:border-rose-400/25"
              />

              <div
                aria-hidden="true"
                className="absolute inset-[21px] rounded-full bg-gradient-to-br from-rose-100/80 via-white to-orange-50 shadow-inner dark:from-rose-500/10 dark:via-slate-900 dark:to-orange-500/[0.06]"
              />

              {/* Core */}
              <div className="relative z-10 flex h-[74px] w-[74px] items-center justify-center rounded-[25px] bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 text-white shadow-[0_12px_32px_-8px_rgba(225,29,72,0.65)] ring-[5px] ring-white dark:ring-slate-950">
                <Loader2 className="h-8 w-8 payment-spinner" />
              </div>

              {/* Floating security badge */}
              <div className="absolute right-[3px] top-[15px] z-20 flex h-9 w-9 items-center justify-center rounded-2xl border-[3px] border-white bg-emerald-500 text-white shadow-lg dark:border-slate-950">
                <LockKeyhole className="h-4 w-4" />
              </div>

              {/* Decorative sparkle */}
              <Sparkles
                aria-hidden="true"
                className="absolute left-1 top-[36px] h-4 w-4 text-rose-400/80"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-[12px] right-[10px] h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.65)]"
              />
            </div>

            {/* Main copy */}
            <div className="mt-7 text-center">
              <h2
                id="payment-loading-title"
                className="text-[25px] font-bold leading-tight tracking-[-0.8px] text-slate-950 dark:text-white sm:text-[28px]"
              >
                {message}
              </h2>

              <p
                id="payment-loading-description"
                className="mx-auto mt-3 max-w-[305px] text-[13px] leading-[1.8] text-slate-500 dark:text-slate-400"
              >
                We’re securely processing your payment and confirming your
                booking. This should only take a few moments.
              </p>
            </div>

            {/* Animated progress */}
            <div className="mt-8">
              <div
                className="relative h-[5px] overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                role="progressbar"
                aria-label="Payment processing"
                aria-valuetext="Payment is being processed"
              >
                <div className="payment-progress relative h-full w-2/5 rounded-full bg-gradient-to-r from-rose-400 via-rose-500 to-orange-400 shadow-[0_0_12px_rgba(244,63,94,0.35)]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-slate-400 dark:text-slate-500">
                  Verifying transaction
                </span>
                <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  <Loader2 className="h-3 w-3 payment-spinner" />
                  Please wait
                </span>
              </div>
            </div>

            {/* Security assurance */}
            <div className="mt-7 overflow-hidden rounded-[20px] border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white px-4 py-4 dark:border-emerald-500/15 dark:from-emerald-500/[0.08] dark:to-slate-900">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <ShieldCheck className="h-[21px] w-[21px]" />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[12px] font-bold text-emerald-950 dark:text-emerald-300">
                    Your payment is protected
                  </p>
                  <p className="mt-1 text-[11px] leading-[1.7] text-emerald-800/75 dark:text-emerald-400/80">
                    Your transaction is being handled through Razorpay’s
                    payment infrastructure.
                  </p>
                </div>

                <Fingerprint className="mt-1 h-5 w-5 shrink-0 text-emerald-600/50 dark:text-emerald-400/40" />
              </div>
            </div>

            {/* Important notice */}
            <div className="mt-3.5 flex items-start gap-3 rounded-[18px] border border-slate-200/80 bg-slate-50/80 px-4 py-3.5 dark:border-white/[0.07] dark:bg-white/[0.025]">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                <LockKeyhole className="h-[15px] w-[15px]" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Please keep this page open
                </p>
                <p className="mt-1 text-[11px] leading-[1.7] text-slate-500 dark:text-slate-400">
                  Avoid refreshing or navigating away while we finalize your
                  payment and booking confirmation.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
                Encrypted connection · Secure checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Motion and accessibility */}
      <style jsx global>{`
        @keyframes payment-orbit-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes payment-progress-sweep {
          0% {
            transform: translateX(-160%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        @keyframes payment-enter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.975);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .payment-spinner {
          animation: payment-orbit-spin 1.1s linear infinite;
        }

        .payment-orbit {
          animation: payment-orbit-spin 12s linear infinite;
        }

        .payment-progress {
          overflow: hidden;
          animation: payment-progress-sweep 1.8s ease-in-out infinite;
        }

        .payment-progress::after {
          content: "";
          position: absolute;
          inset: 0;
          width: 55%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: payment-progress-sweep 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .payment-spinner,
          .payment-orbit,
          .payment-progress,
          .payment-progress::after {
            animation: none !important;
          }

          [class*="payment-enter"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}