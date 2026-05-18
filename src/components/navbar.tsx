"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { navItems } from "@/lib/content";
import { whatsappLink } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const leadMessage = "Assalam o alaikum Farz+, I want to book a free care call for my parent.";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111F]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#B8C0C8] transition hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={whatsappLink(leadMessage)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E6FAF3]/35 px-4 text-sm font-semibold text-white transition hover:bg-[#38D6B0]/10"
          >
            <MessageCircle className="h-4 w-4 text-[#38D6B0]" aria-hidden="true" />
            WhatsApp
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-full bg-[#38D6B0] px-5 text-sm font-bold text-[#07111F] shadow-[0_0_26px_rgba(56,214,176,0.35)] transition hover:bg-[#E6FAF3]"
          >
            Book a Free Care Call
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[#07111F]/95 px-5 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-2xl bg-[#38D6B0] px-4 py-3 text-center text-sm font-bold text-[#07111F]"
            >
              Book a Free Care Call
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
