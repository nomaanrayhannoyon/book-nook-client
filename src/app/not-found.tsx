import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "BookNook | Page Not Found",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f7f2ea] px-6 py-20 dark:bg-[#1a1511]">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e9c46a]">
          <BookOpen className="h-8 w-8 text-[#2b2620]" aria-hidden />
        </span>
        <p className="mt-8 font-serif text-7xl font-bold text-[#2b2620]/20 dark:text-white/20">404</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
          This page slipped off the shelf
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-[#6f6558] dark:text-[#b0a89f]">
          The page you are looking for does not exist or has been moved.
          Let&apos;s get you back to reading.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#e9c46a] px-7 py-3 text-sm font-semibold text-[#2b2620] transition-colors hover:bg-[#f0d27e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
