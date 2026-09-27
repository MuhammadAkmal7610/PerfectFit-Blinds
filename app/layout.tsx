import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://perfectfitblinds.co.uk"),
  title: {
    default: "Made-to-Measure Blinds in Manchester | PerfectFit Blinds",
    template: "%s | PerfectFit Blinds",
  },
  description:
    "Explore made-to-measure blinds in Manchester. Book a free home measurement with PerfectFit Blinds for thoughtful advice, a clear quote and careful fitting.",
  keywords: [
    "blinds Manchester",
    "roller blinds Manchester",
    "blackout blinds",
    "made to measure blinds",
    "Perfect Fit blinds",
  ],
  openGraph: {
    title: "PerfectFit Blinds",
    description: "Made-to-measure blinds, free home measurements and careful fitting across Greater Manchester.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
