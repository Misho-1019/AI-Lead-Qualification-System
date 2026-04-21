import { CreateLeadInput } from "../types/lead.types";

export const createLead = (leadData: CreateLeadInput): CreateLeadInput => {
    console.log('New lead received:', leadData);

    return leadData;
}