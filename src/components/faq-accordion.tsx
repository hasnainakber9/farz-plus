"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items }: { items: string[][] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-y border-[#D9E5E1]">
      {items.map(([question, answer], index) => (
        <div key={question} className="border-b border-[#D9E5E1] last:border-b-0">
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-[#143A35]"
            onClick={() => setOpen(open === index ? -1 : index)}
            aria-expanded={open === index}
          >
            {question}
            <ChevronDown className={cn("h-5 w-5 flex-none text-[#087B69] transition", open === index && "rotate-180")} />
          </button>
          {open === index ? <p className="max-w-3xl pb-5 text-sm leading-7 text-[#617570]">{answer}</p> : null}
        </div>
      ))}
    </div>
  );
}
