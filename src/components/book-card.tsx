import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
  /** Load the cover eagerly (above-the-fold cards); lazy otherwise. */
  eager?: boolean;
}

/** Shared card used by New Arrivals and the All Books grid. */
export function BookCard({ book, eager = false }: BookCardProps) {
  // Covers are free-form URLs — if one turns out not to be an image (or the
  // host is down), swap in the placeholder instead of a broken-image icon.
  const [coverBroken, setCoverBroken] = useState(false);
  const showCover = Boolean(book.image) && !coverBroken;
  const soldOut = book.availableCopies <= 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white transition-shadow duration-300 hover:shadow-xl dark:bg-[#26211c]">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f1eadf] dark:bg-[#3a332b]">
        {showCover ? (
          <Image
            src={book.image!}
            alt={`Cover of ${book.title}`}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setCoverBroken(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-[#2b2620]/25 dark:text-white/25" aria-hidden />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="rounded-full bg-[#e9c46a] px-2.5 py-1 text-[11px] font-bold text-[#2b2620] hover:bg-[#e9c46a]">
            {book.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-serif text-lg leading-snug font-bold text-[#2b2620] dark:text-white">
          {book.title}
        </h3>
        <p className="mt-1.5 text-sm text-[#7d7468] dark:text-[#b0a89f]">by {book.author}</p>
        <p
          className={
            soldOut
              ? "mt-2 text-xs font-semibold text-red-500 dark:text-red-400"
              : "mt-2 text-xs font-semibold text-[#8f6a1f] dark:text-[#e9c46a]"
          }
        >
          {soldOut
            ? "Not Available"
            : `${book.availableCopies} of ${book.totalCopies} copies available`}
        </p>

        <div className="mt-auto pt-5">
          <Link
            href={`/books/${book._id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e9c46a] px-4 py-2.5 text-sm font-semibold text-[#2b2620] transition-colors hover:bg-[#f0d27e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
