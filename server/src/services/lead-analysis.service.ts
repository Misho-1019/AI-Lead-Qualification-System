import { CreateLeadAnalysisInput } from "../types/lead-analysis.types";
import prisma from "../utils/prisma";

export const createLeadAnalysis = async (
    leadId: string,
    analysisData: CreateLeadAnalysisInput
) => {
    const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
    })

    if (!existingLead) return null;

    const newAnalysis = await prisma.leadAnalysis.create({
        data: {
            lead_id: leadId,
            score: analysisData.score,
            priority: analysisData.priority,
            summary: analysisData.summary,
            qualification_reason: analysisData.qualification_reason,
            outreach_email_subject: analysisData.outreach_email_subject,
            outreach_email_body: analysisData.outreach_email_body,
            recommended_next_step: analysisData.recommended_next_step
        }
    })

    return newAnalysis;
}