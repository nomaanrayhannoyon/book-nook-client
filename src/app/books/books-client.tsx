"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookCard } from "@/components/book-card";
import { Spinner } from "@/components/spinner";
import { apiFetch } from "@/lib/api";
import { BOOK_CATEGORIES, type Book } from "@/lib/types";

export function BooksClient({
  initialBooks = null,
}: {
  initialBooks?: Book[] | null;
}) {
  const searchParams = useSearchParams();
  // ?category=Fiction — set by the Top Categories cards on the home page.
  const rawCategory = searchParams.get("category");
  const category =
    rawCategory && (BOOK_CATEGORIES as readonly string[]).includes(rawCategory)
      ? rawCategory
      : null;

  const [books, setBooks] = useState<Book[] | null>(initialBooks);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Revalidate on mount so edits/adds are visible immediately even though
    // the server-rendered page is cached for a short period.
    apiFetch<Book[]>("/books", { auth: false })
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch(() => {
        // Keep the server-rendered catalogue if a background refresh fails.
        if (!cancelled && !initialBooks) {
          setFailed(true);
          toast.error("Could not load books");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [initialBooks]);

  if (failed) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 text-center">
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
  }

  if (books === null) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3">
        <Spinner className="h-9 w-9" />
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">Loading books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3 text-center">
        <p className="font-serif text-2xl font-bold text-[#2b2620] dark:text-white">
          The shelves are empty
        </p>
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
          Be the first to add a book to BookNook.
        </p>
      </div>
    );
  }

  const visible = category
    ? books.filter((book) => book.category === category)
    : books;

  // Filter with no matches — offer a way back to the full catalogue
  if (category && visible.length === 0) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-serif text-2xl font-bold text-[#2b2620] dark:text-white">
          No books in {category} yet
        </p>
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
          Nothing on this shelf right now — try another category.
        </p>
        <Link
          href="/books"
          className="rounded-full bg-[#e9c46a] px-5 py-2.5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
        >
          Show all books
        </Link>
      </div>
    );
  }

  return (
    <div>
      {category && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="text-[#6f6558] dark:text-[#b0a89f]">
            Showing{" "}
            <span className="font-semibold text-[#2b2620] dark:text-white">{category}</span> ·{" "}
            {visible.length} {visible.length === 1 ? "book" : "books"}
          </span>
          <Link
            href="/books"
            className="rounded-full border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-3.5 py-1 text-xs font-semibold text-[#8f6a1f] dark:text-[#e9c46a] transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60"
          >
            Clear filter ×
          </Link>
        </div>
      )}
      {/* 3 cards per row on desktop, equal heights via the grid + h-full cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((book, index) => (
          <BookCard key={book._id} book={book} eager={index < 3} />
        ))}
      </div>
    </div>
  );
}
