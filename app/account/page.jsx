"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import background from "../../public/images/bg.jpg";
import { useAuth } from "../../utils/authContext.js";
import { Pencil, Check, X } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
      });
    }
  }, [user, loading, router]);

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

      // optional: refresh user state
      window.location.reload();

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
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      
      <Image
        src={background}
        alt="background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 z-10" />

      <div className="relative z-20 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">
        
        {/* EDIT ICON */}
        <div className="flex justify-end">
          {!isEditing ? (
            <Pencil
              className="cursor-pointer text-gray-600 hover:text-black"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <div className="flex gap-2">
              <Check
                className="cursor-pointer text-green-600"
                onClick={handleUpdate}
              />
              <X
                className="cursor-pointer text-red-600"
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

        <div className="flex flex-row gap-10">

          <div className="flex flex-col">
                {/* Avatar */}
        <div className="w-20 h-20 mx-auto rounded-full bg-rose-500 text-white flex items-center justify-center text-2xl font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>
              {/* ROLE (NON-EDITABLE) */}
        <span className="inline-block mt-3 px-3 py-1 text-sm text-rose-600 font-extrabold bg-red-100 rounded-full">
          {user.role}
        </span>
        
          </div>
          

         <div className="text-left space-y-3 pt-10">
          <div>
            <p className="text-sm text-gray-500 font-bold">User ID</p>
            <p className="font-medium text-xs md:text-lg break-all text-rose-500">
              {user.id}
            </p>
            <div className="border-rose-500 border-t my-5"></div>
          </div>
        </div>

          </div>

        
      

        {/* NAME */}
        {isEditing ? (
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-4 w-full text-rose-600 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        ) : (
          <h2 className="text-2xl font-semibold mt-4 text-rose-600">
            {user.name}
          </h2>
        )}

        {/* EMAIL */}
        {isEditing ? (
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-4 w-full text-rose-600 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        ) : (
          <p className="text-red-500">{user.email}</p>
        )}

    

        {/* PASSWORD FIELD (ONLY IN EDIT MODE) */}
        {isEditing && (
          <input
            type="password"
            name="password"
            placeholder="Enter current password"
            value={formData.password}
            onChange={handleChange}
            className="mt-4 w-full text-rose-600 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
        )}

  
       
        {!isEditing && <button
          onClick={handleLogout}
          className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Logout
        </button>}
      </div>
    </main>
  );
}