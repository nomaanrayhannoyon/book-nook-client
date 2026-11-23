import { PageLoader } from "@/components/spinner";

export default function Loading() {
  return (
    <main className="flex flex-1 bg-[#f7f2ea] dark:bg-[#1a1511]">
      <PageLoader label="Loading..." />
    </main>
  );
}
