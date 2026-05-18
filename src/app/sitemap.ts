import type { MetadataRoute } from "next";

const routes = [
  "",
  "/services",
  "/how-it-works",
  "/care-plans",
  "/for-overseas-pakistanis",
  "/for-families-in-pakistan",
  "/for-employers",
  "/emergency-support",
  "/farz-saathi",
  "/partner-network",
  "/about",
  "/contact",
  "/faq",
  "/dashboard",
  "/operations",
  "/strategy",
  "/privacy",
  "/terms",
  "/medical-disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://farzplus.pk";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
