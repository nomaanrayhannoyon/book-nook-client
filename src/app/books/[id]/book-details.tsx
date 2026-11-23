"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, Layers, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorrowModal } from "@/components/borrow-modal";
import { PageLoader } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/api";
import type { Book } from "@/lib/types";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

export function BookDetails({
  id,
  initialBook = null,
}: {
  id: string;
  initialBook?: Book | null;
}) {
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(initialBook);
  // Only need a full-page loader when the server did not provide the book.
  const [loading, setLoading] = useState(!initialBook);
  const [modalOpen, setModalOpen] = useState(false);

  const loadBook = useCallback(() => {
    apiFetch<Book>(`/books/${id}`, { auth: false })
      .then(setBook)
      // A failed refresh keeps any book already on screen.
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Always fetch once on mount: the server-rendered snapshot can be cached,
    // and availableCopies must be current before the borrow button is usable.
    loadBook();
  }, [loadBook]);

  if (authLoading || (loading && !book)) {
    return <PageLoader label="Loading book..." />;
  }

  if (!book) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-serif text-2xl font-bold text-[#2b2620] dark:text-white">
          We could not load this book
        </p>
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
          The book may have been removed, or the backend is offline.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setLoading(true);
              loadBook();
            }}
            className="rounded-full bg-[#e9c46a] px-5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/books")}
            className="rounded-full border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-5 text-sm font-semibold text-[#2b2620] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
          >
            All Books
          </Button>
        </div>
      </div>
    );
  }

  const soldOut = book.availableCopies <= 0;

  return (
    <>
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-sm text-[#6f6558] dark:text-[#b0a89f] transition-colors hover:text-[#2b2620] dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to All Books
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
        {/* Cover */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-[#f1eadf] dark:bg-[#3a332b]">
          {book.image ? (
            <Image
              src={book.image}
              alt={`Cover of ${book.title}`}
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 340px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-14 w-14 text-[#2b2620]/25 dark:text-white/25" aria-hidden />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full bg-[#e9c46a] px-3 py-1 text-[11px] font-bold text-[#2b2620] hover:bg-[#e9c46a]">
              {book.category}
            </Badge>
            <Badge
              variant="outline"
              className={
                soldOut
                  ? "rounded-full border-red-400/40 bg-red-500/10 px-3 py-1 text-[11px] font-bold text-red-400"
                  : "rounded-full border-[#e9c46a]/40 bg-[#e9c46a]/10 px-3 py-1 text-[11px] font-bold text-[#8f6a1f] dark:text-[#e9c46a]"
              }
            >
              {soldOut ? "Not Available" : `${book.availableCopies} of ${book.totalCopies} copies free`}
            </Badge>
          </div>

          <h1 className="mt-4 font-serif text-4xl leading-tight font-bold text-[#2b2620] dark:text-white">
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-[#6f6558] dark:text-[#b0a89f]">by {book.author}</p>

          <div className="mt-6 grid gap-4 border-y border-black/[0.08] dark:border-white/[0.08] py-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1eadf] dark:bg-[#332d26]">
                <UserIcon className="h-4 w-4 text-[#8f6a1f] dark:text-[#e9c46a]" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wide text-[#2b2620]/50 dark:text-white/50 uppercase">
                  Added by
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-[#2b2620] dark:text-white">
                  {book.userName || "Unknown reader"}
                </p>
                <p className="truncate text-xs text-[#7d7468] dark:text-[#b0a89f]">{book.userEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f1eadf] dark:bg-[#332d26]">
                <CalendarDays className="h-4 w-4 text-[#8f6a1f] dark:text-[#e9c46a]" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#2b2620]/50 dark:text-white/50 uppercase">
                  Added on
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#2b2620] dark:text-white">
                  {formatDate(book.addedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">Description</h2>
            <p className="mt-3 text-[15px] leading-relaxed whitespace-pre-line text-[#6f6558] dark:text-[#b0a89f]">
              {book.description || "No description has been written for this book yet."}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              onClick={() => setModalOpen(true)}
              disabled={soldOut}
              className="rounded-full bg-[#e9c46a] px-7 py-3 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {soldOut ? "Not Available" : "Borrow This Book"}
            </Button>

            <span className="flex items-center gap-2 text-sm text-[#7d7468] dark:text-[#b0a89f]">
              <Layers className="h-4 w-4 text-[#8f6a1f] dark:text-[#e9c46a]" aria-hidden />
              {book.totalCopies} total {book.totalCopies === 1 ? "copy" : "copies"}
            </span>
          </div>

          {soldOut && (
            <p className="mt-3 text-sm text-red-400">
              All copies are currently borrowed — check back soon.
            </p>
          )}
        </div>
      </div>

      <BorrowModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        book={book}
        user={user ? { name: user.name, email: user.email } : null}
        onBorrowed={loadBook}
      />
    </>
  );
}
