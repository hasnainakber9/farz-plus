import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { whatsappLink } from "@/lib/utils";

const footerGroups = [
  {
    title: "Product",
    links: [
      ["Services", "/services"],
      ["How It Works", "/how-it-works"],
      ["Care Plans", "/care-plans"],
      ["Dashboard", "/dashboard"],
      ["Operations", "/operations"],
    ],
  },
  {
    title: "Families",
    links: [
      ["Overseas Pakistanis", "/for-overseas-pakistanis"],
      ["Families in Pakistan", "/for-families-in-pakistan"],
      ["Emergency Support", "/emergency-support"],
      ["Farz+ Saathi", "/farz-saathi"],
    ],
  },
  {
    title: "Trust",
    links: [
      ["Partner Network", "/partner-network"],
      ["FAQ", "/faq"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
      ["Medical Disclaimer", "/medical-disclaimer"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050410]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-md text-sm leading-7 text-[#B8C0C8]">
            Pakistan&apos;s AI-assisted parent-care operating system for families who live away from their elders.
          </p>
          <Link
            href={whatsappLink("I want to learn more about Farz+ care plans.")}
            className="mt-6 inline-flex rounded-full border border-[#A0E7B4]/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4CD364]/10"
          >
            Talk on WhatsApp
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-[#B8C0C8] transition hover:text-[#A0E7B4]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#7F8A96]">
        (c) 2026 Farz+. Care coordination, not medical diagnosis or emergency-service replacement.
      </div>
    </footer>
  );
}
