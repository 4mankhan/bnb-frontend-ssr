import { useLogoutMutation } from "@/lib/api/authApi";
import {
  selectCurrentUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  setCredentials,
  logout,
  clearAuth,
} from "@/lib/slice/authSlice";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);

  const [logoutAPI, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logoutAPI().unwrap();
      await dispatch(logout()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(clearAuth());
      router.push("/login");
    }
  }, [dispatch, logoutAPI, router]);

  const updateUser = useCallback(
    async (updatedUser) => {
      try {
        return await dispatch(
          setCredentials({
            user: {
              ...updatedUser,
              userType: "consumer",
            },
            accessToken,
          })
        ).unwrap();
      } catch (error) {
        console.error("Update user error:", error);
        throw error;
      }
    },
    [dispatch, accessToken]
  );

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading: isLoading || isLogoutLoading,
    error: authError,
    logout: handleLogout,
    updateUser,
  };
};