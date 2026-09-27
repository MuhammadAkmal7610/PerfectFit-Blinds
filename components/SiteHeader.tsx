"use client";

import Link from "next/link";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/products", label: "Our blinds" },
  { href: "/about", label: "Our approach" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="PerfectFit Blinds home" className="group flex flex-col leading-tight">
          <span className="font-heading text-[21px] font-semibold tracking-normal text-slate-900">PerfectFit</span>
          <span className="mt-1 text-[10px] font-semibold uppercase text-slate-600">Blinds · Manchester</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[15px] font-medium text-slate-700 transition-colors hover:text-sky-800">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:01612345678" aria-label="Call 0161 234 5678" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-800 transition-colors hover:text-sky-800 lg:hidden">
            <Phone aria-hidden="true" className="h-4 w-4 text-sky-700" />
          </a>
          <a href="tel:01612345678" aria-label="Call 0161 234 5678" className="hidden items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-sky-800 lg:inline-flex">
            <Phone aria-hidden="true" className="h-4 w-4 text-sky-700" />
            0161 234 5678
          </a>
          <Link href="/quote" className="hidden items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 sm:inline-flex">
            Book a free measurement <ArrowRight aria-hidden="true" className="h-4 w-4 text-sky-300" />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-800 md:hidden"
          >
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 bg-slate-50 px-4 py-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium text-slate-700">Home</Link>
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="border-t border-slate-200 py-3 text-sm font-medium text-slate-700">
                {link.label}
              </Link>
            ))}
            <Link href="/quote" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              Book a free measurement <ArrowRight aria-hidden="true" className="h-4 w-4 text-sky-300" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
