import { CreateLeadInput, Lead } from "../types/lead.types";

export const createLead = (leadData: CreateLeadInput): Lead => {
    const newLead: Lead = {
        id: crypto.randomUUID(),
        status: 'new',
        created_at: new Date().toISOString(),
        ...leadData
    }

    console.log('New lead received:', leadData);

    return newLead;
}