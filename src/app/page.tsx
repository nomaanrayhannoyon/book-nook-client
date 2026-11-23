import "swiper/css";
import "swiper/css/pagination";

import { Hero } from "@/components/hero";
import { NewArrivals } from "@/components/new-arrivals";
import { TopCategories } from "@/components/top-categories";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { CtaBanner } from "@/components/cta-banner";
import { getBooks } from "@/lib/books-server";

export default async function Home() {

  const newBooks = await getBooks("?sort=newest&limit=6");
  return (
    <main className="flex-1">
      <Hero />
      <NewArrivals initialBooks={newBooks} />
      <TopCategories />
      <HowItWorks />
      <Testimonials />
      <CtaBanner />
    </main>
  );
}
