"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { whatsappLink } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().min(8, "Please enter a contact number."),
  parentCity: z.string().min(2, "Please enter the parent city."),
  familyLocation: z.string().min(2, "Please enter your location."),
  urgency: z.enum(["planning", "this_week", "urgent"]),
  needs: z.string().min(10, "Please share a little context."),
  consent: z.literal(true, {
    error: () => "Please confirm consent to be contacted.",
  }),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-[#7F8A96] focus:border-[#4CD364] focus:ring-2 focus:ring-[#4CD364]/20";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      urgency: "planning",
      consent: true,
    },
  });

  async function onSubmit(values: LeadFormValues) {
    setStatus("idle");
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    reset({ urgency: "planning", consent: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <FieldError error={errors.name?.message}>
          <input className={fieldClass} placeholder="Your name" {...register("name")} />
        </FieldError>
        <FieldError error={errors.email?.message}>
          <input className={fieldClass} placeholder="Email" type="email" {...register("email")} />
        </FieldError>
        <FieldError error={errors.phone?.message}>
          <input className={fieldClass} placeholder="Phone or WhatsApp" {...register("phone")} />
        </FieldError>
        <FieldError error={errors.parentCity?.message}>
          <input className={fieldClass} placeholder="Parent city" {...register("parentCity")} />
        </FieldError>
        <FieldError error={errors.familyLocation?.message}>
          <input className={fieldClass} placeholder="Your location, e.g. Dubai" {...register("familyLocation")} />
        </FieldError>
        <FieldError error={errors.urgency?.message}>
          <select className={fieldClass} {...register("urgency")}>
            <option className="bg-[#050410]" value="planning">Planning ahead</option>
            <option className="bg-[#050410]" value="this_week">Need help this week</option>
            <option className="bg-[#050410]" value="urgent">Urgent family concern</option>
          </select>
        </FieldError>
      </div>
      <FieldError error={errors.needs?.message}>
        <textarea
          className={`${fieldClass} min-h-32 py-3`}
          placeholder="Tell us about your parent, medicines, appointments, emergency concerns, or companionship needs."
          {...register("needs")}
        />
      </FieldError>
      <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-[#B8C0C8]">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-white/20 bg-[#050410] accent-[#4CD364]"
          {...register("consent")}
        />
        <span>I agree that Farz+ may contact me about a care consultation. Medical emergencies should still go to local emergency services.</span>
      </label>
      {errors.consent ? <p className="text-sm text-[#FF9BA3]">{errors.consent.message}</p> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#4CD364] px-6 py-3 text-sm font-bold text-[#050410] transition hover:bg-[#A0E7B4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Sending..." : "Book a Free Care Call"}
        </button>
        <a
          href={whatsappLink("I want to book a free Farz+ care call.")}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#A0E7B4]/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4CD364]/10"
        >
          <MessageCircle className="h-4 w-4 text-[#4CD364]" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
      {status === "success" ? (
        <div className="rounded-2xl border border-[#4CD364]/30 bg-[#4CD364]/10 p-4 text-sm text-[#A0E7B4]">
          Care-call request captured. The API is Supabase-ready and currently returns a safe MVP acknowledgement.
        </div>
      ) : null}
      {status === "error" ? (
        <div className="rounded-2xl border border-[#FF4D5A]/30 bg-[#FF4D5A]/10 p-4 text-sm text-[#FFB6BC]">
          Something went wrong. Please try WhatsApp while the pilot stack is being connected.
        </div>
      ) : null}
    </form>
  );
}

function FieldError({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <label className="grid gap-2">
      {children}
      {error ? <span className="text-xs text-[#FF9BA3]">{error}</span> : null}
    </label>
  );
}
