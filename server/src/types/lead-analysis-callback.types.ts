export interface LeadAnalysisCallbackInput {
    lead_id: string;
    score: number;
    priority: string;
    summary: string;
    qualification_reason: string;
    outreach_email_subject: string;
    outreach_email_body: string;
    recommended_next_step: string;
}