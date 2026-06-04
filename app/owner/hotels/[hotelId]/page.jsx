"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useGetOwnerHotelByIdQuery,
  useGetOwnerHotelRoomsQuery,
  useUpdateOwnerHotelMutation,
  useActivateOwnerHotelMutation,
  useDeleteOwnerHotelMutation,
  useDeleteOwnerRoomMutation,
} from "@/lib/api";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import Image from "next/image";

export default function OwnerHotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.hotelId;

  const [error, setError] = useState("");
  const [form, setForm] = useState({
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
  });
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    data: hotel,
    isLoading: isHotelLoading,
    isError: isHotelError,
    error: hotelError,
  } = useGetOwnerHotelByIdQuery(hotelId, { skip: !hotelId });

  const { data: rooms = [], isLoading: isRoomsLoading } =
    useGetOwnerHotelRoomsQuery(hotelId, { skip: !hotelId });

  const [updateOwnerHotel, { isLoading: isUpdating }] =
    useUpdateOwnerHotelMutation();
  const [activateOwnerHotel, { isLoading: isActivating }] =
    useActivateOwnerHotelMutation();
  const [deleteOwnerHotel, { isLoading: isDeletingHotel }] =
    useDeleteOwnerHotelMutation();
  const [deleteOwnerRoom, { isLoading: isDeletingRoom }] =
    useDeleteOwnerRoomMutation();

  const saving =
    isUpdating || isActivating || isDeletingHotel || isDeletingRoom;
  const loading = isHotelLoading || isRoomsLoading;

  useEffect(() => {
    if (!hotel) return;

    setForm({
      name: hotel.name || "",
      city: hotel.city || "",
      photos: hotel.photos || [],
      amenities: (hotel.amenities || [])
        .flatMap((a) => a.split(","))
        .map((a) => a.trim())
        .join(", "),
      contactInfo: {
        completeAddress: hotel.contactInfo?.completeAddress || "",
        location: hotel.contactInfo?.location || "",
        email: hotel.contactInfo?.email || "",
        phoneNumber: hotel.contactInfo?.phoneNumber || "",
      },
    });
  }, [hotel]);

  const updateHotel = async (event) => {
    event.preventDefault();
    setUploadingImage(true);
    let photoUrl = "";

    if (image?.file) {
      photoUrl = await uploadToCloudinary(image.file);
    }

    try {
      setError("");
      const payload = {
        hotelId,
        ...form,
         photos: photoUrl ? [photoUrl] : [],
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      };

      await updateOwnerHotel(payload).unwrap();
    } catch (err) {
      setError(err?.data?.message || "Could not update hotel.");
    } finally {
      setUploadingImage(false);
    }
  };

  const activateHotel = async () => {
    try {
      setError("");
      await activateOwnerHotel(hotelId).unwrap();
    } catch (err) {
      setError(err?.data?.message || "Could not activate hotel.");
    }
  };

  const deleteHotel = async () => {
    if (!window.confirm("Delete this hotel permanently?")) return;

    try {
      setError("");
      await deleteOwnerHotel(hotelId).unwrap();
      router.push("/owner/hotels");
    } catch (err) {
      setError(err?.data?.message || "Could not delete hotel.");
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      setError("");
      await deleteOwnerRoom(roomId).unwrap();
    } catch (err) {
      setError(err?.data?.message || "Could not delete room.");
    }
  };

  if (loading) {
    return (
      <div className="h-40 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />
    );
  }

  if (isHotelError && !hotel) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Hotel details error</p>
        <p className="text-sm mt-1">
          {hotelError?.data?.message || "Could not load hotel details."}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">
              {hotel?.name || "Hotel Details"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {hotel?.city || "Unknown city"}{" "}
              {hotel?.active ? "• Active" : "• Inactive"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/owner/hotels/${hotelId}/rooms/new`}
              className="rounded-full bg-rose-500 px-4 py-2 text-sm text-white hover:bg-rose-600"
            >
              Add Room
            </Link>
            <button
              type="button"
              onClick={activateHotel}
              disabled={saving}
              className="rounded-full border border-green-600 px-4 py-2 text-sm text-green-700 bg-green-100 hover:bg-green-100 disabled:opacity-50"
            >
              {hotel?.active ? "Deactivate" : "Activate"}
            </button>
            <button
              type="button"
              onClick={deleteHotel}
              disabled={saving}
              className="rounded-full border border-red-600 px-4 py-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={updateHotel}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 shadow-sm"
      >
        <h3 className="font-semibold">Update Hotel</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Name"
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
          <input
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
            placeholder="City"
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
        </div>
        <input
          type="file"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setImage(file);
          }}
        />

       <div className="grid grid-cols-1 gap-3">
  {(image || form.photos?.length) && (
    <div className="relative">
      <div className="relative h-40 md:h-80 w-full">

        {/* NEW IMAGE (preview upload from blob) */}
        {image?.isNew ? (
          <img
            src={image.preview}
            alt="Hotel preview"
            className="rounded-xl border object-cover w-full h-full"
          />
        ) : (
          /* EXISTING IMAGE (from backend) */
          <Image
            src={image?.url || form.photos?.[0]}
            alt="Hotel"
            fill
            className="rounded-xl border object-cover"
          />
        )}

      </div>

      {/* REMOVE BUTTON */}
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

        <h4 className="font-medium mt-2">Contact Info</h4>

        <input
          value={form.contactInfo?.completeAddress || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contactInfo: {
                ...prev.contactInfo,
                completeAddress: e.target.value,
              },
            }))
          }
          placeholder="Complete Address"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          value={form.contactInfo?.location || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contactInfo: {
                ...prev.contactInfo,
                location: e.target.value,
              },
            }))
          }
          placeholder="Location (Google Maps link or coords)"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          type="email"
          value={form.contactInfo?.email || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contactInfo: {
                ...prev.contactInfo,
                email: e.target.value,
              },
            }))
          }
          placeholder="Email"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <input
          value={form.contactInfo?.phoneNumber || ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              contactInfo: {
                ...prev.contactInfo,
                phoneNumber: e.target.value,
              },
            }))
          }
          placeholder="Phone Number"
          className="w-full rounded-xl border px-3 py-2.5 text-sm"
        />

        <button
          type="submit"
          disabled={saving || uploadingImage}
          className="rounded-full bg-gray-900 dark:bg-gray-100 dark:text-gray-900 px-5 py-2.5 text-sm text-white hover:bg-black dark:hover:bg-white disabled:opacity-50"
        >
          {saving || uploadingImage ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Rooms</h3>
        {rooms.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            No rooms found for this hotel.
          </p>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => {
              const { _id, type, basePrice, totalCount, capacity = {} } = room;

              const { adults = 0, children = 0 } = capacity;

              return (
                <div
                  key={_id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex flex-wrap items-start justify-between gap-2"
                >
                  <div>
                    <p className="font-medium">{type || "Untitled room"}</p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max: {adults + children} | Price: ₹{basePrice} | Rooms:{" "}
                      {totalCount}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/owner/rooms/${_id}/edit`}
                      className="rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => deleteRoom(_id)}
                      className="rounded-full border border-red-500 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
