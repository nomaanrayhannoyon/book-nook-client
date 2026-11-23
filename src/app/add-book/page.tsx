import type { Metadata } from "next";
import { AddBookForm } from "./add-book-form";

export const metadata: Metadata = {
  title: "BookNook | Add Book",
};

export default function AddBookPage() {
  return (
    <main className="flex-1 bg-[#f7f2ea] px-6 py-12 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-3xl">
        <div className="border-b border-black/10 dark:border-white/10 pb-8 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a] uppercase">
            Share Your Shelf
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">Add a Book</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6f6558] dark:text-[#b0a89f]">
            Put a book from your shelf into the library — a cover, a blurb and
            how many copies you can spare.
          </p>
        </div>

        <div className="pt-8">
          <AddBookForm />
        </div>
      </div>
    </main>
  );
}
