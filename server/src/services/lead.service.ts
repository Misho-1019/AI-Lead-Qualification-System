import { CreateLeadInput, Lead } from "../types/lead.types";
import prisma from "../utils/prisma";
import { triggerLeadAnalysisWorkflow } from "./n8n.service";

export const createLead = async (leadData: CreateLeadInput) => {
    const newLead = await prisma.lead.create({
        data: {
            full_name: leadData.full_name,
            email: leadData.email,
            company: leadData.company,
            role: leadData.role,
            website: leadData.website,
            industry: leadData.industry,
            company_size: leadData.company_size,
            budget_range: leadData.budget_range,
            source: leadData.source,
            pain_point: leadData.pain_point,
            notes: leadData.notes,
        }
    })

    await triggerLeadAnalysisWorkflow(newLead)

    return newLead;
}

export const getAllLeads = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const leads = await prisma.lead.findMany({
        orderBy: {
            created_at: 'desc',
        },
        skip,
        take: limit,
    })

    return leads;
}

export const getLeadById = async (id: string) => {
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: {
            analysis: true,
        }
    })

    return lead;
}

export const updateLeadStatus = async (id: string, status: string) => {
    const existingLead = await prisma.lead.findUnique({
        where: { id },
    })

    if (!existingLead) {
        return null;
    }

    const updatedLead = await prisma.lead.update({
        where: { id },
        data: { status },
    })

    return updatedLead;
}

export const reanalyzeLead = async (id: string) => {
    const lead = await prisma.lead.findUnique({
        where: { id },
    })

    if (!lead) return null;

    await triggerLeadAnalysisWorkflow(lead);

    return lead;
}