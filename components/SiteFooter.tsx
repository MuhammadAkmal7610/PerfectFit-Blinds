import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="font-heading text-xl font-semibold text-white">PerfectFit Blinds</Link>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-300">Made-to-measure blinds, friendly advice and careful fitting for homes across Greater Manchester.</p>
        </div>
        <div>
          <h2 className="font-heading text-sm font-semibold text-white">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li><Link className="transition-colors hover:text-white" href="/products">Our blinds</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/about">Our approach</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/quote">Book a home visit</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/contact">Contact</Link></li>
            <li><Link className="transition-colors hover:text-white" href="/privacy">Privacy notice</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-sm font-semibold text-white">Speak to our team</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li><a className="inline-flex items-center gap-2 transition-colors hover:text-white" href="tel:01612345678"><Phone aria-hidden="true" className="h-4 w-4 text-sky-300" />0161 234 5678</a></li>
            <li className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4 text-sky-300" />Manchester &amp; Greater Manchester</li>
            <li><a className="transition-colors hover:text-white" href="mailto:hello@perfectfitblinds.co.uk">hello@perfectfitblinds.co.uk</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-400 sm:px-6 lg:px-8">© {new Date().getFullYear()} PerfectFit Blinds. Proudly serving Greater Manchester.</div>
      </div>
    </footer>
  );
}
