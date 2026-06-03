"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import background from "../../public/images/bg.jpg";
import { useAuth } from "../../utils/authContext.js";
import { Pencil, Check, X } from "lucide-react";
import { useUpdateProfileMutation } from "@/lib/api";

export default function AccountPage() {
  const router = useRouter();
  const { user, setUser, logout, loading } = useAuth();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (loading) return <div>Loading...</div>;

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const data = await updateProfile(formData).unwrap();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setFormData({
        name: data.name,
        email: data.email,
        password: "",
      });
      setIsEditing(false);
    } catch (err) {
      alert(err?.data?.error || err?.data?.message || "Update failed");
    }
  };

  const startEditing = () => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
    });
    setIsEditing(true);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-200">
      <Image
        src={background}
        alt="background"
        fill
        priority
        className="object-cover opacity-40 dark:opacity-20"
      />

      <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-sm z-10" />

      <div className="relative z-20 w-full max-w-md rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-colors">
        <div className="flex justify-end">
          {!isEditing ? (
            <Pencil
              className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
              onClick={startEditing}
            />
          ) : (
            <div className="flex gap-3">
              <Check
                className={`cursor-pointer text-green-500 hover:scale-110 transition ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                onClick={handleUpdate}
              />
              <X
                className="cursor-pointer text-red-500 hover:scale-110 transition"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    email: user.email,
                    password: "",
                  });
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-start gap-6 mt-2">
          <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center text-2xl font-bold shadow-md shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                placeholder="Your name"
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
            )}

            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-3 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
                placeholder="Your email"
              />
            ) : (
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Role
              </span>
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

        {!isEditing && (
          <button
            onClick={handleLogout}
            className="mt-6 w-full py-3 rounded-xl font-medium bg-gray-900 hover:bg-gray-700 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </main>
  );
}
