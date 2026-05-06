"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "amanbnb-theme";

export function ThemeProvider({ children }) {
  // ✅ Lazy init (runs only once per environment)
  const [dark, setDarkState] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "dark";
    } catch {
      return false;
    }
  });

  // ✅ Only DOM sync (valid useEffect usage)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // ✅ Explicit setter
  const setDark = useCallback((value) => {
    setDarkState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
    } catch {}
  }, []);

  // ✅ Toggle
  const toggle = useCallback(() => {
    setDarkState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ dark, setDark, toggle }),
    [dark, setDark, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}