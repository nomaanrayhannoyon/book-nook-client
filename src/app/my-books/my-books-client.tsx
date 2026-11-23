"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookForm } from "@/components/book-form";
import { PageLoader, Spinner } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/api";
import type { Book } from "@/lib/types";

export function MyBooksClient() {
  const { user, loading } = useRequireAuth();
  const [books, setBooks] = useState<Book[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [editing, setEditing] = useState<Book | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const email = user?.email ?? null;

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    apiFetch<Book[]>(`/books?userEmail=${encodeURIComponent(email)}`, {
      auth: false,
    })
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
          toast.error("Could not load your books");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [email, reloadKey]);

  if (loading) {
    return <PageLoader label="Checking your session..." />;
  }

  if (failed) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-[#6f6558] dark:text-[#b0a89f]">Could not load your books.</p>
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

  if (books === null) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3">
        <Spinner className="h-9 w-9" />
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">Loading your books...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex min-h-[35vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-serif text-2xl font-bold text-[#2b2620] dark:text-white">
          You have not added any books yet
        </p>
        <p className="text-sm text-[#6f6558] dark:text-[#b0a89f]">
          Add your first title and it will appear here.
        </p>
        <Link
          href="/add-book"
          className="rounded-full bg-[#e9c46a] px-5 py-2.5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
        >
          Add a Book
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book._id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#26211c]"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f1eadf] dark:bg-[#3a332b]">
              {book.image ? (
                <Image
                  src={book.image}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <BookOpen className="h-12 w-12 text-[#2b2620]/25 dark:text-white/25" aria-hidden />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <Badge className="rounded-full bg-[#e9c46a] px-2.5 py-1 text-[11px] font-bold text-[#2b2620] hover:bg-[#e9c46a]">
                  {book.category}
                </Badge>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <h3 className="line-clamp-2 font-serif text-lg leading-snug font-bold text-[#2b2620] dark:text-white">
                {book.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#7d7468] dark:text-[#b0a89f]">by {book.author}</p>
              <p className="mt-2 text-xs text-[#2b2620]/45 dark:text-white/45">
                {book.availableCopies}/{book.totalCopies} copies available
              </p>

              <div className="mt-auto flex gap-2 pt-5">
                <Button
                  onClick={() => {
                    setEditing(book);
                    setEditOpen(true);
                  }}
                  className="flex-1 rounded-full bg-[#e9c46a] px-4 py-2.5 text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50"
                >
                  <Pencil className="mr-1.5 h-4 w-4" aria-hidden />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setDeleting(book);
                    setDeleteOpen(true);
                  }}
                  variant="outline"
                  className="flex-1 rounded-full border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" aria-hidden />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit dialog — prefilled with the book's current data */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-black/[0.08] dark:border-white/[0.08] bg-white text-[#2b2620] dark:text-white sm:max-w-2xl dark:bg-[#26211c]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">
              Edit Book
            </DialogTitle>
            <DialogDescription className="text-[#6f6558] dark:text-[#b0a89f]">
              Update the details of your book. Changes are saved immediately.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <BookForm
              key={editing._id}
              initial={{
                title: editing.title,
                author: editing.author,
                category: editing.category,
                description: editing.description,
                totalCopies: editing.totalCopies,
                image: editing.image,
              }}
              userName={editing.userName}
              userEmail={editing.userEmail}
              submitLabel="Save Changes"
              onSubmit={async (values) => {
                try {
                  const updated = await apiFetch<Book>(
                    `/books/${editing._id}`,
                    { method: "PATCH", body: values },
                  );
                  setBooks((prev) =>
                    prev
                      ? prev.map((b) => (b._id === updated._id ? updated : b))
                      : prev,
                  );
                  toast.success("Book updated successfully");
                  setEditOpen(false);
                  return true;
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Failed to update book",
                  );
                  return false;
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Custom delete confirmation modal (not the browser confirm) */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="border-black/[0.08] dark:border-white/[0.08] bg-white text-[#2b2620] dark:text-white sm:max-w-md dark:bg-[#26211c]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">
              Delete this book?
            </DialogTitle>
            <DialogDescription className="text-[#6f6558] dark:text-[#b0a89f]">
              {deleting
                ? `“${deleting.title}” will be permanently removed from the catalogue. This cannot be undone.`
                : "This book will be permanently removed from the catalogue."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-black/[0.07] dark:border-white/[0.07] bg-[#f6f1e8] p-4 sm:flex-row sm:justify-end dark:bg-[#211c17]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteBusy}
              className="rounded-full border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 px-5 text-sm font-semibold text-[#2b2620] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={deleteBusy}
              onClick={async () => {
                if (!deleting) return;
                setDeleteBusy(true);
                try {
                  await apiFetch(`/books/${deleting._id}`, { method: "DELETE" });
                  setBooks((prev) =>
                    prev ? prev.filter((b) => b._id !== deleting._id) : prev,
                  );
                  toast.success(`“${deleting.title}” deleted`);
                  setDeleteOpen(false);
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Failed to delete book",
                  );
                } finally {
                  setDeleteBusy(false);
                }
              }}
              className="rounded-full bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600 focus-visible:ring-red-500/50 disabled:opacity-60"
            >
              {deleteBusy ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
