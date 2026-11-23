import { cacheLife } from "next/cache";
import type { Book } from "@/lib/types";

// Must mirror the fallback in src/lib/api.ts. The previous literal string
// fallback made every server-side fetch fail whenever the env var was absent.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getBooks(query = ""): Promise<Book[] | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${API_URL}/books${query}`);
    if (!res.ok) return null;
    return (await res.json()) as Book[];
  } catch {
    return null;
  }
}

export async function getBook(id: string): Promise<Book | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    return (await res.json()) as Book;
  } catch {
    return null;
  }
}
