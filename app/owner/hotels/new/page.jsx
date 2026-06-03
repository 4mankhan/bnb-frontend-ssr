"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOwnerHotelMutation } from "@/lib/api";

const initialForm = {
  name: "",
  city: "",
  photos: "",
  amenities: "",
  contactInfo: {
    completeAddress: "",
    location: "",
    email: "",
    phoneNumber: "",
  },
};

export default function CreateHotelPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [createOwnerHotel, { isLoading: submitting }] =
    useCreateOwnerHotelMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contactInfo.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        ...form,
        photos: form.photos
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };

      await createOwnerHotel(payload).unwrap();
      router.push("/owner/hotels");
    } catch (err) {
      setError(err?.data?.message || "Failed to create hotel.");
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Create Hotel</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add a fresh listing with complete details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 shadow-sm"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Hotel name"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          required
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="photos"
          value={form.photos}
          onChange={handleChange}
          placeholder="Photo URLs (comma separated)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="amenities"
          value={form.amenities}
          onChange={handleChange}
          placeholder="Amenities (wifi, pool, parking...)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <h3 className="font-medium mt-3">Contact Info</h3>

        <input
          name="contactInfo.completeAddress"
          value={form.contactInfo.completeAddress}
          onChange={handleChange}
          placeholder="Complete Address"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="contactInfo.location"
          value={form.contactInfo.location}
          onChange={handleChange}
          placeholder="Location (Google Maps link or coords)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="contactInfo.email"
          value={form.contactInfo.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          name="contactInfo.phoneNumber"
          value={form.contactInfo.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

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
          {submitting ? "Creating..." : "Create Hotel"}
        </button>
      </form>
    </section>
  );
}
