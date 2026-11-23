"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

const slides = [
  {
    image: "/images/hero-1.jpg",
    alt: "Curved library shelves filled with colorful books",
    eyebrow: "Fresh Every Day",
    title: "New Arrivals Every Week",
    text: "Fiction, science, history, kids and more — our newest arrivals land on the front page so you never miss a great book.",
  },
  {
    image: "/images/hero-2.jpg",
    alt: "Library aisle lined with tall bookshelves",
    eyebrow: "Borrow, Read, Return",
    title: "A Library Without the Queue",
    text: "Pick a book, confirm the borrow in one click, and bring it back whenever you are done. No queues, no late fees, just stories.",
  },
  {
    image: "/images/hero-3.jpg",
    alt: "Rows of books on wooden library shelves",
    eyebrow: "Share Your Shelf",
    title: "Pass On the Books You Love",
    text: "Added a book to BookNook yet? Upload a cover, set the number of copies, and start a new reader's next favourite story.",
  },
];

export function Hero() {
  return (
    <section className="relative isolate">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={900}
        className="h-[calc(100vh-4rem)] min-h-[540px] w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.image}-${index}`} className="relative">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
          
              loading="eager"
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35"
            />

            <div className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-center px-6 pb-12 md:px-8">
              <div className="max-w-3xl">
                <span className="inline-block rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-5 font-serif text-4xl leading-[1.05] font-semibold text-white sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-[560px] text-base leading-relaxed text-white/85 md:text-lg">
                  {slide.text}
                </p>
                <Link
                  href="/books"
                  className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#1f1b16] transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Browse Books
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
