"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { BookOpen, Check, CircleAlert, Image as ImageIcon, Lock, Mail, User } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/google-icon";
import { signIn, signUp, useSession } from "@/lib/auth-client";

const inputClass =
  "h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-white px-4 text-sm text-[#2b2620] dark:text-white placeholder:text-[#2b2620]/35 dark:placeholder:text-white/35 focus-visible:border-[#a37b28] dark:focus-visible:border-[#e9c46a] focus-visible:ring-[#a37b28]/30 dark:focus-visible:ring-[#e9c46a]/30 dark:bg-[#1d1915]";

const criteria = [
  { key: "length", label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { key: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
];

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const { data, isPending } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  useEffect(() => {
    if (oauthError) {
      toast.error("Google sign-in was cancelled or could not be completed. Please try again.");
    }
  }, [oauthError]);

  // Already signed in → no need to register
  useEffect(() => {
    if (!isPending && data?.user) {
      router.replace("/");
    }
  }, [isPending, data?.user, router]);

  const passwordValid = criteria.every((c) => c.test(password));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    // Client-side validation — block registration on invalid input
    if (!name.trim()) {
      setShowErrors(true);
      toast.error("Please enter your name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setShowErrors(true);
      toast.error("Please enter a valid email address");
      return;
    }
    if (photoURL && !/^https?:\/\/\S+$/i.test(photoURL)) {
      setShowErrors(true);
      toast.error("Photo URL must start with http:// or https://");
      return;
    }
    if (!passwordValid) {
      setShowErrors(true);
      toast.error("Password does not meet the requirements");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email,
        password,
        ...(photoURL ? { image: photoURL } : {}),
      });
      if (error) {
        toast.error(error.message ?? "Registration failed");
        return;
      }
      toast.success("Account created! Please log in.");
      router.push("/login");
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
        callbackURL: "/",
        newUserCallbackURL: "/",
        errorCallbackURL: "/register?error=oauth",
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
      <div className="mb-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9c46a]">
          <BookOpen className="h-7 w-7 text-[#2b2620]" aria-hidden />
        </span>
        <h1 className="mt-5 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
          Join BookNook
        </h1>
        <p className="mt-3 text-sm text-[#6f6558] dark:text-[#b0a89f]">
          Create an account to borrow books and grow the catalogue.
        </p>
      </div>

      <div className="rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-7 dark:bg-[#26211c]">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              Name
            </Label>
            <div className="relative">
              <User
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#2b2620]/35 dark:text-white/35"
                aria-hidden
              />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

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
            <Label htmlFor="photo-url" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              Photo-URL
            </Label>
            <div className="relative">
              <ImageIcon
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#2b2620]/35 dark:text-white/35"
                aria-hidden
              />
              <Input
                id="photo-url"
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[13px] text-[#2b2620]/85 dark:text-white/85">
              Password
            </Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#2b2620]/35 dark:text-white/35"
                aria-hidden
              />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowErrors(true);
                }}
                placeholder="••••••••"
                aria-invalid={showErrors && !passwordValid}
                className={cn(
                  inputClass,
                  "pl-10",
                  showErrors &&
                    !passwordValid &&
                    "border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/30",
                )}
              />
            </div>

            {/* Password rules — registration is blocked until all pass */}
            <ul className="mt-2 space-y-1.5">
              {criteria.map((c) => {
                const ok = c.test(password);
                return (
                  <li
                    key={c.key}
                    className={cn(
                      "flex items-center gap-2 text-xs transition-colors",
                      ok
                        ? "text-[#a5d8ab]"
                        : showErrors
                          ? "text-red-400"
                          : "text-[#2b2620]/45 dark:text-white/45",
                    )}
                  >
                    {ok ? (
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <CircleAlert className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {c.label}
                  </li>
                );
              })}
            </ul>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-full bg-[#e9c46a] text-sm font-semibold text-[#2b2620] hover:bg-[#f0d27e] focus-visible:ring-[#a37b28]/50 dark:focus-visible:ring-[#e9c46a]/50 disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Register"}
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
            {googlePending ? "Redirecting to Google..." : "Sign up with Google"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-[#6f6558] dark:text-[#b0a89f]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#8f6a1f] dark:text-[#e9c46a] transition-colors hover:text-[#6b5017] dark:hover:text-[#f0d27e] focus-visible:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
