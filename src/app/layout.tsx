import type { Metadata, Viewport } from "next";
import { AppChrome } from "@/components/app-chrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://farz-plus.vercel.app"),
  title: {
    default: "Farz+ | Human-led parent-care coordination",
    template: "%s | Farz+",
  },
  description:
    "Farz+ helps Pakistani families coordinate parent care with human care managers, consent-aware records, in-app messaging, and clear handoffs.",
  keywords: [
    "elder care Pakistan",
    "parent care Pakistan",
    "overseas Pakistani parents",
    "care manager",
    "family dashboard",
    "Pakistan elder care",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64" },
      { url: "/icons/farz-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/farz-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/farz-icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Farz+ | Care for your parents, even when you're away.",
    description:
      "Pakistan-first parent-care coordination with nationwide digital access and case-by-case physical coordination.",
    url: "https://farz-plus.vercel.app",
    siteName: "Farz+",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Farz+ care dashboard" }],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farz+",
    description: "Care for your parents, even when you're away.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F8FBF9",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Farz+",
    serviceType: "Parent care coordination and elder-care operations",
    areaServed: ["Pakistan"],
    description:
      "Human-led parent-care coordination with consent-aware records, in-app messaging, safety handoffs, and case-by-case external service coordination.",
    provider: {
      "@type": "Organization",
      name: "Farz+",
      url: "https://farz-plus.vercel.app",
    },
  };

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
