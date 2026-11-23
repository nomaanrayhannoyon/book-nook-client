"use client";

import Link from "next/link";
import { BookPlus, Library, Undo2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageLoader } from "@/components/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

const quickLinks = [
  { href: "/add-book", label: "Add Book", icon: BookPlus },
  { href: "/my-books", label: "My Books", icon: Library },
  { href: "/my-borrows", label: "My Borrows", icon: Undo2 },
];

export function ProfileClient() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return <PageLoader label="Checking your session..." />;
  }

  return (
    <div className="rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-8 dark:bg-[#26211c]">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Avatar className="h-24 w-24 border-2 border-[#e9c46a]">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-[#e9c46a] text-3xl font-bold text-[#2b2620]">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h2 className="font-serif text-3xl font-bold text-[#2b2620] dark:text-white">{user.name}</h2>
          <p className="mt-1 text-[#6f6558] dark:text-[#b0a89f]">{user.email}</p>
          {user.image && (
            <p className="mt-2 truncate text-xs text-[#2b2620]/40 dark:text-white/40">
              Profile photo: {user.image}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-black/[0.08] dark:border-white/[0.08] pt-8 sm:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-3 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-[#f7f2ea] px-4 py-6 text-center transition-colors hover:border-[#a37b28]/40 dark:hover:border-[#e9c46a]/40 dark:bg-[#1a1511]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f1eadf] dark:bg-[#332d26]">
                <Icon className="h-5 w-5 text-[#8f6a1f] dark:text-[#e9c46a]" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-[#2b2620] dark:text-white">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
