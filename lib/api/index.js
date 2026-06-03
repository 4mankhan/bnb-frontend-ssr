export { baseApi, tagTypes } from "./baseApi";

export {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
} from "./authApi";

export {
  useGetHotelsQuery,
  useBrowseHotelsQuery,
  useGetHotelByIdQuery,
} from "./hotelsApi";

export { useGetRoomsByHotelQuery } from "./roomsApi";

export { useGetInventoryAvailabilityQuery } from "./inventoryApi";

export {
  useGetMyBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
} from "./bookingsApi";

export { useProcessPaymentMutation } from "./paymentApi";

export {
  useGetOwnerHotelsQuery,
  useGetOwnerHotelByIdQuery,
  useGetOwnerHotelRoomsQuery,
  useCreateOwnerHotelMutation,
  useUpdateOwnerHotelMutation,
  useActivateOwnerHotelMutation,
  useDeleteOwnerHotelMutation,
  useCreateOwnerRoomMutation,
  useUpdateOwnerRoomMutation,
  useDeleteOwnerRoomMutation,
} from "./ownerApi";
