import type { Metadata } from "next";
import { MyBorrowsClient } from "./my-borrows-client";

export const metadata: Metadata = {
  title: "BookNook | My Borrows",
};

export default function MyBorrowsPage() {
  return (
    <main className="flex-1 bg-[#f7f2ea] px-6 py-12 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a] uppercase">
            Your Borrowed Books
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
            My Borrows
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            Everything you have taken off the shelf, with the date it is due
            back.
          </p>
        </div>

        <div className="mt-10">
          <MyBorrowsClient />
        </div>
      </div>
    </main>
  );
}
