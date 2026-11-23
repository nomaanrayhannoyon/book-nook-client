import type { Metadata } from "next";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "BookNook | My Profile",
};

export default function ProfilePage() {
  return (
    <main className="flex-1 bg-[#f7f2ea] px-6 py-12 dark:bg-[#1a1511]">

      <div className="mx-auto w-full max-w-2xl">

        <div className="text-center">

          <p className="text-xs font-bold tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a] uppercase">
            Your Account
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
            My Profile

          </h1>
        </div>
        
        <div className="mt-10">
          <ProfileClient />
        </div>
      </div>
    </main>
  );
}
