import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuth, setCredentials, setAccessToken } from "@/lib/slice/authSlice";
import { safeLocalStorage } from "@/utils/localstorage";
import { Mutex } from "async-mutex";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");

    const token = getState().auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});


// One mutex shared by ALL requests
const mutex = new Mutex();

const baseQueryWithReauth = async (args, api, extraOptions) => {
  // --------------------------------------------------
  // 1. If another request is already refreshing,
  //    wait here.
  // --------------------------------------------------
  await mutex.waitForUnlock();

  // --------------------------------------------------
  // 2. Make the original request
  // --------------------------------------------------
  let result = await baseQuery(args, api, extraOptions);

  // --------------------------------------------------
  // 3. Access token expired
  // --------------------------------------------------
  if (result?.error?.status === 401) {

    // ------------------------------------------------
    // 4. Nobody is refreshing yet.
    //    Become the refresh request.
    // ------------------------------------------------
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
          },
          api,
          extraOptions
        );

        // --------------------------------------------
        // 5. Refresh successful
        // --------------------------------------------
        if (refreshResult?.data?.success) {
          const newAccessToken = refreshResult.data.data.accessToken;
          const state = api.getState();

          // Step A: Update Redux state SYNCHRONOUSLY with a plain action.
          // prepareHeaders reads from getState(), so this must complete
          // before the retried baseQuery call below fires — otherwise the
          // retried request still carries the expired token and gets 401.
          api.dispatch(setAccessToken(newAccessToken));

          // Step B: Persist user + new token to localStorage.
          // setCredentials is an async thunk; await it so storage is
          // written before we return, but Redux state is already updated
          // above so the retry is not blocked by the async localStorage write.
          await api.dispatch(
            setCredentials({
              user: state.auth.user,
              accessToken: newAccessToken,
            })
          );

          // ------------------------------------------
          // 6. Retry original request.
          //    prepareHeaders now reads the NEW token
          //    from Redux (set synchronously above).
          // ------------------------------------------
          result = await baseQuery(args, api, extraOptions);
        } else {
          // ------------------------------------------
          // 7. Refresh token expired/invalid.
          //    Session is over.
          // ------------------------------------------
          api.dispatch(clearAuth());

          await safeLocalStorage.removeItem("user");
          await safeLocalStorage.removeItem("accessToken");
        }
      } finally {
        // --------------------------------------------
        // 8. Always unlock, even if refresh throws.
        // --------------------------------------------
        release();
      }
    } else {
      // ------------------------------------------------
      // 9. Another request is already refreshing.
      //    Wait until it finishes.
      // ------------------------------------------------
      await mutex.waitForUnlock();

      // ------------------------------------------------
      // 10. Refresh completed.
      //     Retry original request using the NEW token.
      // ------------------------------------------------
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};



export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile", "Hotel", "Room", "Booking", "OwnerHotel", "Inventory", "Analytics",],
  endpoints: () => ({}),
});

export { apiSlice as baseApi }