import { baseApi } from "./baseApi";

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoomsByHotel: builder.query({
      query: (hotelId) => `/rooms/hotel/${hotelId}`,
      providesTags: (result, _error, hotelId) =>
        result?.length
          ? [
              ...result.map((room) => ({ type: "Room", id: room._id })),
              { type: "Room", id: `HOTEL_${hotelId}` },
            ]
          : [{ type: "Room", id: `HOTEL_${hotelId}` }],
    }),
  }),
});

export const { useGetRoomsByHotelQuery } = roomsApi;
