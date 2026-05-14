"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../utils/authContext.js";
import background from "@/public/images/bg.jpg";

export default function AuthForm({ type = "login" }) {
  const api = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role:"",
  });

  const [loading, setLoading] = useState(false);

  const isRegister = type === "register";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const url = isRegister ? `${api}/auth/signup` : `${api}/auth/login`;

      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };

      const res = await axios.post(url, payload);
      const user =
        res.data?.user || res.data?.data?.user || res.data?.data || null;
      const accessToken =
        res.data?.accessToken || res.data?.data?.accessToken || "";
      const refreshToken =
        res.data?.refreshToken || res.data?.data?.refreshToken || "";

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
      console.log("SERVER ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-rose-950 flex items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <Image
        src={background}
        alt="bg"
        fill
        priority
        className="object-cover opacity-60"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 " />

      {/* Form Card */}
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

        {/* Switch */}
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
