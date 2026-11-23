"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";
import { clearToken } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut();
      clearToken();
      setMobileOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log you out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  function navLink(href: string, label: string) {
    const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2620]/40 dark:focus-visible:ring-white/50",
          active ? "bg-black/5 dark:bg-white/10 text-[#2b2620] dark:text-white" : "text-[#2b2620]/60 dark:text-white/60 hover:text-[#2b2620] dark:hover:text-white",
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#171411]">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-6 md:px-8">
        
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9c46a]">
            <BookOpen className="h-5 w-5 text-[#2b2620]" aria-hidden />
          </span>
          <span className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">BookNook</span>
        </Link>

      
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => navLink(link.href, link.label))}
        </nav>

  
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {isPending ? (
            <span className="hidden h-9 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/10 sm:block" aria-hidden />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Open account menu"
                className="flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2620]/40 dark:focus-visible:ring-white/50"
              >
                <Avatar className="h-9 w-9 border border-black/10 dark:border-white/20">
                  <AvatarImage
                    src={user.image ?? undefined}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#e9c46a] text-sm font-bold text-[#2b2620]">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
             
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="gap-2 text-sm"
                  >
                    <User className="h-4 w-4" aria-hidden />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="gap-2 text-sm text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-[#2b2620] dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2620]/40 dark:focus-visible:ring-white/50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#e9c46a] px-4 py-1.5 text-sm font-semibold text-[#2b2620] transition-colors hover:bg-[#f0d27e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60"
              >
                Register
              </Link>
            </div>
          )}

     
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="rounded-full p-2 text-[#2b2620]/80 dark:text-white/80 transition-colors hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#2b2620] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b2620]/40 dark:focus-visible:ring-white/50 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

     
      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-black/10 dark:border-white/10 bg-white px-6 pt-3 pb-5 md:hidden dark:bg-[#171411]"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => navLink(link.href, link.label))}
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-black/10 dark:border-white/10 pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2">
                  <Avatar className="h-9 w-9 border border-black/10 dark:border-white/20">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-[#e9c46a] text-sm font-bold text-[#2b2620]">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#2b2620] dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#2b2620]/50 dark:text-white/50">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#2b2620]/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[#2b2620]/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-4 py-2 text-center text-sm font-medium text-[#2b2620] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-[#e9c46a] px-4 py-2 text-center text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
