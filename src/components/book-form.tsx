"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BOOK_CATEGORIES } from "@/lib/types";

export interface BookFormValues {
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: number;
  image: string;
}

interface BookFormProps {
  initial?: Partial<BookFormValues>;
  userName?: string;
  userEmail?: string;
  submitLabel?: string;
 
  resetOnSuccess?: boolean;

  onSubmit: (values: BookFormValues) => Promise<boolean>;
}

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white px-3.5 text-sm text-[#2b2620] dark:text-white placeholder:text-[#2b2620]/35 dark:placeholder:text-white/35 focus-visible:border-[#a37b28] dark:focus-visible:border-[#e9c46a] focus-visible:ring-[#a37b28]/30 dark:focus-visible:ring-[#e9c46a]/30 dark:bg-[#1d1915]";

const emptyValues: BookFormValues = {
  title: "",
  author: "",
  category: "Fiction",
  description: "",
  totalCopies: 1,
  image: "",
};

export function BookForm({
  initial,
  userName,
  userEmail,
  submitLabel = "Add Book",
  resetOnSuccess = false,
  onSubmit,
}: BookFormProps) {
  const [form, setForm] = useState<BookFormValues>({
    ...emptyValues,
    ...initial,
  });
  const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {

    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  async function uploadImage(): Promise<string> {

    if (!file) return form.image.trim();

    const body = new FormData();

    body.append("image", file);
    const response = await fetch("/api/upload", { method: "POST", body });

    const data = (await response.json().catch(() => null)) as {

      url?: string;
      error?: string;
    } | null;
    if (!response.ok || !data?.url) {

      throw new Error(data?.error ?? "Image upload failed. Please try again.");
    }
    return data.url;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    if (submitting) return;

    const nextErrors: Record<string, string> = {};

    if (!form.title.trim()) nextErrors.title = "Book title is required";

    if (!form.author.trim()) nextErrors.author = "Author name is required";

    if (!(form.totalCopies >= 1)) nextErrors.totalCopies = "At least 1 copy is required";
    if (form.image && !/^https?:\/\/\S+/i.test(form.image.trim())) {

      nextErrors.image = "Image URL must start with http:// or https://";
    }
    if (!file && !form.image.trim()) {
      nextErrors.image = "Upload an image or paste an image URL";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const image = await uploadImage();

      const saved = await onSubmit({ ...form, image: image.trim() });

      if (saved && resetOnSuccess) {

        setForm({ ...emptyValues, category: form.category });
        
        setFile(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Saving failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

        <Field aria-invalid={!!errors.title}>

          <FieldLabel htmlFor="book-title" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
            Book Title
          </FieldLabel>

          <Input

            id="book-title"
            type="text"

            value={form.title}
            onChange={(e) => update("title", e.target.value)}

            placeholder="e.g. The Midnight Library"

            aria-invalid={!!errors.title}
            className={inputClass}
          />
          <FieldError>{errors.title}</FieldError>
        </Field>

        <Field aria-invalid={!!errors.author}>

          <FieldLabel htmlFor="author-name" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
            Author Name
          </FieldLabel>
          <Input
            id="author-name"

            type="text"
            value={form.author}

            onChange={(e) => update("author", e.target.value)}
            placeholder="e.g. Matt Haig"

            aria-invalid={!!errors.author}
            className={inputClass}
          />
          <FieldError>{errors.author}</FieldError>

        </Field>

        <Field>
          <FieldLabel className="text-[13px] text-[#2b2620]/85 dark:text-white/85">Category</FieldLabel>
          <Select


            value={form.category}
            onValueChange={(v) => v !== null && update("category", v)}
          >
            <SelectTrigger
              aria-label="Category"

              className={cn(inputClass, "w-full justify-between pr-2.5")}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {BOOK_CATEGORIES.map((category) => (

                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field aria-invalid={!!errors.totalCopies}>

          <FieldLabel htmlFor="total-copies" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
            Total Copies
          </FieldLabel>

          <Input
            id="total-copies"
            type="number"
            min={1}
            value={form.totalCopies}
            onChange={(e) => update("totalCopies", Number(e.target.value))}
            aria-invalid={!!errors.totalCopies}
            className={cn(
              inputClass,
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />
          <FieldError>{errors.totalCopies}</FieldError>

        </Field>

        <Field aria-invalid={!!errors.image}>
          <FieldLabel htmlFor="book-image" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
            Book Image
          </FieldLabel>
          <Input
            id="book-image"

            type="file"
            accept="image/*"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setErrors((prev) => ({ ...prev, image: "" }));
            }}
            className={cn(

              inputClass,
              "cursor-pointer file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-white/15 file:bg-black/5 dark:file:bg-white/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#2b2620]/85 dark:file:text-white/85 hover:file:bg-black/10 dark:hover:file:bg-white/15",
            )}
          />
          {file && <p className="text-xs text-[#2b2620]/50 dark:text-white/50">Selected: {file.name}</p>}
          <p className="text-xs text-[#7d7468] dark:text-[#b0a89f]">
            Optional — file upload needs IMGBB_API_KEY. You can always paste an
            image URL in the field below.
          </p>
        </Field>


        <Field aria-invalid={!!errors.image}>
          <FieldLabel htmlFor="image-url" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
            Image URL {form.image ? "" : "(or paste a link)"}
          </FieldLabel>
          <Input

            id="image-url"
            type="url"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://example.com/cover.jpg"
            aria-invalid={!!errors.image}
            className={inputClass}
          />

          <FieldError>{errors.image}</FieldError>
        </Field>

        <Field className="md:col-span-2">
          <FieldLabel htmlFor="description" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
            Short Description
          </FieldLabel>
          <Textarea
            id="description"

            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="A short blurb about the book..."
            className={cn(inputClass, "h-auto resize-y py-2.5 leading-relaxed")}
          />
        </Field>

        {userName !== undefined && (

          <Field>
            <FieldLabel htmlFor="user-name" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              User Name
            </FieldLabel>
            <Input
              id="user-name"
              type="text"
              value={userName}

              readOnly
              tabIndex={-1}
              className={cn(inputClass, "cursor-not-allowed opacity-70")}
            />
          </Field>
        )}


        {userEmail !== undefined && (
          <Field>
            <FieldLabel htmlFor="user-email" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              User Email
            </FieldLabel>
            <Input
              id="user-email"

              type="email"
              value={userEmail}
              readOnly
              tabIndex={-1}
              className={cn(inputClass, "cursor-not-allowed opacity-70")}
            />
          </Field>
        )}
      </div>


      <Button
        type="submit"
        disabled={submitting}
        
        className="mt-7 h-11 w-full rounded-full bg-[#e9c46a] text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
