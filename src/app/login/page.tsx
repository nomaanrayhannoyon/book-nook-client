import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { PageLoader } from "@/components/spinner";

export const metadata: Metadata = {
  title: "BookNook | Login",
};

export default function LoginPage() {
  return (
    
    <main className="flex flex-1 items-center justify-center bg-[#f7f2ea] px-6 py-14 dark:bg-[#1a1511]">
      <Suspense fallback={<PageLoader label="Loading login..." />}>

        <LoginForm />
      </Suspense>
    </main>
  );
}
