import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Blinds in Manchester | Our Collection",
  description: "Explore Perfect Fit, roller, Venetian, vertical, Roman, blackout and made-to-measure blinds for homes across Greater Manchester.",
  alternates: { canonical: "/products" },
};

const products = [
  {
    name: "Perfect Fit blinds",
    description: "A sleek solution that fits snugly inside the window frame for a clean, modern finish.",
    ideal: "Ideal for contemporary homes and quick upgrades.",
  },
  {
    name: "Roller blinds",
    description: "Simple, versatile, and available in blackout, screen, and textured finishes.",
    ideal: "Perfect for kitchens, bedrooms, and high-traffic rooms.",
  },
  {
    name: "Venetian blinds",
    description: "Timeless slats that give you precise light control and a classic look.",
    ideal: "A smart option for lounge and dining spaces.",
  },
  {
    name: "Vertical blinds",
    description: "Designed to cover wide windows or patio doors with easy operation and practical styling.",
    ideal: "Great for larger openings and sliding doors.",
  },
  {
    name: "Roman blinds",
    description: "Soft, elegant folds that enhance the warmth and character of a room.",
    ideal: "Best suited to living rooms and bedrooms.",
  },
  {
    name: "Blackout blinds",
    description: "A highly effective way to block light and improve privacy and insulation.",
    ideal: "Especially popular for children’s rooms and bedrooms.",
  },
  {
    name: "Made-to-measure blinds",
    description: "Custom-made to your exact dimensions for a tailored, precise finish.",
    ideal: "Ideal when standard sizes or unusual windows need a precise fit.",
  },
];

export default function ProductsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 text-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <BackButton />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-800">Our collection</p>
              <h1 className="display-heading mt-3 font-heading text-slate-900">Blinds designed for real homes.</h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                From a practical blackout blind to a softly tailored finish, we’ll help you find a style that feels right for your room and budget.
              </p>
            </div>
            <div role="img" aria-label="A light-filled living room with carefully chosen furnishings" className="min-h-[260px] rounded-lg bg-cover bg-center sm:min-h-[340px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85')" }} />
          </div>

          <div className="mt-14 grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <article key={product.name} className="border-t border-slate-300 py-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-800">0{index + 1}</span>
                  <Check aria-hidden="true" className="h-4 w-4 text-sky-700" />
                </div>
                <h2 className="font-heading text-xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                <p className="mt-4 text-sm font-medium text-slate-800">{product.ideal}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-slate-300 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-800">A little help choosing</p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-slate-900">See the samples in your own home.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">We’ll bring a considered selection and help you compare them in your room.</p>
            </div>
            <Link href="/quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
              Arrange a visit <ArrowRight className="h-4 w-4 text-sky-300" />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
