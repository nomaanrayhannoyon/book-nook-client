
import type { Metadata } from "next";
import { BookDetails } from "./book-details";
import { getBook } from "@/lib/books-server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);

  if (book?.title) {
    return {
      title: `BookNook | ${book.title}`,
      description: book.author
        ? `${book.title} by ${book.author} — borrow it from the BookNook library.`
        : `Borrow ${book.title} from the BookNook library.`,
    };
  }

  return { title: "BookNook | Book Details" };
}

export default async function BookDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <main className="flex-1 bg-[#f7f2ea] px-6 py-12 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1100px]">
        <BookDetails id={id} initialBook={book} />
      </div>
    </main>
  );
}
