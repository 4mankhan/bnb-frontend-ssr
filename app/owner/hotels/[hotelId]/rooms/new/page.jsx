"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCreateOwnerRoomMutation } from "@/lib/api";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UploadCloud, X, BedDouble, AlertCircle, Users, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

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
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

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

    try {
      setError("");
      
      if (images.length !== 2) {
        setError("Please upload exactly 2 images.");
        toast.error("Please upload exactly 2 images.");
        return;
      }
      
      setUploading(true);

      // 1. upload both images to cloudinary
      const uploadedUrls = await Promise.all(
        images.map((image) => uploadToCloudinary(image.file)),
      );

      // 2. build payload
      const payload = {
        hotelId,
        ...form,
        basePrice: Number(form.basePrice),
        totalCount: Number(form.totalCount),
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        photos: uploadedUrls,
      };

      // 3. send to backend
      await createOwnerRoom(payload).unwrap();
      toast.success("Room created successfully!");
      router.push(`/owner/hotels/${hotelId}`);
    } catch (err) {
      console.error("CREATE ROOM ERROR:", err);
      setError(
        err?.data?.message ||
          err?.message ||
          "Could not create room.",
      );
      toast.error("Failed to create room.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const previews = images.map((img) => img.preview);

    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [images]);

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center gap-3">
        <Link
          href={`/owner/hotels/${hotelId}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-95 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add Room Selection</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Define pricing, images, and inventory for this room type
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Room specs */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
              <BedDouble className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Room Specifications</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Room Type / Category *</label>
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g. Deluxe Ocean View Suite"
                required
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Base Price per Night *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">₹</span>
                  <input
                    name="basePrice"
                    value={form.basePrice}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    placeholder="Price per night"
                    required
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-8 pr-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Total Rooms Available *</label>
                <input
                  name="totalCount"
                  value={form.totalCount}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  placeholder="Inventory count"
                  required
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Room Amenities</label>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">Comma-separated</span>
              </div>
              <input
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="e.g. King Bed, Air Conditioning, Private Balcony, Bathtub, Flat TV"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Media */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
                <UploadCloud className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Room Photos</h3>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              images.length === 2
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
            }`}>
              {images.length} / 2 selected
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Please upload <span className="font-bold text-gray-800 dark:text-gray-200">exactly 2 photos</span> of the room to complete listing activation.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 group">
                <div className="relative h-36 md:h-52 w-full">
                  {image.isNew ? (
                    <img
                      src={image.preview}
                      alt="Room"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Image
                      src={image.url}
                      alt="Room"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) =>
                      prev.filter((img) => img.id !== image.id)
                    )
                  }
                  className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {images.length < 2 && (
            <div className="group relative">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-7 bg-gray-50/50 dark:bg-gray-950/20 hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-rose-400 dark:hover:border-rose-900/50 transition cursor-pointer text-center">
                <UploadCloud className="h-9 w-9 text-gray-400 dark:text-gray-500 group-hover:text-rose-500 transition mb-2" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Click to upload photos</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">Select 1 or more images (limit 2)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files) return;

                    const newImages = Array.from(files).map((file) => ({
                      id: crypto.randomUUID(),
                      file,
                      preview: URL.createObjectURL(file),
                      url: "",
                      isNew: true,
                    }));

                    setImages((prev) => {
                      const updated = [...prev, ...newImages];
                      if (updated.length > 2) {
                        updated.splice(0, updated.length - 2);
                      }
                      return updated;
                    });

                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Section 3: Capacity */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
              <Users className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Room Capacity</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Adults *</label>
              <input
                name="capacity.adults"
                type="number"
                min="1"
                value={form.capacity.adults}
                onChange={handleChange}
                placeholder="Adults"
                required
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Children</label>
              <input
                name="capacity.children"
                type="number"
                min="0"
                value={form.capacity.children}
                onChange={handleChange}
                placeholder="Children"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Infants</label>
              <input
                name="capacity.infants"
                type="number"
                min="0"
                value={form.capacity.infants}
                onChange={handleChange}
                placeholder="Infants"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href={`/owner/hotels/${hotelId}`}
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
              "Create Room"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
