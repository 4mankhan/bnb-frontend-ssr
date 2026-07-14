import { baseApi } from "./baseApi";

function unwrapAuthResponse(response) {
  return response?.user || response?.data?.user || response?.data || response;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response) => {
        const user = unwrapAuthResponse(response);
        const accessToken =
          response?.accessToken || response?.data?.accessToken || "";
        const refreshToken =
          response?.refreshToken || response?.data?.refreshToken || "";
        return { user, accessToken, refreshToken };
      },
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      transformResponse: (response) => {
        const user = unwrapAuthResponse(response);
        const accessToken =
          response?.accessToken || response?.data?.accessToken || "";
        const refreshToken =
          response?.refreshToken || response?.data?.refreshToken || "";
        return { user, accessToken, refreshToken };
      },
    }),
    getProfile: builder.query({
      query: () => "/auth/profile",
      transformResponse: (response) =>
        response?.data || response?.user || response,
      providesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/auth/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
     logout: builder.mutation({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "CURRENT" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation
} = authApi;
