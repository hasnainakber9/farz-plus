import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  parentCity: z.string().min(2),
  familyLocation: z.string().min(2),
  urgency: z.enum(["planning", "this_week", "urgent"]),
  needs: z.string().min(10),
  consent: z.literal(true),
});

export type LeadInput = z.infer<typeof leadSchema>;

export interface LeadRecord extends LeadInput {
  id: string;
  source: "website";
  createdAt: string;
  status: "new" | "care_call_scheduled" | "converted" | "closed";
}

export function createLeadRecord(input: LeadInput): LeadRecord {
  return {
    ...input,
    id: `lead_${Date.now()}`,
    source: "website",
    createdAt: new Date().toISOString(),
    status: "new",
  };
}
