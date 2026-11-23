"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageLoader, Spinner } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/api";
import type { Borrow } from "@/lib/types";

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

export function MyBorrowsClient() {
  const { user, loading } = useRequireAuth();
  const [borrows, setBorrows] = useState<Borrow[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [returningId, setReturningId] = useState<string | null>(null);

  const email = user?.email ?? null;

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    apiFetch<Borrow[]>("/borrows")
      .then((data) => {
        if (!cancelled) setBorrows(data);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          toast.error("Could not load your borrows");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [email, reloadKey]);

  async function handleReturn(borrow: Borrow) {
    if (returningId) return;
    setReturningId(borrow._id);
    try {
      await apiFetch(`/borrows/${borrow._id}`, { method: "DELETE" });
      setBorrows((prev) =>
        prev ? prev.filter((b) => b._id !== borrow._id) : prev,
      );
      toast.success(`“${borrow.bookTitle}” returned — thanks!`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to return the book",
      );
    } finally {
      setReturningId(null);
    }
  }

  if (loading) {
    return <PageLoader label="Checking your session..." />;
  }

  if (failed) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[#6f6558] dark:text-[#b0a89f]">Could not load your borrows.</p>
        <Button
          onClick={() => {
            setFailed(false);
            setReloadKey((k) => k + 1);
          }}
          className="rounded-full bg-[#e9c46a] px-5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (borrows === null) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3">
        <Spinner className="h-9 w-9" />
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">Loading your borrows...</p>
      </div>
    );
  }

  if (borrows.length === 0) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-serif text-2xl font-bold text-[#2b2620] dark:text-white">
          You have not borrowed any books yet
        </p>
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
          Find something you love in the catalogue and borrow it.
        </p>
        <Link
          href="/books"
          className="rounded-full bg-[#e9c46a] px-5 py-2.5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white md:block dark:bg-[#26211c]">
        <Table>
          <TableHeader>
            <TableRow className="border-black/[0.07] dark:border-white/[0.07] hover:bg-transparent">
              <TableHead className="text-[#2b2620]/60 dark:text-white/60">Image</TableHead>
              <TableHead className="text-[#2b2620]/60 dark:text-white/60">Title</TableHead>
              <TableHead className="text-[#2b2620]/60 dark:text-white/60">Borrow Date</TableHead>
              <TableHead className="text-[#2b2620]/60 dark:text-white/60">Return Date</TableHead>
              <TableHead className="text-right text-[#2b2620]/60 dark:text-white/60">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrows.map((borrow) => (
              <TableRow
                key={borrow._id}
                className="border-black/[0.07] dark:border-white/[0.07] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              >
                <TableCell>
                  <div className="relative h-16 w-12 overflow-hidden rounded-md bg-[#f1eadf] dark:bg-[#3a332b]">
                    {borrow.bookImage ? (
                      <Image
                        src={borrow.bookImage}
                        alt={`Cover of ${borrow.bookTitle}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-5 w-5 text-[#2b2620]/30 dark:text-white/30" aria-hidden />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[#2b2620] dark:text-white">{borrow.bookTitle}</p>
                  {borrow.bookAuthor && (
                    <p className="mt-0.5 text-xs text-[#7d7468] dark:text-[#b0a89f]">
                      by {borrow.bookAuthor}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
                  {formatDate(borrow.borrowDate)}
                </TableCell>
                <TableCell className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
                  {formatDate(borrow.returnDate)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleReturn(borrow)}
                    disabled={returningId === borrow._id}
                    className="rounded-full bg-[#e9c46a] px-4 py-2 text-xs font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:opacity-60"
                  >
                    <Undo2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                    {returningId === borrow._id ? "Returning..." : "Return Book"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-4 md:hidden">
        {borrows.map((borrow) => (
          <div
            key={borrow._id}
            className="flex gap-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-4 dark:bg-[#26211c]"
          >
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-md bg-[#f1eadf] dark:bg-[#3a332b]">
              {borrow.bookImage ? (
                <Image
                  src={borrow.bookImage}
                  alt={`Cover of ${borrow.bookTitle}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-5 w-5 text-[#2b2620]/30 dark:text-white/30" aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-serif text-base font-bold text-[#2b2620] dark:text-white">
                {borrow.bookTitle}
              </p>
              <p className="mt-1 text-xs text-[#7d7468] dark:text-[#b0a89f]">
                Borrowed {formatDate(borrow.borrowDate)} · Due{" "}
                {formatDate(borrow.returnDate)}
              </p>
              <Button
                onClick={() => handleReturn(borrow)}
                disabled={returningId === borrow._id}
                className="mt-3 w-full rounded-full bg-[#e9c46a] px-4 py-2 text-xs font-semibold text-[#2b2620] hover:bg-[#f0d27e] disabled:opacity-60"
              >
                <Undo2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                {returningId === borrow._id ? "Returning..." : "Return Book"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
