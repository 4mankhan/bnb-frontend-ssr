"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
}

const initialForm = {
  type: "",
  basePrice: "",
  amenities: "",
  photo1: "",
  photo2: "",
  totalCount: "",
  capacity: {
    adults: 2,
    children: 0,
    infants: 0,
  },
};

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const token = getAccessToken();
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const hotelsRes = await fetch(`${API_BASE_URL}/owner/hotels`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!hotelsRes.ok) throw new Error("Failed to fetch hotels.");
        const hotelsData = await hotelsRes.json();
        const hotels = hotelsData?.data || hotelsData || [];

        let foundRoom = null;

        for (const hotel of hotels) {
          const roomRes = await fetch(
            `${API_BASE_URL}/owner/hotels/${hotel._id}/rooms`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!roomRes.ok) continue;

          const roomData = await roomRes.json();
          const rooms = roomData?.data || roomData || [];

          const match = rooms.find((room) => room._id === roomId);

          if (match) {
            foundRoom = match;
            break;
          }
        }

        if (!foundRoom) throw new Error("Room not found.");

        setForm({
          type: foundRoom.type || "",
          basePrice: foundRoom.basePrice || "",
          totalCount: foundRoom.totalCount || "",
          amenities: (foundRoom.amenities || []).join(", "),
          photo1: foundRoom.photos?.[0] || "",
          photo2: foundRoom.photos?.[1] || "",
          capacity: {
            adults: foundRoom.capacity?.adults || 2,
            children: foundRoom.capacity?.children || 0,
            infants: foundRoom.capacity?.infants || 0,
          },
        });
      } catch (err) {
        setError(err.message || "Could not load room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("capacity.")) {
      const key = name.split(".")[1];

      setForm((prev) => ({
        ...prev,
        capacity: {
          ...prev.capacity,
          [key]: Number(value),
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAccessToken();

    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      totalCount: Number(form.totalCount),
        amenities: form.amenities
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean),
      photos: [form.photo1, form.photo2].filter(Boolean),
    };

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/owner/rooms/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update room.");
      }

      router.back();
    } catch (err) {
      setError(err.message || "Could not update room.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-40 rounded-2xl bg-white dark:bg-gray-900 border animate-pulse" />
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Edit Room</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Update room details, pricing, and capacity.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-white dark:bg-gray-900 p-5 space-y-3 shadow-sm"
      >
        {/* Basic */}
        <input
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Room type"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="basePrice"
          type="number"
          value={form.basePrice}
          onChange={handleChange}
          placeholder="Base price"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="totalCount"
          type="number"
          value={form.totalCount}
          onChange={handleChange}
          placeholder="Total rooms"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        {/* Photos */}
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="photo1"
            value={form.photo1}
            onChange={handleChange}
            placeholder="Image URL 1"
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
          <input
            name="photo2"
            value={form.photo2}
            onChange={handleChange}
            placeholder="Image URL 2"
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>

        {/* Amenities */}
        <input
          name="amenities"
          value={form.amenities}
          onChange={handleChange}
          placeholder="Amenities (wifi, AC...)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        {/* Capacity */}
        <h4 className="font-medium mt-2">Capacity</h4>

        <div className="grid grid-cols-3 gap-3">
          <input
            name="capacity.adults"
            type="number"
            value={form.capacity.adults}
            onChange={handleChange}
            className="rounded-xl border px-3 py-2.5 text-sm"
          />
          <input
            name="capacity.children"
            type="number"
            value={form.capacity.children}
            onChange={handleChange}
            className="rounded-xl border px-3 py-2.5 text-sm"
          />
          <input
            name="capacity.infants"
            type="number"
            value={form.capacity.infants}
            onChange={handleChange}
            className="rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-rose-500 px-5 py-2.5 text-sm text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Room"}
        </button>
      </form>
    </section>
  );
}