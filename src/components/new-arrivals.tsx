"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { BookCard } from "./book-card";
import { Spinner } from "./spinner";
import { apiFetch } from "@/lib/api";
import type { Book } from "@/lib/types";


export function NewArrivals({
  initialBooks = null,
}: {
  initialBooks?: Book[] | null;
}) {
  const [books, setBooks] = useState<Book[] | null>(initialBooks);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Always revalidate on mount: the server-rendered snapshot may be cached
    // for a minute, so a freshly added book should not wait for that cache.
    apiFetch<Book[]>("/books?sort=newest&limit=6", { auth: false })
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch(() => {
        // Keep the server-rendered data if a background refresh fails.
        if (!cancelled && !initialBooks) {
          setFailed(true);
          toast.error("Could not load new arrivals");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [initialBooks]);

  let content: ReactNode;

  if (failed) {
    content = (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[#6f6558] dark:text-[#b0a89f]">
          We could not reach the library. Make sure the backend is running on
          port 8000.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-[#e9c46a] px-5 py-2.5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
        >
          Try Again
        </button>
      </div>
    );
  } else if (books === null) {
    content = (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
        <Spinner className="h-9 w-9" />
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">Loading the newest books...</p>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <BookCard key={book._id} book={book} eager={index < 3} />
        ))}
      </div>
    );
  }

  return (
    <section className="bg-[#f7f2ea] py-16 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a] uppercase">
            New Arrivals
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
            Just Hit the Shelf
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            The six most recent additions to the catalogue, newest first.
          </p>
        </div>

        <div className="mt-12">{content}</div>

        <div className="mt-10 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-3 rounded-full bg-[#e9c46a] px-7 py-3 text-sm font-semibold text-[#2b2620] transition-colors hover:bg-[#f0d27e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60"
          >
            See All Books
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
