import { baseApi } from "./baseApi";

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: ({ page = 1, limit }) =>
        `/hotels?page=${page}&limit=${limit}`,
      transformResponse: (response) => response?.data || response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((hotel) => ({
                type: "Hotel",
                id: hotel._id,
              })),
              { type: "Hotel", id: "LIST" },
            ]
          : [{ type: "Hotel", id: "LIST" }],
    }),
    browseHotels: builder.query({
      query: ({ location, fromDate, toDate }) => ({
        url: "/hotels/browse",
        params: { location, fromDate, toDate },
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map((hotel) => ({
                type: "Hotel",
                id: hotel._id,
              })),
              { type: "Hotel", id: "BROWSE" },
            ]
          : [{ type: "Hotel", id: "BROWSE" }],
    }),
    getHotelById: builder.query({
      query: (id) => `/hotels/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Hotel", id }],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useBrowseHotelsQuery,
  useGetHotelByIdQuery,
} = hotelsApi;
