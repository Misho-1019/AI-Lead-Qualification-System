export interface CreateLeadInput {
    full_name: string;
    email: string;
    company?: string;
    role?: string;
    website?: string;
    industry?: string;
    company_size?: string;
    budget_range?: string;
    source?: string;
    pain_point?: string;
    notes?: string;
}