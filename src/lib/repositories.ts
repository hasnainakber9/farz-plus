import type { LeadRecord } from "@/lib/lead-contract";

export interface LeadRepository {
  create(lead: LeadRecord): Promise<LeadRecord>;
}

class InMemoryLeadRepository implements LeadRepository {
  async create(lead: LeadRecord) {
    return lead;
  }
}

export function getLeadRepository(): LeadRepository {
  // Replace with a lazy Supabase client after URL, keys, and RLS policies exist.
  return new InMemoryLeadRepository();
}
