import { baseApi } from "./baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    processPayment: builder.mutation({
      query: (body) => ({
        url: "/payment/process",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
  }),
});

export const { useProcessPaymentMutation } = paymentApi;
