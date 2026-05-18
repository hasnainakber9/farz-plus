import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    "Islamabad elder care",
  ],
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
  themeColor: "#050410",
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
    areaServed: ["Islamabad", "Rawalpindi", "Pakistan"],
    description:
      "AI-assisted parent-care coordination with human care managers, emergency protocols, companionship, verified partner coordination, and family dashboards.",
    provider: {
      "@type": "Organization",
      name: "Farz+",
      url: "https://farzplus.pk",
    },
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
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
