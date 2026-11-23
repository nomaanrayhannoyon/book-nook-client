"use client";

import { toast } from "sonner";
import { BookForm, type BookFormValues } from "@/components/book-form";
import { PageLoader } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";
import { apiFetch } from "@/lib/api";

export function AddBookForm() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <PageLoader label="Checking your session..." />;
  }

  async function handleAdd(values: BookFormValues): Promise<boolean> {
    try {
      await apiFetch("/books", {
        method: "POST",
        body: {
          ...values,
          userName: user!.name,
        },
      });
      toast.success("Book added to the library!");
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add book");
      return false;
    }
  }

  return (
    <BookForm
      userName={user.name}
      userEmail={user.email}
      submitLabel="Add Book"
      resetOnSuccess
      onSubmit={handleAdd}
    />
  );
}
