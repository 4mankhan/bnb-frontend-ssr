"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOwnerRoomMutation } from "@/lib/api";

const initialForm = {
  type: "",
  basePrice: "",
  amenities: "",
  photos: "",
  totalCount: "",
  capacity: {
    adults: 2,
    children: 0,
    infants: 0,
  },
};

export default function CreateRoomPage() {
  const router = useRouter();
  const params = useParams();
  const hotelId = params?.hotelId;

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [createOwnerRoom, { isLoading: submitting }] =
    useCreateOwnerRoomMutation();

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
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      hotelId,
      ...form,
      basePrice: Number(form.basePrice),
      totalCount: Number(form.totalCount),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      photos: form.photos
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .slice(0, 2),
    };

    try {
      setError("");
      await createOwnerRoom(payload).unwrap();
      router.push(`/owner/hotels/${hotelId}`);
    } catch (err) {
      setError(err?.data?.message || "Could not create room.");
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Create Room</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add a new room to this hotel listing.
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
          placeholder="Room type (Deluxe, Suite...)"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="basePrice"
          value={form.basePrice}
          onChange={handleChange}
          type="number"
          placeholder="Base price per night"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="totalCount"
          value={form.totalCount}
          onChange={handleChange}
          type="number"
          placeholder="Total rooms available"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="photos"
          value={form.photos}
          onChange={handleChange}
          placeholder="Image URLs (comma separated, max 2)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="amenities"
          value={form.amenities}
          onChange={handleChange}
          placeholder="Amenities (wifi, AC, TV...)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <h4 className="font-medium mt-2">Capacity</h4>

        <div className="grid grid-cols-3 gap-3">
          <input
            name="capacity.adults"
            type="number"
            min="1"
            value={form.capacity.adults}
            onChange={handleChange}
            placeholder="Adults"
            className="rounded-xl border px-3 py-2.5 text-sm"
          />

          <input
            name="capacity.children"
            type="number"
            min="0"
            value={form.capacity.children}
            onChange={handleChange}
            placeholder="Children"
            className="rounded-xl border px-3 py-2.5 text-sm"
          />

          <input
            name="capacity.infants"
            type="number"
            min="0"
            value={form.capacity.infants}
            onChange={handleChange}
            placeholder="Infants"
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
          {submitting ? "Creating..." : "Create Room"}
        </button>
      </form>
    </section>
  );
}
