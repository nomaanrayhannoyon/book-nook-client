"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";


export function useRequireAuth() {
  const { data, isPending, refetch } = useSession();
  const router = useRouter();
  const user = data?.user ?? null;

  useEffect(() => {
    if (isPending || user) return;
    const next = window.location.pathname;
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  }, [isPending, user, router]);

  return {
    user,

    loading: isPending || !user,
    refetch,
  };
}
