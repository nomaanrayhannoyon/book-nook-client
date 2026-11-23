import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";
import { PageLoader } from "@/components/spinner";

export const metadata: Metadata = {
  title: "BookNook | Register",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[#f7f2ea] px-6 py-14 dark:bg-[#1a1511]">
      <Suspense fallback={<PageLoader label="Loading register..." />}>
      
        <RegisterForm />
      </Suspense>
    </main>
  );
}
