import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      '"I joined to clear out a bookshelf and ended up finding three new favourite authors. Borrowing takes seconds and the due date keeps me honest."',
    initials: "NJ",
    name: "Nusrat Jahan",
    role: "Member since 2024",
  },
  {
    quote:
      '"The kids section is a lifesaver. My daughter picks two books every Sunday and returns them a week later — it feels like a real neighbourhood library."',
    initials: "AH",
    name: "Arif Hossain",
    role: "Parent & regular borrower",
  },
  {
    quote:
      '"Adding my old history books took five minutes, including the cover upload. Seeing someone borrow a book I contributed genuinely made my week."',
    initials: "TA",
    name: "Tanvir Ahmed",
    role: "Contributor",
  },
];

export function Testimonials() {
  return (
    <section className="bg-[#f7f2ea] py-16 dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8f6a1f] dark:text-[#e9c46a]">
            Reader Reviews
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-[#2b2620] dark:text-white">
            Loved by Our Readers
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-[#6f6558] dark:text-[#b0a89f] md:text-lg">
            A few words from the people who make BookNook feel like home.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white p-6 dark:bg-[#26211c]"
            >
              <div
                role="img"
                aria-label="Rated 5 out of 5 stars"
                className="flex gap-1"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-[#f0b429]"
                    aria-hidden
                  />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-[#6f6558] dark:text-[#b0a89f] md:text-[15px]">
                {item.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f1eadf] text-sm font-semibold text-[#2b2620] dark:text-white dark:bg-[#332d26]"
                  aria-hidden
                >
                  {item.initials}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-[#2b2620] dark:text-white">
                    {item.name}
                  </span>
                  <span className="block text-sm text-[#7d7468] dark:text-[#b0a89f]">
                    {item.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
