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
  const [dark, setDarkState] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Only read client-side settings after mounting to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDarkState(stored === "dark");
      } else {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkState(systemPrefersDark);
      }
    } catch {}
  }, []);

  // ✅ Only DOM sync (valid useEffect usage)
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", dark);
    }
  }, [dark, mounted]);

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
    () => ({ dark, setDark, toggle, mounted }),
    [dark, setDark, toggle, mounted]
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