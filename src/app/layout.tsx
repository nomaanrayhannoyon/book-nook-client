import type { Metadata } from "next";
import { Mulish, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const body = Mulish({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "BookNook | New Arrivals Every Week",
  description:

    "Fiction, science, history, kids and more — discover the newest arrivals at BookNook.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
      
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");if(t==="dark"){document.documentElement.classList.add("dark")}else if(t==="light"){document.documentElement.classList.remove("dark")}}catch(e){}',
          }}
        />
     
        <Suspense
          fallback={
            <header
              aria-hidden
              className="sticky top-0 z-50 h-16 bg-white dark:bg-[#171411]"
            />
          }
        >
          <Navbar />
        </Suspense>
        {children}
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
