"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiFetch } from "@/lib/api";
import type { Book } from "@/lib/types";

interface BorrowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book;
  user: { name: string; email: string } | null;

  onBorrowed: () => void;
}

const readOnlyInput =
  "h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white px-3.5 text-sm text-[#2b2620]/80 dark:text-white/80 opacity-80 cursor-not-allowed dark:bg-[#1d1915]";

export function BorrowModal({
  open,
  onOpenChange,
  book,
  user,
  onBorrowed,
}: BorrowModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    if (!user || submitting) return;
    setSubmitting(true);
    try {
      await apiFetch("/borrows", {
        method: "POST",
        body: { bookId: book._id },
      });
      toast.success(`You borrowed "${book.title}" — return it within 7 days.`);
      onOpenChange(false);
      onBorrowed();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error("Please log in to borrow books");
        onOpenChange(false);
        router.push(`/login?next=${encodeURIComponent(`/books/${book._id}`)}`);
        return;
      }
      toast.error(
        err instanceof Error ? err.message : "Could not borrow this book",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-black/[0.08] dark:border-white/[0.08] bg-white text-[#2b2620] dark:text-white sm:max-w-md dark:bg-[#26211c]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">
            Borrow This Book
          </DialogTitle>
          <DialogDescription className="text-[#6f6558] dark:text-[#b0a89f]">
            Confirm your details below. You have 7 days with the book.
          </DialogDescription>
        </DialogHeader>

        {/* Book summary */}
        <div className="flex items-center gap-4 rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-[#f7f2ea] p-3 dark:bg-[#1a1511]">
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-[#f1eadf] dark:bg-[#3a332b]">
            {book.image ? (
              <Image
                src={book.image}
                alt={`Cover of ${book.title}`}
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
          <div className="min-w-0">
            <p className="truncate font-serif text-base font-bold text-[#2b2620] dark:text-white">
              {book.title}
            </p>
            <p className="truncate text-sm text-[#7d7468] dark:text-[#b0a89f]">by {book.author}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="borrow-user-name" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              User Name
            </Label>
            <Input
              id="borrow-user-name"
              value={user?.name ?? ""}
              readOnly
              tabIndex={-1}
              className={readOnlyInput}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="borrow-user-email" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              User Email
            </Label>
            <Input
              id="borrow-user-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              tabIndex={-1}
              className={readOnlyInput}
            />
          </div>
        </div>

        <DialogFooter className="-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-black/[0.07] dark:border-white/[0.07] bg-[#f6f1e8] p-4 sm:flex-row sm:justify-end dark:bg-[#211c17]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="rounded-full border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-5 text-sm font-semibold text-[#2b2620] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !user}
            className="rounded-full bg-[#e9c46a] px-5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:opacity-60"
          >
            {submitting ? "Confirming..." : "Confirm Borrow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
