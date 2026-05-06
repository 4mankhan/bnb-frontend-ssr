"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import BookingCard from "@/components/HotelPage/BookingCard";
import PaymentModal from "@/components/HotelPage/PaymentModal";
import Rooms from "@/components/HotelPage/Rooms";


export default function HotelPage() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [booking, setBooking] = useState(null);

const api = process.env.NEXT_PUBLIC_API_URL;

  const today = new Date();

  const defaultCheckIn = today.toISOString().split("T")[0];

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const defaultCheckOut = tomorrow.toISOString().split("T")[0];
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);




  const getNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 1;
  };

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`${api}/hotels/${id}`);
        setHotel(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotel();
  }, [id, api]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${api}/rooms/hotel/${id}`);
        setRooms(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchRooms();
  }, [id, api]);

  const handleReserve = async () => {
    try {
      const token = localStorage.getItem("token"); //
      //console.log("handle reserve clicked", token);
      const res = await axios.post(
        `${api}/booking/create`,
        {
          hotelId: hotel._id,
          roomId: selectedRoom._id,
          fromDate: checkIn,
          toDate: checkOut,
          totalPrice: selectedRoom.basePrice * getNights(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBooking(res.data.booking);
      setShowPayment(true);
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("SERVER ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const onSuccess = () => {
  toast.success("Payment successful 🎉");

  // slight delay so user can see toast
  setTimeout(() => {
    router.push("/bookings");
  }, 1500);
};

  if (loading) {
    return <div className="p-10 text-center text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 min-h-screen">Loading...</div>;
  }

  if (!hotel) {
    return <div className="p-10 text-center">Hotel not found</div>;
  }

  return (
  <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
      {/* HERO */}

      <section className="relative h-[70vh] w-full overflow-hidden">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4"></div>

        <Image
          src={hotel.photos?.[0]}
          alt={hotel.name}
          fill
          className="object-cover scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent z-10" />

        {/* Content */}
        <div className="absolute bottom-10 left-10 text-white max-w-2xl z-20">
          <h1 className="text-5xl md:text-6xl font-serif leading-tight">
            {hotel.name}
          </h1>
          <p className="mt-3 text-lg opacity-90">
            {hotel.city} · ⭐ 4.8 · 120 reviews
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-12">
          {/* ABOUT */}
          <section>
            <h2 className="text-3xl font-serif mb-4">About this stay</h2>
         <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Experience refined comfort at {hotel.name}, located in the heart
              of {hotel.city}. Designed for modern travelers, this space blends
              luxury, warmth, and thoughtful hospitality.
            </p>
          </section>

          {/* AMENITIES */}
          <section>
          <h2 className="text-3xl font-serif mb-4 text-gray-900 dark:text-gray-100">Basic Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities?.map((a, i) => (
                <div
                  key={i}
                  className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/40 dark:border-gray-700 px-4 py-3 rounded-xl shadow-sm text-gray-900 dark:text-gray-100"
                >
                  {a}
                </div>
              ))}
            </div>
          </section>

        {/* RIGHT CARD */}
            <Rooms

    rooms={rooms}
    selectedRoom={selectedRoom}
    setSelectedRoom={setSelectedRoom}
  />
        </div>


        {/* RIGHT BOOKING CARD */}
  {selectedRoom && (
    <BookingCard
      selectedRoom={selectedRoom}
      checkIn={checkIn}
      setCheckIn={setCheckIn}
      setCheckOut={setCheckOut}
      checkOut={checkOut}
      onReserve={handleReserve}
    />
  )}

        <PaymentModal
          isOpen={showPayment}
          booking={booking}
          onClose={() => setShowPayment(false)}
          onSuccess={onSuccess}
        />
      </div>
    </main>
  );
}
