import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

const socials = [
  {
    label: "X",
    href: "https://x.com/booknook",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/booknook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/booknook",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "GitHub",
    href: "https://github.com/booknook",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
];

const contact = [
  { icon: Mail, text: "hello@booknook.com", href: "mailto:hello@booknook.com" },
  { icon: Phone, text: "+880 1700-000000", href: "tel:+8801700000000" },
  {
    icon: MapPin,
    text: "12 Reading Lane, Dhaka 1207, Bangladesh",
    href: "https://maps.google.com/?q=12+Reading+Lane+Dhaka",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/[0.08] dark:border-white/[0.08] bg-[#f7f2ea] dark:bg-[#1a1511]">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-14 pb-12 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9c46a]">
                <BookOpen className="h-6 w-6 text-[#2b2620]" aria-hidden />
              </span>
              <span className="font-serif text-2xl font-bold text-[#2b2620] dark:text-white">
                BookNook
              </span>
            </Link>
            <p className="mt-4 max-w-[300px] text-sm leading-relaxed text-[#6f6558] dark:text-[#b0a89f]">
              A cozy corner of the internet where readers add books, borrow them
              for a while, and bring them back for the next curious mind.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#5f574c] dark:text-[#d8d2cb] transition-colors hover:bg-[#f1eadf] dark:hover:bg-[#3a332b] hover:text-[#2b2620] dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a37b28]/60 dark:focus-visible:ring-[#e9c46a]/60 dark:bg-[#26211c]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[18px] w-[18px]"
                    aria-hidden
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">
              Quick Links
            </h2>
            <ul className="mt-6 space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-[#6f6558] dark:text-[#b0a89f] transition-colors hover:text-[#2b2620] dark:hover:text-white focus-visible:outline-none focus-visible:text-[#2b2620] dark:focus-visible:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        
          <div>
            <h2 className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">
              Contact Us
            </h2>
            <ul className="mt-6 space-y-4">
              {contact.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.text} className="flex items-start gap-3">
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#8f6a1f] dark:text-[#e9c46a]"
                      aria-hidden
                    />
                    <a
                      href={item.href}
                      className="text-[15px] leading-relaxed text-[#6f6558] dark:text-[#b0a89f] transition-colors hover:text-[#2b2620] dark:hover:text-white focus-visible:outline-none focus-visible:text-[#2b2620] dark:focus-visible:text-white"
                    >
                      {item.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-[#2b2620] dark:text-white">
              About BookNook
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#6f6558] dark:text-[#b0a89f]">
              <p>
                BookNook is a small online library built for book lovers.
                Browse the catalog, borrow what speaks to you, and return it
                when you are done — simple as that.
              </p>
              <p>Open daily, all day long. The kettle is always on. ☕</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black/[0.07] dark:border-white/[0.07]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-[#8f887f] md:flex-row md:px-8">
          <p>© 2026 BookNook. All rights reserved.</p>
          <p>Made with care for readers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
