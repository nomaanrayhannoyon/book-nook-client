import { BookOpen, Library, Search, Undo2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse the catalog",
    description:
      "Search the shelves by title, author or category and find something that calls to you.",
  },
  {
    number: "02",
    icon: Library,
    title: "Borrow in one click",
    description:
      "Open a book page and confirm your borrow. Your name and email are filled in for you.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Read at your pace",
    description:
      "You keep the book for 7 days. The due date is always visible in My Borrows.",
  },
  {
    number: "04",
    icon: Undo2,
    title: "Return when done",
    description:
      "One click brings the copy back to the shelf for the next reader to enjoy.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#f7f2ea] py-16 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a]">
            How Borrowing Works
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
            Four Steps to a New Adventure
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            BookNook keeps borrowing as simple as walking up to a shelf and
            picking a book.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-6 dark:bg-[#26211c]"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1eadf] dark:bg-[#332d26]">
                  <step.icon className="h-5 w-5 text-[#8f6a1f] dark:text-[#e9c46a]" aria-hidden />
                </span>
                <span
                  className="font-serif text-5xl font-bold text-[#2b2620]/25 dark:text-white/25"
                  aria-hidden
                >
                  {step.number}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-[#2b2620] dark:text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#7d7468] dark:text-[#b0a89f]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
