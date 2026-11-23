"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Baby, FlaskConical, History, Library, BookOpen } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { BOOK_CATEGORIES, type Book } from "@/lib/types";

type CategoryMeta = {
  icon: typeof BookOpen;
  blurb: string;
};

const categoryMeta: Record<string, CategoryMeta> = {
  Fiction: { icon: BookOpen, blurb: "Novels, stories & fantasy" },
  Science: { icon: FlaskConical, blurb: "Nature, tech & discovery" },
  History: { icon: History, blurb: "Past & civilisations" },
  Kids: { icon: Baby, blurb: "Young & growing readers" },
  Others: { icon: Library, blurb: "Everything in between" },
};


export function TopCategories() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Book[]>("/books", { auth: false })
      .then((books) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const book of books) {
          map[book.category] = (map[book.category] ?? 0) + 1;
        }
        setCounts(map);
      })
      .catch(() => {
        if (!cancelled) setCounts({});
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-[#f7f2ea] py-16 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a]">
            Top Categories
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
            Find Your Shelf
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            Jump straight to the corner of the library that suits your mood.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {BOOK_CATEGORIES.map((category) => {
            const meta = categoryMeta[category];
            const Icon = meta.icon;
            const count = counts?.[category];
            return (
              <Link
                key={category}
                href={`/books?category=${encodeURIComponent(category)}`}
                className="group flex flex-col rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-5 transition-colors hover:border-[#a37b28]/40 dark:hover:border-[#e9c46a]/40 hover:bg-[#f5efe4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60 dark:bg-[#26211c] dark:hover:bg-[#2c2620]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1eadf] dark:bg-[#332d26]">
                  <Icon className="h-5 w-5 text-[#8f6a1f] dark:text-[#e9c46a]" aria-hidden />
                </span>
                <h3 className="mt-4 font-serif text-lg font-semibold text-[#2b2620] dark:text-white">
                  {category}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#7d7468] dark:text-[#b0a89f]">
                  {meta.blurb}
                </p>
                <span className="mt-auto flex items-center justify-between pt-4 text-xs font-semibold text-[#8f6a1f] dark:text-[#e9c46a]">
                  {counts === null ? (
                    <span className="text-[#2b2620]/40 dark:text-white/40">Loading…</span>
                  ) : (
                    <span>
                      {count ?? 0} {count === 1 ? "book" : "books"}
                    </span>
                  )}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
