import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How PerfectFit Blinds uses and protects the personal information you share when requesting a quote or home measurement.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white text-slate-800">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-sm font-semibold text-sky-800">Your information</p>
          <h1 className="display-heading mt-3 font-heading text-slate-900">Privacy notice</h1>
          <p className="mt-5 text-base leading-7 text-slate-600">This notice explains how PerfectFit Blinds uses the information you provide when you contact us or request a quote or home measurement.</p>

          <div className="mt-10 space-y-8">
            <section>
              <h2 className="font-heading text-xl font-semibold text-slate-900">What we collect and why</h2>
              <p className="mt-2 leading-7 text-slate-600">We collect your name, telephone number, email address, postcode, the blinds and service you are interested in, your preferred appointment date, and any message you choose to send. We use these details to respond to your enquiry, contact you about the requested service, and manage any resulting appointment or quotation.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-slate-900">Our lawful basis</h2>
              <p className="mt-2 leading-7 text-slate-600">We use your information because it is needed to take steps you request before entering into a contract, and where needed to manage a service or order. We only use it for relevant business records or other purposes where we have a lawful basis.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-slate-900">Storage, access and retention</h2>
              <p className="mt-2 leading-7 text-slate-600">Enquiries are stored in a hosted database and can be viewed by authorised PerfectFit Blinds staff through a password-protected dashboard. The website server uses restricted credentials to access the database; the database is not directly accessible to public visitors. We keep enquiry information only for as long as it is needed to respond, manage the customer relationship, and meet applicable record-keeping requirements, then securely delete it.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-slate-900">Who we share it with</h2>
              <p className="mt-2 leading-7 text-slate-600">We do not sell your personal information. Hosting, database, or IT providers may process it on our behalf to operate and secure the website. We may also disclose information where required by law. We do not use enquiry details for unrelated marketing.</p>
            </section>

            <section>
              <h2 className="font-heading text-xl font-semibold text-slate-900">Your choices and rights</h2>
              <p className="mt-2 leading-7 text-slate-600">Depending on the circumstances, you can ask for a copy of your information, ask us to correct or delete it, or object to or restrict some uses. You can also raise a concern with the UK Information Commissioner’s Office. To make a request or ask a question, contact us through our <Link href="/contact" className="font-medium text-slate-900 underline underline-offset-2">contact page</Link>.</p>
            </section>

            <p className="border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">We may update this notice when our practices change. The business should review this notice and confirm its contact details, suppliers, retention period, and operational privacy processes before launch.</p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
