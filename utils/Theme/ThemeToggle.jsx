"use client";

import { useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const TRAVEL = 26;
const TRACK_W = 56;
const TRACK_H = 30;

export default function ThemeToggle() {
  const { dark, setDark, toggle } = useTheme();
  const [dragOffset, setDragOffset] = useState(null);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const offsetRef = useRef(0);

  const restingOffset = dark ? TRAVEL : 0;
  const displayOffset = dragOffset !== null ? dragOffset : restingOffset;

  const endDrag = (e, clientX) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* already released */
    }
    const totalMove = Math.abs(clientX - startXRef.current);
    const mid = TRAVEL / 2;
    if (totalMove < 8) {
      toggle();
    } else {
      setDark(offsetRef.current >= mid);
    }
    setDragOffset(null);
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="hidden sm:inline text-xs font-medium text-gray-600 dark:text-gray-400 select-none">
        {dark ? "Dark" : "Light"}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={dark}
        aria-label="Toggle dark mode"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          startXRef.current = e.clientX;
          startOffsetRef.current = restingOffset;
          offsetRef.current = restingOffset;
          setDragOffset(restingOffset);
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          const dx = e.clientX - startXRef.current;
          let next = startOffsetRef.current + dx;
          next = Math.max(0, Math.min(TRAVEL, next));
          offsetRef.current = next;
          setDragOffset(next);
        }}
        onPointerUp={(e) => endDrag(e, e.clientX)}
        onPointerCancel={(e) => endDrag(e, e.clientX)}
        className="relative shrink-0 cursor-grab active:cursor-grabbing rounded-full bg-gray-300 dark:bg-gray-600 touch-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
        style={{ width: TRACK_W, height: TRACK_H }}
      >
        <span
          className={`absolute top-0.75 left-0.75 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md pointer-events-none ${
            dragOffset === null
              ? "transition-transform duration-200 ease-out"
              : ""
          }`}
          style={{ transform: `translateX(${displayOffset}px)` }}
        >
          {dark ? (
            <Moon
              className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300"
              strokeWidth={2}
              aria-hidden
            />
          ) : (
            <Sun
              className="h-3.5 w-3.5 text-amber-500"
              strokeWidth={2}
              aria-hidden
            />
          )}
        </span>
      </button>
    </div>
  );
}
