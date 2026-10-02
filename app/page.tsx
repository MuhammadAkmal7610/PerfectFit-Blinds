import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CheckCircle2, Clock3, MapPin, ShieldCheck, Star, SunMedium } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";

export const metadata: Metadata = {
  title: "Made-to-Measure Blinds in Manchester",
  description: "Find made-to-measure blinds for your Manchester home. Book a free home measurement with PerfectFit Blinds and get friendly advice from local fitters.",
  alternates: { canonical: "/" },
};

const blinds = [
  "Perfect Fit blinds",
  "Roller blinds",
  "Venetian blinds",
  "Vertical blinds",
  "Roman blinds",
  "Blackout blinds",
  "Made-to-measure blinds",
];

const benefits = [
  "Free home measuring service across Greater Manchester",
  "Made-to-measure designs tailored to your windows",
  "Friendly local installers and honest pricing",
  "Energy-efficient and blackout options for every room",
];

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <SiteHeader />
      <main className="bg-white text-slate-800">
        <section
        className="relative flex min-h-[610px] items-center overflow-hidden bg-slate-800 sm:min-h-[680px]"
      >
        <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=90" alt="Light-filled Manchester home with elegant made-to-measure window furnishings" fill preload sizes="100vw" className="object-cover object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,23,23,0.82)_0%,rgba(23,23,23,0.60)_45%,rgba(23,23,23,0.12)_100%)]" />
        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <span className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/85">
              <ShieldCheck className="h-4 w-4 text-sky-300" /> Trusted local blinds specialists
            </span>
            <h1 className="display-heading max-w-xl font-heading text-white">Beautiful blinds made to fit your home perfectly.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              Thoughtful advice, made-to-measure blinds and careful fitting for homes across Manchester and Greater Manchester.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-sky-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-800 sm:text-base">Book a free home measurement <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/quote" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:text-base">Get a free quote</Link>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/25 pt-5 text-sm text-white/90">
              <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-sky-300" /> Made to measure</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-300" /> Local fitters</span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-sky-300" /> Free home measuring</span>
            </div>
          </div>
        </div>
        </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold text-sky-800">Our blind range</p>
          <h2 className="font-heading text-3xl font-semibold text-slate-900 sm:text-4xl">Solutions for every room and style</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {blinds.map((blind) => (
            <div key={blind} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="mb-4 inline-flex rounded-full bg-sky-100 p-3 text-sky-700"><SunMedium className="h-5 w-5" /></div>
              <h3 className="font-heading text-xl font-semibold text-slate-900">{blind}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Clean styling, practical operation, and a finish that suits your home.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-sky-300">Why choose us</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Expert advice, flawless fit, and friendly service.</h2>
            <div className="mt-8 space-y-4">
              {benefits.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-300" />
                  <p className="text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 text-slate-900 shadow-sm">
            <p className="text-sm font-semibold text-sky-800">Our promise</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold">A smooth, stress-free blinds experience.</h3>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-sky-700" />Fast appointments and transparent quotes</div>
              <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-sky-700" />Local teams covering Greater Manchester</div>
              <div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-sky-700" />Accurate measuring and professional fitting</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div className="relative min-h-[280px] overflow-hidden rounded-lg sm:min-h-[390px]"><Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=85" alt="Thoughtfully furnished living room with warm daylight" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-sky-800">Made for your home</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">Good advice makes all the difference.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">See fabrics and finishes in your own light, compare options alongside your interiors, and take the time you need to choose.</p>
            <Link href="/quote" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-sky-800">Plan a free home visit <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-800">Your home, your way</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">Let’s find the right blinds for your home.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">Arrange a friendly, no-obligation home visit with our local team.</p>
          </div>
          <Link href="/quote" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700">Get a free quote <ArrowRight className="h-4 w-4 text-sky-300" /></Link>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
