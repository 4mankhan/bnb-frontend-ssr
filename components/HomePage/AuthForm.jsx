"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation, useSignupMutation } from "@/lib/api";
import background from "@/public/images/bg.jpg";
import { Mail, Lock, User, UserCheck, ArrowRight, Hotel, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/slice/authSlice";

export default function AuthForm({ type = "login" }) {
  const router = useRouter();
const dispatch = useDispatch();

  const [loginUser, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signupUser, { isLoading: isSignupLoading }] = useSignupMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default to user to prevent empty submissions
  });

  const isRegister = type === "register";
  const loading = isRegister ? isSignupLoading : isLoginLoading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };

      const authMutation = isRegister ? signupUser : loginUser;
      const response = await authMutation(payload).unwrap();
      const user = response.data.user;
      await dispatch(
        setCredentials({user: response.data})).unwrap();

      toast.success(isRegister ? "Account created successfully!" : "Welcome back!");

      if (user?.role === "owner") {
        router.push("/owner");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("FULL ERROR:", err);
      const msg = err?.data?.message || err?.message || "Authentication failed. Please check your credentials.";
      toast.error(msg);
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-900 dark:bg-slate-950 flex items-center justify-center px-4 overflow-hidden">
      {/* Background Image with Dark Overlay */}
      
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-black/40 to-slate-900/70" />

      {/* Card Container */}
      <div className="relative z-10 bg-white/95 dark:bg-gray-900/90 backdrop-blur-md shadow-2xl border border-white/20 dark:border-gray-800/80 rounded-3xl p-6 md:p-8 w-full max-w-md text-center transition-all duration-300">
        
        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center gap-1.5 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25">
            <Hotel className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent tracking-tight">
            Aman Inns
          </span>
        </div>

        {/* Header Title */}
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          {isRegister ? "Create an Account" : "Sign In"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 mb-6">
          {isRegister 
            ? "Join us to find the most cozy stays around the world." 
            : "Enter your credentials to access your account."}
        </p>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              {/* Full Name */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500/80 transition-colors dark:text-gray-200"
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Role</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <UserCheck className="h-4 w-4" />
                  </span>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500/80 transition-colors dark:text-gray-200 cursor-pointer"
                  >
                    <option value="user">User / Traveler</option>
                    <option value="owner">Property Owner</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500/80 transition-colors dark:text-gray-200"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Password</label>
              {!isRegister && (
                <span className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer transition">
                  Forgot?
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Lock className="h-4 w-4" />
              </span>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:focus:border-rose-500/80 transition-colors dark:text-gray-200"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white py-3 px-4 font-bold text-sm hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 disabled:opacity-50 transition active:scale-98 cursor-pointer mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : (
              <>
                {isRegister ? "Register" : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-gray-200 dark:border-gray-800"></div>
          <span className="shrink mx-4 text-[11px] text-gray-400 uppercase font-bold tracking-wider">or continue with</span>
          <div className="grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition active:scale-95 cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition active:scale-95 cursor-pointer"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs mt-6 text-gray-500 dark:text-gray-400">
          {isRegister ? "Already have an account?" : "New to AmanBnB?"}
          <span
            onClick={() => router.push(isRegister ? "/login" : "/signup")}
            className="ml-1.5 text-rose-500 hover:text-rose-600 cursor-pointer font-bold transition"
          >
            {isRegister ? "Sign In" : "Register Now"}
          </span>
        </p>
      </div>
    </main>
  );
}
