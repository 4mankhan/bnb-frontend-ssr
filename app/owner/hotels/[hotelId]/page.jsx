"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const API_BASE_URL = "http://localhost:3000";

function getAccessToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
}

export default function OwnerHotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params?.hotelId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
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

const fetchDetails = useCallback(async () => {
  const token = getAccessToken();
  if (!hotelId) return;

  try {
    setLoading(true);
    setError("");

    const [hotelRes, roomsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/owner/hotels/${hotelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE_URL}/owner/hotels/${hotelId}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!hotelRes.ok) throw new Error("Failed to load hotel.");
    if (!roomsRes.ok) throw new Error("Failed to load rooms.");

    const hotelData = await hotelRes.json();
    const roomsData = await roomsRes.json();
    const resolvedHotel = hotelData?.data || hotelData;

    setHotel(resolvedHotel);
    setRooms(roomsData?.data || roomsData || []);
    
setForm((prev) => ({
  ...prev,
  name: resolvedHotel?.name || "",
  city: resolvedHotel?.city || "",
  photos: (resolvedHotel?.photos || []).join(", "),
  amenities: (resolvedHotel?.amenities || [])
    .flatMap(a => a.split(","))
    .map(a => a.trim())
    .join(", "),
  contactInfo: {
    completeAddress: resolvedHotel?.contactInfo?.completeAddress || "",
    location: resolvedHotel?.contactInfo?.location || "",
    email: resolvedHotel?.contactInfo?.email || "",
    phoneNumber: resolvedHotel?.contactInfo?.phoneNumber || "",
  },
}));
  } catch (err) {
    setError(err.message || "Could not load hotel details.");
  } finally {
    setLoading(false);
  }
}, [hotelId]);

useEffect(() => {
  fetchDetails();
}, [fetchDetails]);


  const updateHotel = async (event) => {
    event.preventDefault();
    const token = getAccessToken();

    try {
       setSaving(true);
       setError("");
      const payload = {
  ...form,
  photos: form.photos
    .split(",")
    .map(p => p.trim())
    .filter(Boolean),

  amenities: form.amenities
    .split(",")
    .map(a => a.trim())
    .filter(Boolean),
};

const res = await fetch(`${API_BASE_URL}/owner/hotels/${hotelId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(payload),
});

      if (!res.ok) throw new Error("Failed to update hotel.");
      await fetchDetails();
    } catch (err) {
      setError(err.message || "Could not update hotel.");
    } finally {
      setSaving(false);
    }
  };

  const activateHotel = async () => {
    const token = getAccessToken();
    try {
      setSaving(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/owner/hotels/${hotelId}/activate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to activate hotel.");
      await fetchDetails();
    } catch (err) {
      setError(err.message || "Could not activate hotel.");
    } finally {
      setSaving(false);
    }
  };

  const deleteHotel = async () => {
    const token = getAccessToken();
    if (!window.confirm("Delete this hotel permanently?")) return;

    try {
      setSaving(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/owner/hotels/${hotelId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete hotel.");
      router.push("/owner/hotels");
    } catch (err) {
      setError(err.message || "Could not delete hotel.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (roomId) => {
    const token = getAccessToken();
    if (!window.confirm("Delete this room?")) return;

    try {
      setSaving(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/owner/rooms/${roomId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete room.");
      await fetchDetails();
    } catch (err) {
      setError(err.message || "Could not delete room.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-40 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 animate-pulse" />;
  }

  if (error && !hotel) {
    return (
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700">
        <p className="font-semibold">Hotel details error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">{hotel?.name || "Hotel Details"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {hotel?.city || "Unknown city"} {hotel?.active ? "• Active" : "• Inactive"}
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
      
      {/* Hotel Details Update */}
<form
  onSubmit={updateHotel}
  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 shadow-sm"
>
  <h3 className="font-semibold">Update Hotel</h3>

  {/* Basic Info */}
  <div className="grid gap-3 sm:grid-cols-2">
    <input
      value={form.name}
      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      placeholder="Name"
      className="w-full rounded-xl border px-3 py-2.5 text-sm"
    />
    <input
      value={form.city}
      onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
      placeholder="City"
      className="w-full rounded-xl border px-3 py-2.5 text-sm"
    />
  </div>

  {/* Photos & Amenities */}
  <input
    value={form.photos}
    onChange={(e) => setForm((prev) => ({ ...prev, photos: e.target.value }))}
    placeholder="Photo URLs (comma separated)"
    className="w-full rounded-xl border px-3 py-2.5 text-sm"
  />

  <input
    value={form.amenities}
    onChange={(e) => setForm((prev) => ({ ...prev, amenities: e.target.value }))}
    placeholder="Amenities (wifi, pool, parking...)"
    className="w-full rounded-xl border px-3 py-2.5 text-sm"
  />

  {/* Contact Info */}
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
    disabled={saving}
    className="rounded-full bg-gray-900 dark:bg-gray-100 dark:text-gray-900 px-5 py-2.5 text-sm text-white hover:bg-black dark:hover:bg-white disabled:opacity-50"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>
</form>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
        <h3 className="font-semibold mb-3">Rooms</h3>
        {rooms.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">No rooms found for this hotel.</p>
        ) : (
          <div className="space-y-2">
           {rooms.map((room) => {
  const {
    _id,
    type,
    basePrice,
    totalCount,
    capacity = {},
  } = room;

  const { adults = 0, children = 0 } = capacity;

  return (
    <div
      key={_id}
      className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex flex-wrap items-start justify-between gap-2"
    >
      <div>
        {/* FIXED */}
        <p className="font-medium">{type || "Untitled room"}</p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Max: {adults + children} | Price: ₹{basePrice} | Rooms: {totalCount}
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
