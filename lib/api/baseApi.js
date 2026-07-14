import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, updateAccessToken } from "@/lib/slice/authSlice";
import { safeLocalStorage } from "@/utils/localstorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1/consumer`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const user = getState().auth.user;
    const token = user?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/refresh-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult?.data?.success) {
      const newAccessToken = refreshResult.data.data.accessToken;

      api.dispatch(updateAccessToken(newAccessToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAuth());
      safeLocalStorage.removeItem("user");
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Hotel", "Room", "Booking", "OwnerHotel", "Inventory"],
  endpoints: () => ({}),
});
