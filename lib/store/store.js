import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/api/baseApi";
import authReducer from "@/lib/slice/authSlice";
import "@/lib/api/authApi";
import "@/lib/api/hotelsApi";
import "@/lib/api/roomsApi";
import "@/lib/api/inventoryApi";
import "@/lib/api/bookingsApi";
import "@/lib/api/paymentApi";
import "@/lib/api/ownerApi";

export function makeStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}

export const store = makeStore();
