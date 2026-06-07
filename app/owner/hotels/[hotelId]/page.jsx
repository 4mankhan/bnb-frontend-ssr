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
import { ArrowLeft, Building, UploadCloud, X, MapPin, Mail, Phone, Plus, Trash2, Edit, Eye, BedDouble, Users, AlertCircle, Sparkles, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function OwnerHotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.hotelId;

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    city: "",
    photos: [],
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
    refetch: refetchHotel,
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
    setImage(null);
  }, [hotel]);

  const updateHotel = async (event) => {
    event.preventDefault();
    setUploadingImage(true);
    let photoUrl = "";

    try {
      setError("");
      if (image?.file) {
        photoUrl = await uploadToCloudinary(image.file);
      }

      const payload = {
        hotelId,
        name: form.name,
        city: form.city,
        // Preserve current photos if a new image was not uploaded
        photos: photoUrl ? [photoUrl] : form.photos,
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        contactInfo: form.contactInfo,
      };

      await updateOwnerHotel(payload).unwrap();
      toast.success("Hotel updated successfully!");
      refetchHotel();
    } catch (err) {
      console.error(err);
      setError(err?.data?.message || "Could not update hotel.");
      toast.error("Failed to update hotel.");
    } finally {
      setUploadingImage(false);
    }
  };

  const activateHotel = async () => {
    try {
      setError("");
      await activateOwnerHotel(hotelId).unwrap();
      toast.success(hotel?.active ? "Hotel deactivated" : "Hotel activated!");
    } catch (err) {
      setError(err?.data?.message || "Could not toggle hotel status.");
      toast.error("Status toggle failed.");
    }
  };

  const deleteHotel = async () => {
    if (!window.confirm("Delete this hotel permanently? All rooms inside will be lost.")) return;

    try {
      setError("");
      await deleteOwnerHotel(hotelId).unwrap();
      toast.success("Hotel deleted successfully");
      router.push("/owner/hotels");
    } catch (err) {
      setError(err?.data?.message || "Could not delete hotel.");
      toast.error("Delete failed.");
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      setError("");
      await deleteOwnerRoom(roomId).unwrap();
      toast.success("Room deleted successfully");
    } catch (err) {
      setError(err?.data?.message || "Could not delete room.");
      toast.error("Delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 rounded-3xl bg-gray-200 dark:bg-gray-950 border border-gray-200 dark:border-gray-800" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 h-96 rounded-3xl bg-gray-200 dark:bg-gray-950 border border-gray-200 dark:border-gray-800" />
          <div className="h-96 rounded-3xl bg-gray-200 dark:bg-gray-950 border border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    );
  }

  if (isHotelError && !hotel) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-5 text-red-700 dark:text-red-400 max-w-md mx-auto mt-8">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Hotel details error</p>
            <p className="text-sm mt-1">
              {hotelError?.data?.message || "Could not load hotel details."}
            </p>
            <Link href="/owner/hotels" className="inline-flex mt-4 text-xs font-semibold text-rose-500">
              Back to hotels list
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasPhoto = image ? true : (form.photos && form.photos.length > 0);
  const activePhoto = image ? image.preview : (form.photos?.[0] || null);

  return (
    <section className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/owner/hotels"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition active:scale-95 shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {hotel?.name || "Hotel Details"}
                </h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    hotel?.active
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${hotel?.active ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  {hotel?.active ? "Active" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {hotel?.city || "Unknown city"} • {rooms.length} room types listed
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/owner/hotels/${hotelId}/rooms/new`}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 text-xs font-bold transition shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Room
            </Link>
            <button
              type="button"
              onClick={activateHotel}
              disabled={saving}
              className={`inline-flex items-center justify-center gap-1 rounded-full border px-4 py-2 text-xs font-bold transition active:scale-95 disabled:opacity-50 cursor-pointer ${
                hotel?.active
                  ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/50"
                  : "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50"
              }`}
            >
              {hotel?.active ? "Deactivate" : "Activate"}
            </button>
            <button
              type="button"
              onClick={deleteHotel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-1 rounded-full border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-4 py-2 text-xs font-bold hover:bg-red-100/50 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Hotel
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-400">
          <div className="flex gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 animate-bounce" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Editor & Rooms list split */}
      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* Editor Form */}
        <form
          onSubmit={updateHotel}
          className="lg:col-span-3 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
              <Edit className="h-4 w-4" />
            </span>
            <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Update Hotel Details</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Hotel Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Hotel Name"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">City</label>
              <input
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="City"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Media upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Cover Image</label>
            {hasPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div className="relative h-44 md:h-60 w-full">
                  {image?.isNew ? (
                    <img
                      src={image.preview}
                      alt="Hotel preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <img
                      src={activePhoto}
                      alt="Hotel"
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setForm((prev) => ({ ...prev, photos: [] }));
                  }}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm hover:bg-black/85 transition active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="group relative">
                <label className="flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-950/20 hover:bg-gray-50 dark:hover:bg-gray-850 hover:border-rose-400 dark:hover:border-rose-900/50 transition cursor-pointer text-center">
                  <UploadCloud className="h-8 w-8 text-gray-400 dark:text-gray-500 group-hover:text-rose-500 transition mb-2" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Click to upload a new cover image</span>
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

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Amenities (comma-separated)</label>
            <input
              value={form.amenities}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amenities: e.target.value }))
              }
              placeholder="e.g. WiFi, Pool, Restaurant, Spa"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Contact info sub-section */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-850 pb-1.5">
              Contact & Location details
            </h4>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Complete Address</label>
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
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Maps Location link</label>
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
                placeholder="Google Maps URL or Coordinates"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
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
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
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
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="inline-flex items-center justify-center rounded-full bg-gray-950 hover:bg-black text-white dark:bg-gray-100 dark:text-gray-950 dark:hover:bg-white px-6 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50"
            >
              {saving || uploadingImage ? (
                <span className="flex items-center gap-2">
                  <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        {/* Rooms List */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/45 text-rose-500">
                <BedDouble className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">Room Types</h3>
            </div>
            <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-350 px-2 py-0.5 rounded-md">
              {rooms.length} Total
            </span>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-10 space-y-4 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-950/20">
              <BedDouble className="h-8 w-8 mx-auto text-gray-400" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">No rooms listed yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-450 max-w-xs mx-auto px-4">
                  Add room inventory, set base pricing, and upload room images to make this hotel bookable.
                </p>
              </div>
              <Link
                href={`/owner/hotels/${hotelId}/rooms/new`}
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 text-white px-4 py-2 text-xs font-bold hover:bg-rose-600 transition active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Your First Room
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => {
                const { _id, type, basePrice, totalCount, capacity = {}, photos = [] } = room;
                const { adults = 0, children = 0 } = capacity;
                const roomPhoto = photos.length > 0 ? photos[0] : null;

                return (
                  <div
                    key={_id}
                    className="group rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
                  >
                    {/* Optional mini room header image if uploaded */}
                    {roomPhoto && (
                      <div className="relative h-28 w-full overflow-hidden bg-gray-100 dark:bg-gray-850">
                        <img
                          src={roomPhoto}
                          alt={type}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded-full">
                            ₹{basePrice} / night
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-3">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-rose-500 transition-colors">
                          {type || "Untitled room"}
                        </p>
                        {!roomPhoto && (
                          <p className="text-xs font-bold text-rose-500 dark:text-rose-455 mt-0.5">
                            ₹{basePrice} / night
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            Max Guests: {adults + children}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <span>Qty: {totalCount} rooms</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                        <div className="flex gap-1.5">
                          <Link
                            href={`/owner/rooms/${_id}/edit`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-600 dark:text-gray-300 transition active:scale-90"
                            title="Edit Room"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteRoom(_id)}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-red-100 dark:border-red-950/30 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition active:scale-90 cursor-pointer"
                            title="Delete Room"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <Link
                          href={`/hotel/${hotelId}`}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1.5 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition active:scale-95"
                        >
                          <Eye className="h-3.5 w-3.5 text-gray-400" />
                          Preview
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
