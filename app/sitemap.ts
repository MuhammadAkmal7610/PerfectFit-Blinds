import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://perfectfitblinds.co.uk";

  return ["", "/products", "/about", "/quote", "/contact", "/privacy"].map((path) => ({
    url: `${baseUrl}${path}`,
  }));
}
