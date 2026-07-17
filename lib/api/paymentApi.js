import { baseApi } from "./baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/booking/create",
        method: "POST",
        body,
      }),
    }),
    createPaymentOrder: builder.mutation({
      query: (body) => ({
        url: "/payment/create-order",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: "/payment/verify-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }, { type: "Inventory" }],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} = paymentApi;
