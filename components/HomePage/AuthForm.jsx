"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../utils/authContext.js";
import { useLoginMutation, useSignupMutation } from "@/lib/api";
import background from "@/public/images/bg.jpg";

export default function AuthForm({ type = "login" }) {
  const router = useRouter();
  const { login } = useAuth();

  const [loginUser, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signupUser, { isLoading: isSignupLoading }] = useSignupMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const isRegister = type === "register";
  const loading = isRegister ? isSignupLoading : isLoginLoading;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };

      const authMutation = isRegister ? signupUser : loginUser;
      const { user, accessToken, refreshToken } = await authMutation(
        payload,
      ).unwrap();

      login({
        user,
        accessToken,
        refreshToken,
      });

      if (user?.role === "owner") {
        router.push("/owner");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.log("FULL ERROR:", err);
      alert(err?.data?.message || "Login failed");
    }
  };

  return (
    <main className="relative min-h-screen bg-rose-950 flex items-center justify-center px-4 overflow-hidden">
      <Image
        src={background}
        alt="bg"
        fill
        priority
        className="object-cover opacity-60"
      />

      <div className="absolute inset-0 " />

      <div className="relative z-10 bg-white backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-serif text-rose-500 mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <div className="space-y-4">
          {isRegister && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border text-rose-600 border-rose-500 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border text-rose-600 border-rose-500 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 mt-3"
              >
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-rose-500 text-rose-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-rose-500 p-3 text-rose-600 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-rose-500 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </button>
        </div>

        <p className="text-center text-sm mt-6 text-gray-700">
          {isRegister ? "Already have an account?" : "New here?"}
          <span
            onClick={() => router.push(isRegister ? "/login" : "/signup")}
            className="ml-2 text-rose-500 cursor-pointer font-medium"
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </main>
  );
}
