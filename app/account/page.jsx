"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import background from "../../public/images/bg.jpg";
import { useAuth } from "../../utils/authContext.js";
import { Pencil, Check, X } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, setUser, logout, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const api = process.env.NEXT_PUBLIC_API_URL;

const fetchUserProfile = useCallback(async () => {
  try {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${api}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
  
    if (!res.ok) throw new Error(data.error);
      setUser(data);

    setFormData({
      name: data.name,
      email: data.email,
      password: "",
    });

    localStorage.setItem("user", JSON.stringify(data));

  } catch (err) {
    console.error(err);
  }
}, [api,setUser]);

useEffect(() => {
  if (loading) return;

  if (!user) {
    router.push("/login");
    return;
  }

  fetchUserProfile();
}, [loading, user, fetchUserProfile, router]); //

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
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${api}/auth/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
     setUser(data);

    // Update localStorage with fresh user
    localStorage.setItem("user", JSON.stringify(data));

    // Update UI instantly (no reload)
    setFormData({
      name: data.name,
      email: data.email,
      password: "",
    });
    

    setIsEditing(false);

  } catch (err) {
    alert(err.message);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
   <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-200">
  
  {/* Background */}
  <Image
    src={background}
    alt="background"
    fill
    priority
    className="object-cover opacity-40 dark:opacity-20"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-sm z-10" />

  {/* Card */}
  <div className="relative z-20 w-full max-w-md rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-colors">
    
    {/* Top Actions */}
    <div className="flex justify-end">
      {!isEditing ? (
        <Pencil
          className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          onClick={() => setIsEditing(true)}
        />
      ) : (
        <div className="flex gap-3">
          <Check
            className="cursor-pointer text-green-500 hover:scale-110 transition"
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

    {/* Profile Header */}
    <div className="flex items-center gap-6 mt-2">
      
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center text-2xl font-bold shadow-md">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <div className="flex-1 space-y-2">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
          {user.role}
        </span>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            User ID
          </p>
          <p className="text-sm text-rose-500 break-all">{user.id}</p>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

    {/* NAME */}
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

    {/* EMAIL */}
    {isEditing ? (
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="mt-4 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
        placeholder="Your email"
      />
    ) : (
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {user.email}
      </p>
    )}

    {/* PASSWORD */}
    {isEditing && (
      <input
        type="password"
        name="password"
        placeholder="Enter current password"
        value={formData.password}
        onChange={handleChange}
        className="mt-4 w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition"
      />
    )}

    {/* Logout */}
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