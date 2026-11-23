import type { Metadata } from "next";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { getBooks } from "@/lib/books-server";
import { BooksClient } from "./books-client";

export const metadata: Metadata = {
  title: "BookNook | All Books",
  description:
    "Browse the full BookNook catalogue — fiction, science, history, kids and more.",
};

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <main className="flex-1 bg-[#f7f2ea] px-6 py-12 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a] uppercase">
            The Catalogue
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">All Books</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            Every title currently on the shelf — pick one and borrow it in a
            click.
          </p>
        </div>

        <div className="mt-10">
          {/* useSearchParams (category filter) needs a Suspense boundary for
              static prerendering of this route. */}
          <Suspense
            fallback={
              <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3">
                <Spinner className="h-9 w-9" />
                <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">Loading books...</p>
              </div>
            }
          >
            <BooksClient initialBooks={books} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
