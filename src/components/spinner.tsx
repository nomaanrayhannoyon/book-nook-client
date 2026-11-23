import { Loader2 } from "lucide-react";
import { cn } from "cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn("h-6 w-6 animate-spin text-[#e9c46a]", className)}
    />
  );
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex min-h-[55vh] flex-col items-center justify-center gap-3"
    >
      <Spinner className="h-9 w-9" />
      <p className="text-sm text-[#b0a89f]">{label}</p>
    </div>
  );
}
