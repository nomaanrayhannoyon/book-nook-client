import type { Metadata } from "next";
import { MyBooksClient } from "./my-books-client";

export const metadata: Metadata = {
  title: "BookNook | My Books",
};

export default function MyBooksPage() {
  return (
    <main className="flex-1 bg-[#f7f2ea] px-6 py-12 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a] uppercase">
            Your Contributions
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">My Books</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            The books you have added to BookNook — edit their details or take
            them off the shelf.
          </p>
        </div>

        <div className="mt-10">
          <MyBooksClient />
        </div>
      </div>
    </main>
  );
}
