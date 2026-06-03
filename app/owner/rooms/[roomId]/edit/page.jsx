"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useGetOwnerHotelsQuery,
  useUpdateOwnerRoomMutation,
} from "@/lib/api";
import { baseApi } from "@/lib/api/baseApi";

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
  const dispatch = useDispatch();
  const roomId = params?.roomId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [hotelId, setHotelId] = useState(null);

  const { data: hotels = [], isLoading: isHotelsLoading } =
    useGetOwnerHotelsQuery();

  const [updateOwnerRoom, { isLoading: submitting }] =
    useUpdateOwnerRoomMutation();

  useEffect(() => {
    if (!roomId || !hotels.length) return;

    let cancelled = false;

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError("");

        let foundRoom = null;
        let foundHotelId = null;

        for (const hotel of hotels) {
          const rooms = await dispatch(
            baseApi.endpoints.getOwnerHotelRooms.initiate(hotel._id),
          ).unwrap();

          const match = rooms.find((room) => room._id === roomId);

          if (match) {
            foundRoom = match;
            foundHotelId = hotel._id;
            break;
          }
        }

        if (cancelled) return;

        if (!foundRoom) throw new Error("Room not found.");

        setHotelId(foundHotelId);
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
        if (!cancelled) {
          setError(err?.message || "Could not load room.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRoom();

    return () => {
      cancelled = true;
    };
  }, [roomId, hotels, dispatch]);

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

    const payload = {
      roomId,
      hotelId,
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
      setError("");
      await updateOwnerRoom(payload).unwrap();
      router.back();
    } catch (err) {
      setError(err?.data?.message || "Could not update room.");
    }
  };

  if (loading || isHotelsLoading) {
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

        <input
          name="amenities"
          value={form.amenities}
          onChange={handleChange}
          placeholder="Amenities (wifi, AC...)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

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
