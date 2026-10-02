const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "PerfectFit Blinds",
  url: "https://perfectfitblinds.co.uk",
  telephone: "+44-161-234-5678",
  email: "hello@perfectfitblinds.co.uk",
  areaServed: ["Manchester", "Greater Manchester"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Manchester",
    addressRegion: "Greater Manchester",
    addressCountry: "GB",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+44-161-234-5678",
    email: "hello@perfectfitblinds.co.uk",
    contactType: "customer service",
    areaServed: "GB",
    availableLanguage: "English",
  },
};

export function LocalBusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c") }}
    />
  );
}