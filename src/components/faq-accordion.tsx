"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: string[][] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="grid gap-3">
      {items.map(([question, answer], index) => (
        <div key={question} className="rounded-[22px] border border-white/10 bg-white/[0.055]">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-white"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            {question}
            <ChevronDown className={cn("h-5 w-5 flex-none text-[#A0E7B4] transition", open === index && "rotate-180")} />
          </button>
          {open === index ? <p className="px-5 pb-5 text-sm leading-7 text-[#B8C0C8]">{answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
