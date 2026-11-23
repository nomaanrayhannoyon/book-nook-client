"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
    
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 text-[#2b2620]/80 dark:text-white/80 transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#2b2620] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2620]/40 dark:focus-visible:ring-white/50"
    >
      <Sun className="h-[18px] w-[18px] dark:hidden" aria-hidden />
      <Moon className="hidden h-[18px] w-[18px] dark:block" aria-hidden />
    </button>
  );
}
