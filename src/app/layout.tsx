import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://farzplus.pk"),
  title: {
    default: "Farz+ | Pakistan's AI-assisted parent-care operating system",
    template: "%s | Farz+",
  },
  description:
    "Farz+ helps Pakistani families support aging parents with care managers, emergency plans, companionship, verified partners, and transparent family dashboards.",
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
      "Pakistan-first parent-care coordination for overseas families, busy professionals, and elders aging at home.",
    url: "https://farzplus.pk",
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
  themeColor: "#07111F",
  colorScheme: "dark",
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
      "AI-assisted parent-care coordination with human care managers, emergency protocols, companionship, verified partner coordination, and family dashboards.",
    provider: {
      "@type": "Organization",
      name: "Farz+",
      url: "https://farzplus.pk",
    },
  };

  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
