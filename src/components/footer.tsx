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
    <footer className="site-footer site-border border-t">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr] lg:px-8">
        <div>
          <BrandMark />
          <p className="site-muted mt-5 max-w-md text-sm leading-7">
            A human-led parent-care operating layer for Pakistani families, wherever they live.
          </p>
          <Link
            href={whatsappLink("I want to learn more about Farz+ care plans.")}
            className="mt-6 inline-flex rounded-md border border-[#9BBDB6] px-5 py-3 text-sm font-semibold text-[#0D5E51] transition hover:border-[#006E5B] hover:bg-[#F0F8F5]"
          >
            Talk on WhatsApp
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="site-text text-sm font-semibold">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="site-muted text-sm transition hover:text-[#08A98A]">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="site-border site-muted border-t px-5 py-5 text-center text-xs">
        (c) 2026 Farz+. Care coordination, not medical diagnosis or emergency-service replacement.
      </div>
    </footer>
  );
}
