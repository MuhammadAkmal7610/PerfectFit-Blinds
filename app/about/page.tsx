import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About PerfectFit Blinds | Manchester",
  description: "Meet the local team helping homeowners across Manchester choose, measure and fit made-to-measure blinds with care.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white text-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <BackButton />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-800">A local team, a personal service</p>
              <h1 className="display-heading mt-3 font-heading text-slate-900">Thoughtful choices. A finish that feels like yours.</h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                PerfectFit Blinds helps homeowners across Manchester find blinds that feel right for their rooms, their routines and their homes.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                From first advice to accurate measuring and careful installation, we keep the process straightforward and personal.
              </p>
            </div>
            <div className="relative min-h-[300px] overflow-hidden rounded-lg sm:min-h-[420px]"><Image src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85" alt="Warm home interior with soft natural light" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
          </div>

        <div className="mt-16 grid gap-x-8 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Professional service", body: "From consultation to installation, we deliver a seamless and stress-free experience." },
            { icon: MapPin, title: "Local knowledge", body: "We understand the needs of homes across Greater Manchester and nearby communities." },
            { icon: Star, title: "Quality first", body: "We work with reliable products and finishes that look great and perform well." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-t border-slate-300 py-6">
              <div className="mb-5 inline-flex text-sky-700"><Icon aria-hidden="true" className="h-5 w-5" /></div>
              <h2 className="font-heading text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 bg-slate-900 p-7 text-white sm:p-10">
          <h2 className="font-heading text-3xl font-semibold">Our approach</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              "We listen to your style, practical needs, and budget.",
              "We recommend blinds that fit your windows and room perfectly.",
              "We install with care, leaving your space tidy and ready to enjoy.",
            ].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 font-bold text-white">{index + 1}</div>
                <p className="text-base leading-7 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
