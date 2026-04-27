import { LeadAnalysisCallbackInput } from "../types/lead-analysis-callback.types";
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

export const updateLeadAnalysis = async (
    leadId: string,
    analysisData: CreateLeadAnalysisInput
) => {
    const existingAnalysis = await prisma.leadAnalysis.findUnique({
        where: { lead_id: leadId },
    })

    if (!existingAnalysis) return null;

    const updatedAnalysis = await prisma.leadAnalysis.update({
        where: { lead_id: leadId },
        data: {
            score: analysisData.score,
            priority: analysisData.priority,
            summary: analysisData.summary,
            qualification_reason: analysisData.qualification_reason,
            outreach_email_subject: analysisData.outreach_email_subject,
            outreach_email_body: analysisData.outreach_email_body,
            recommended_next_step: analysisData.recommended_next_step,
        }
    })

    return updatedAnalysis;
}

export const saveLeadAnalysisFromCallback = async ( callbackData: LeadAnalysisCallbackInput ) => {
    const existingLead = await prisma.lead.findUnique({
        where: { id: callbackData.lead_id }
    })

    if (!existingLead) return null;

    const analysis = await prisma.leadAnalysis.upsert({
        where: { lead_id: callbackData.lead_id },
        update: {
            score: callbackData.score,
            priority: callbackData.priority,
            summary: callbackData.summary,
            qualification_reason: callbackData.qualification_reason,
            outreach_email_subject: callbackData.outreach_email_subject,
            outreach_email_body: callbackData.outreach_email_body,
            recommended_next_step: callbackData.recommended_next_step,
        },
        create: {
            lead_id: callbackData.lead_id,
            score: callbackData.score,
            priority: callbackData.priority,
            summary: callbackData.summary,
            qualification_reason: callbackData.qualification_reason,
            outreach_email_subject: callbackData.outreach_email_subject,
            outreach_email_body: callbackData.outreach_email_body,
            recommended_next_step: callbackData.recommended_next_step
        }
    })

    return analysis;
}