import { useEffect, useState } from "react";

export default function useResponsiveLimit() {
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(min-width: 868px)");

    const updateLimit = () => {
      setLimit(mediaQuery.matches ? 8 : 6);
    };

    updateLimit();

    mediaQuery.addEventListener?.("change", updateLimit);

    return () => {
      mediaQuery.removeEventListener?.("change", updateLimit);
    };
  }, []);

  return limit;
}