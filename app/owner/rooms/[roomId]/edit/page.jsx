"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateOwnerRoomMutation, useGetRoomByIdQuery } from "@/lib/api";
import { baseApi } from "@/lib/api/baseApi";
import uploadToCloudinary from "@/utils/uploadToCloudinary";

const initialForm = {
  type: "",
  basePrice: "",
  amenities: "",
  totalCount: "",
  photos: [],
  capacity: {
    adults: 2,
    children: 0,
    infants: 0,
  },
};
import Image from "next/image";

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const roomId = params?.roomId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: room, isLoading } = useGetRoomByIdQuery(roomId, {
    skip: !roomId,
  });

  const hotelId = room?.hotelId;

  const [updateOwnerRoom, { isLoading: submitting }] =
    useUpdateOwnerRoomMutation();

useEffect(() => {
  if (!room) return;

  setImages(
    (room.photos || []).map((photo) => ({
      ...photo,
      isNew: false,
    })),
  );

  setForm({
    type: room.type || "",
    basePrice: room.basePrice ?? "",
    amenities: Array.isArray(room.amenities)
      ? room.amenities.join(", ")
      : room.amenities || "",
    totalCount: room.totalCount ?? "",
    capacity: {
      adults: room.capacity?.adults ?? 2,
      children: room.capacity?.children ?? 0,
      infants: room.capacity?.infants ?? 0,
    },
  });
}, [room]);

const allImages = images;

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

  try {
    setError("");

    if (images.length !== 2) {
      setError("Please keep exactly 2 images.");
      return;
    }

    setUploading(true);

    // Upload only newly added images
    const uploadedNewImages = await Promise.all(
      images
        .filter((img) => img.isNew)
        .map((img) => uploadToCloudinary(img.file)),
    );

    // Keep existing backend images
    const existingImages = images.filter(
      (img) => !img.isNew,
    );

    // Final photos array
    const finalPhotos = [
      ...existingImages,
      ...uploadedNewImages,
    ];

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
      photos: finalPhotos,
    };

    await updateOwnerRoom(payload).unwrap();

    // router.back();
  } catch (err) {
    setError(
      err?.data?.message ||
      err?.message ||
      "Could not update room."
    );
  } finally {
    setUploading(false);
  }
};

  if (loading || isLoading) {
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allImages.map((img, index) => (
            <div key={img.public_id || img.id || index} className="relative">
              <div className="relative h-40 md:h-60 w-full">
                {img.isNew ? (
                  <img
                    src={img.preview}
                    alt="Preview"
                    className="rounded-xl border object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={img.url}
                    alt="Room"
                    fill
                    sizes="(max-width:768px) 50vw, 33vw"
                    className="rounded-xl border object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
  const key = img.isNew ? img.id : img.public_id;

  setImages((prev) =>
    prev.filter((item) => {
      const itemKey = item.isNew
        ? item.id
        : item.public_id;

      return itemKey !== key;
    }),
  );
}}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
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
                url: "", // empty for now (will be filled after upload)
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
          disabled={submitting || uploading}
          className="rounded-full bg-rose-500 px-5 py-2.5 text-sm text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {submitting || uploading ? "Updating..." : "Update Room"}
        </button>
      </form>
    </section>
  );
}
