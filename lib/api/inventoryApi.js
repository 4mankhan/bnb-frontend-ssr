import { baseApi } from "./baseApi";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryAvailability: builder.query({
      query: ({ roomId, fromDate, toDate }) => ({
        url: "/inventory/availability",
        params: { roomId, fromDate, toDate },
      }),
      transformResponse: (response) => response?.data?.availableRooms,
      providesTags: (_result, _error, { roomId, fromDate, toDate }) => [
        {
          type: "Inventory",
          id: `${roomId}_${fromDate}_${toDate}`,
        },
      ],
    }),
  }),
});

export const { useGetInventoryAvailabilityQuery } = inventoryApi;
