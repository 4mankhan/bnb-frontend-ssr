"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { baseApi } from "@/lib/api/baseApi";

export function useRoomAvailability(rooms, checkIn, checkOut) {
  const dispatch = useDispatch();
  const [roomAvailability, setRoomAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rooms.length || !checkIn || !checkOut) {
      setRoomAvailability({});
      return;
    }

    let cancelled = false;

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          rooms.map((room) =>
            dispatch(
              baseApi.endpoints.getInventoryAvailability.initiate(
                {
                  roomId: room._id,
                  fromDate: checkIn,
                  toDate: checkOut,
                },
                { forceRefetch: true },
              ),
            ).unwrap(),
          ),
        );

        if (cancelled) return;

        const availabilityMap = {};
        rooms.forEach((room, index) => {
          availabilityMap[room._id] = results[index];
        });
        setRoomAvailability(availabilityMap);
      } catch (err) {
        if (!cancelled) {
          console.error("Inventory fetch failed", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      cancelled = true;
    };
  }, [rooms, checkIn, checkOut, dispatch]);

  return { roomAvailability, loading };
}
