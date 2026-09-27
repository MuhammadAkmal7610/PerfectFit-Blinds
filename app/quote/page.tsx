import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { BackButton } from "@/components/BackButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Book a Free Home Measurement | Manchester Blinds",
  description: "Request a free, no-obligation home measurement and quote for made-to-measure blinds in Manchester and Greater Manchester.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-slate-50 py-8 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BackButton />
          <div className="grid items-start gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <aside className="max-w-xl lg:sticky lg:top-28">
              <p className="text-sm font-semibold text-sky-800">Book a free home visit</p>
              <h1 className="display-heading mt-3 font-heading text-slate-900">Let’s find your perfect fit.</h1>
              <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Tell us a little about your home and we’ll be in touch to arrange a convenient, no-obligation visit.
              </p>
              <div className="mt-8 border-y border-slate-200 py-5">
                <h2 className="font-heading text-lg font-semibold text-slate-900">What happens next</h2>
                <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li className="flex gap-3"><span className="font-semibold text-sky-800">01</span><span>Our local team contacts you to confirm a suitable time.</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-sky-800">02</span><span>We bring samples, discuss options and measure your windows.</span></li>
                  <li className="flex gap-3"><span className="font-semibold text-sky-800">03</span><span>You receive a clear quote with no obligation to proceed.</span></li>
                </ol>
              </div>
              <p className="mt-6 text-sm text-slate-600">Prefer to talk? <a className="font-semibold text-slate-900 underline decoration-sky-500 underline-offset-4" href="tel:01612345678">Call our Manchester team on 0161 234 5678</a></p>
            </aside>

            <div id="quote-form" className="min-w-0">
              <EnquiryForm />
              <p className="mt-4 text-xs leading-5 text-slate-500">
                We use these details to respond to your request and arrange the service you asked for. See our <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-800">privacy notice</Link> for how we handle your information.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
