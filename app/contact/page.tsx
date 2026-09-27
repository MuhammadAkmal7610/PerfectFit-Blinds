import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact PerfectFit Blinds | Manchester",
  description: "Speak to the PerfectFit Blinds team about styles, measuring and fitting. Serving Manchester and surrounding areas.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 py-8 text-slate-800 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BackButton />
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold text-sky-800">Talk to a real person</p>
              <h1 className="display-heading mt-3 font-heading text-slate-900">We’re here to help.</h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Have a question about styles, measuring or fitting? Our Manchester team will be happy to talk it through.</p>
              <div className="mt-8 border-y border-slate-200 py-5">
                <a className="flex items-center gap-3 py-2 font-medium text-slate-900 transition-colors hover:text-sky-800" href="tel:01612345678"><Phone className="h-5 w-5 text-sky-700" />0161 234 5678</a>
                <a className="flex items-center gap-3 py-2 font-medium text-slate-900 transition-colors hover:text-sky-800" href="mailto:hello@perfectfitblinds.co.uk"><Mail className="h-5 w-5 text-sky-700" />hello@perfectfitblinds.co.uk</a>
                <p className="flex items-center gap-3 py-2 text-sm text-slate-600"><MapPin className="h-5 w-5 text-sky-700" />Manchester and Greater Manchester</p>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-600">We visit homes across Manchester, Salford, Bolton, Oldham, Stockport and nearby areas.</p>
            </div>

            <div role="img" aria-label="A softly lit living room with made-to-measure window furnishings" className="flex min-h-[340px] flex-col justify-end rounded-lg bg-cover bg-center p-6 sm:min-h-[440px] sm:p-8" style={{ backgroundImage: "linear-gradient(0deg, rgba(23,23,23,0.72), rgba(23,23,23,0.04) 75%), url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85')" }}>
              <h2 className="font-heading text-2xl font-semibold text-white">A home visit, at your pace.</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/85">See fabric and finish samples in your own light, with friendly advice and no pressure to decide.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/quote" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-800">Arrange a free visit</Link>
                <a href="tel:01612345678" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/60 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">Call now</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
