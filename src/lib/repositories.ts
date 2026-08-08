import type { LeadRecord } from "@/lib/lead-contract";
import type { CaseCareRequest } from "@/types/farz";

export interface LeadRepository {
  create(lead: LeadRecord): Promise<LeadRecord>;
}

export interface CareRequestRepository {
  create(request: CaseCareRequest): Promise<CaseCareRequest>;
  list(): Promise<CaseCareRequest[]>;
}

class InMemoryLeadRepository implements LeadRepository {
  async create(lead: LeadRecord) {
    return lead;
  }
}

class InMemoryCareRequestRepository implements CareRequestRepository {
  private readonly requests: CaseCareRequest[] = [];

  async create(request: CaseCareRequest) {
    this.requests.push(request);
    return request;
  }

  async list() {
    return this.requests;
  }
}

export function getLeadRepository(): LeadRepository {
  return new InMemoryLeadRepository();
}

export function getCareRequestRepository(): CareRequestRepository {
  return new InMemoryCareRequestRepository();
}
