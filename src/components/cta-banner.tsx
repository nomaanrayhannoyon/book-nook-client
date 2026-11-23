import Link from "next/link";
import { ArrowRight, BookPlus } from "lucide-react";

const subtitle =
  "Your unread stack could be someone else's next favourite story. Add a book to BookNook in under a minute — cover photo, category and all.";

export function CtaBanner() {
  return (
    <section className="bg-[#211b16] py-16 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#d9ad5c] px-6 py-16 text-center md:px-8">
      
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-black/[0.07]"
          />

          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e4c37e]">
              <BookPlus className="h-7 w-7 text-[#2b1e0d]" aria-hidden />
            </span>
            <h2 className="mt-5 font-serif text-4xl font-bold text-[#2b1e0d]">
              Have a book to share?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#4a381b]">
              {subtitle}
            </p>
            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#c8933c] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Add a Book
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
