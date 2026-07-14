import { useLogoutMutation } from "@/lib/api/authApi";
import {
  selectCurrentUser,
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
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const authError = useSelector(selectAuthError);
  const router = useRouter();
  const [logoutAPI, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      await logoutAPI().unwrap();
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(clearAuth());
      router.push("/login");
    }
  }, [dispatch, logoutAPI, router]);

  const updateUser = useCallback(
    async (data) => {
      try {
        const result = await dispatch(
          setCredentials({ user: { ...data, userType: "consumer" } })
        ).unwrap();
        return result;
      } catch (error) {
        console.error("Update user error:", error);
        throw error;
      }
    },
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isLogoutLoading,
    error: authError,
    logout: handleLogout,
    updateUser,
  };
};
