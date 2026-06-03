import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

function getAccessToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

export const tagTypes = [
  "Profile",
  "Hotel",
  "Room",
  "Booking",
  "OwnerHotel",
  "Inventory",
];

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes,
  endpoints: () => ({}),
});
