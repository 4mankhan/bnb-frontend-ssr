"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateOwnerHotelMutation } from "@/lib/api";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UploadCloud, X, MapPin, Building, Mail, Phone, Sparkles, AlertCircle } from "lucide-react";

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

      let photoUrl = "";

      if (image?.file) {
        photoUrl = await uploadToCloudinary(image.file);
      }

      const payload = {
        ...form,
        photos: photoUrl ? [photoUrl] : [],
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };

      await createOwnerHotel(payload).unwrap();
      router.push("/owner/hotels");
    } catch (err) {
      console.error("ERROR:", err);
      setError(err?.data?.message || "Failed to create hotel.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      {/* Back & Header Link */}
      <div className="flex items-center gap-3">
        <Link
          href="/owner/hotels"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-95 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add Property</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Publish a new hotel listing to the search directory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Info */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
              <Building className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Property Information</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Hotel Name *</label>
              <div className="relative">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Grand Palace Resort"
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">City / Destination *</label>
              <div className="relative">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Goa"
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Amenities</label>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">Comma-separated</span>
            </div>
            <input
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              placeholder="e.g. WiFi, Pool, Spa, Free Parking, Gym"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Media Assets */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
              <UploadCloud className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Cover Photo</h3>
          </div>

          {image ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <div className="relative h-48 md:h-64 w-full">
                {image.isNew ? (
                  <img
                    src={image.preview}
                    alt="Hotel Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={image.url}
                    alt="Hotel"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="group relative">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 bg-gray-50/50 dark:bg-gray-950/20 hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-rose-400 dark:hover:border-rose-900/50 transition cursor-pointer text-center">
                <UploadCloud className="h-10 w-10 text-gray-400 dark:text-gray-500 group-hover:text-rose-500 transition mb-3" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload a cover photo</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, JPEG (will be hosted securely)</span>
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
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Section 3: Contact & Location Info */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
              <MapPin className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Location & Contacts</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Complete Address</label>
              <input
                name="contactInfo.completeAddress"
                value={form.contactInfo.completeAddress}
                onChange={handleChange}
                placeholder="e.g. 101 Beach Road, North Calangute, Goa"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Maps Location URL</label>
              <input
                name="contactInfo.location"
                value={form.contactInfo.location}
                onChange={handleChange}
                placeholder="e.g. Google Maps link or coordinates"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Contact Email</label>
                <input
                  name="contactInfo.email"
                  type="email"
                  value={form.contactInfo.email}
                  onChange={handleChange}
                  placeholder="e.g. info@grandpalace.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  name="contactInfo.phoneNumber"
                  value={form.contactInfo.phoneNumber}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-400">
            <div className="flex gap-2.5">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/owner/hotels"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-6 py-2.5 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white px-7 py-2.5 text-sm font-semibold hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/10 hover:shadow-rose-500/20 disabled:opacity-50 transition active:scale-95"
          >
            {submitting || uploading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creating...
              </span>
            ) : (
              "Create Hotel"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
