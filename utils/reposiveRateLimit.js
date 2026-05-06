import { useEffect, useState } from "react";

export default function useResponsiveLimit() {
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)"); // md breakpoint

    const updateLimit = () => {
      setLimit(mediaQuery.matches ? 8 : 6);
    };

    updateLimit(); // initial check
    mediaQuery.addEventListener("change", updateLimit);

    return () => mediaQuery.removeEventListener("change", updateLimit);
  }, []);

  return limit;
}