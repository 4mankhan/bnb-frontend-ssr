"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingPage from "../loading";

const AuthGuard = ({ children, requireAuth = true, redirectTo = "/login" }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fullPath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    if (requireAuth && !isAuthenticated && !isLoading) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(fullPath)}`);
    } else if (!requireAuth && isAuthenticated) {
      router.push("/");
    }
  }, [
    isAuthenticated,
    requireAuth,
    redirectTo,
    router,
    isLoading,
    isMounted,
    pathname,
    searchParams,
  ]);

  // Always show loading during SSR and initial client render
  if (!isMounted || isLoading) {
    return <LoadingPage />;
  }

  // Show loading while redirecting for auth checks
  if (requireAuth && !isAuthenticated) {
    return <LoadingPage />;
  }

  if (!requireAuth && isAuthenticated) {
    return <LoadingPage />;
  }

  return children;
};

export default AuthGuard;
