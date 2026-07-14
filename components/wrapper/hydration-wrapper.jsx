"use client";

import { hydrateAuth, selectIsLoading } from "@/lib/slice/authSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HydrationWrapper({ children }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!hasHydrated.current && isLoading) {
      hasHydrated.current = true;
      dispatch(hydrateAuth());
    }
  }, [dispatch, isLoading]);

  return <>{children}</>;
}
