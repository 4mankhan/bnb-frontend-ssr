"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOwnerHotelMutation } from "@/lib/api";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import Image from "next/image";

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
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
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
    setUploading(true);

    let photoUrl = ""; // declare outside

    if (image?.file) {
      console.log("before upload");

      photoUrl = await uploadToCloudinary(image.file);

      console.log("after upload");
    }

    const payload = {
      ...form,
      photos: photoUrl ? [photoUrl] : [],
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    console.log("PAYLOAD:", payload);

    await createOwnerHotel(payload).unwrap();

    router.push("/owner/hotels");
  } catch (err) {
    console.log("ERROR:", err);
    setError(err?.data?.message || "Failed to create hotel.");
  } finally {
    setUploading(false);
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

        <div className="grid grid-cols-1 gap-3">
          {image && (
            <div className="relative">
              <div className="relative h-40 md:h-80 w-full">
                {image.isNew ? (
                  <img
                    src={image.preview}
                    alt="Hotel"
                    className="rounded-xl border object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={image.url}
                    alt="Hotel"
                    fill
                    className="rounded-xl border object-cover"
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const newImage = {
              id: crypto.randomUUID(),
              file,
              preview: URL.createObjectURL(file),
              url: "",
              isNew: true,
            };

            setImage(newImage);

            e.target.value = "";
          }}
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
          disabled={submitting || uploading}
          className="rounded-full bg-rose-500 px-5 py-2.5 text-sm text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {submitting || uploading ? "Creating..." : "Create Hotel"}
        </button>
      </form>
    </section>
  );
}
