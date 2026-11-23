"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BookOpen, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/google-icon";

import { clearToken } from "@/lib/api";
import { signIn, useSession } from "@/lib/auth-client";

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white px-4 text-sm text-[#2b2620] dark:text-white placeholder:text-[#2b2620]/35 dark:placeholder:text-white/35 focus-visible:border-[#a37b28] dark:focus-visible:border-[#e9c46a] focus-visible:ring-[#a37b28]/30 dark:focus-visible:ring-[#e9c46a]/30 dark:bg-[#1d1915]";

function safeNext(raw: string | null): string {

  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

export function LoginForm() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { data, isPending } = useSession();

  const [email, setEmail] = useState("");
  
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [googlePending, setGooglePending] = useState(false);

  const next = safeNext(searchParams.get("next"));

  useEffect(() => {
    if (!isPending && data?.user) {
      router.replace(next);

    }
  }, [isPending, data?.user, router, next]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

      toast.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signIn.email({ email, password });
      if (error) {
        toast.error(error.message ?? "Invalid email or password");

        return;
      }
      clearToken(); // fresh session needs a fresh API JWT
      toast.success("Welcome back!");

      router.replace(next);

      router.refresh();
    } catch {
      toast.error("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    if (googlePending) return;

    setGooglePending(true);
    try {
    
      const { error } = await signIn.social({

        provider: "google",

        callbackURL: next,
        newUserCallbackURL: next,


      });
      if (error) {
        toast.error(error.message ?? "Could not start Google sign-in");
        setGooglePending(false);
      }

    } catch {
      toast.error("Could not reach the server. Please try again.");
      setGooglePending(false);
    }
  }

  return (
    <div className="w-full max-w-md">

      {/* Heading — same serif style as the home page */}
      <div className="mb-8 text-center">

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9c46a]">
          <BookOpen className="h-7 w-7 text-[#2b2620]" aria-hidden />

        </span>
        <h1 className="mt-5 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
          Welcome Back
        </h1>

        <p className="mt-3 text-sm text-[#6f6558] dark:text-[#b0a89f]">

          Log in to borrow books, add titles and track your shelf.
        </p>
      </div>

      <div className="rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-7 dark:bg-[#26211c]">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          <div className="space-y-1.5">

            <Label htmlFor="email" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              Email
            </Label>
            <div className="relative">

              <Mail
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#2b2620]/35 dark:text-white/35"
                aria-hidden

              />
              <Input
                id="email"
                type="email"

                autoComplete="email"
                value={email}

                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"

                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-1.5">

            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
                Password
              </Label>
            </div>
            <div className="relative">
              
              <Lock
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#2b2620]/35 dark:text-white/35"
                aria-hidden
              />
              <Input

                id="password"
                type="password"

                autoComplete="current-password"
                value={password}

                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} pl-10`}
              />
            </div>

          </div>

          <Button
            type="submit"

            disabled={submitting}

            className="h-11 w-full rounded-full bg-[#e9c46a] text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3 py-0.5" aria-hidden>

            <span className="h-px flex-1 bg-black/5 dark:bg-white/10" />

            <span className="text-[11px] font-semibold tracking-[0.15em] text-[#2b2620]/40 dark:text-white/40 uppercase">
              or
            </span>
            <span className="h-px flex-1 bg-black/5 dark:bg-white/10" />

          </div>

          <button

            type="button"
            onClick={handleGoogle}
            disabled={googlePending}

            className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/5 text-sm font-semibold text-[#2b2620] dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:opacity-60"
          >
            <GoogleIcon className="h-4 w-4" />

            {googlePending ? "Redirecting to Google..." : "Continue with Google"}
          </button>
        </form>

      </div>

      <p className="mt-6 text-center text-sm text-[#6f6558] dark:text-[#b0a89f]">

        New to BookNook?{" "}
        <Link

          href="/register"
          className="font-semibold text-[#8f6a1f] dark:text-[#e9c46a] transition-colors hover:text-[#6b5017] dark:hover:text-[#f0d27e] focus-visible:underline"
        >
          Create an account
          
        </Link>
      </p>
    </div>
  );
}
