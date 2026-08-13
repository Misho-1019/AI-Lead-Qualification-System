import { CreateLeadInput } from "../types/lead.types";
import prisma from "../utils/prisma";
import { analyzeLeadWithAI } from "./ai-analysis.service";
import { saveLeadAnalysisFromCallback } from "./lead-analysis.service";
import { appendLeadToSheet, exportAllLeadsToSheet } from "./sheets.service";

type LeadForAnalysisInput = {
    id: string;
    full_name: string;
    email: string;
    company?: string | null;
    role?: string | null;
    website?: string | null;
    industry?: string | null;
    company_size?: string | null;
    budget_range?: string | null;
    source?: string | null;
    pain_point?: string | null;
    notes?: string | null;
};

const analyzeLeadAsync = (lead: LeadForAnalysisInput) => {
    analyzeLeadWithAI(lead)
        .then((analysis) =>
            saveLeadAnalysisFromCallback({
                lead_id: lead.id,
                ...analysis,
            })
        )
        .then((savedAnalysis) => {
            if (savedAnalysis) {
                appendLeadToSheet({ ...lead, analysis: savedAnalysis }).catch((error) => {
                    console.error('Failed to append lead to Google Sheets:', error);
                });
            }
        })
        .catch((error) => {
            console.error('Failed to run AI lead analysis:', error);
        });
};

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

    analyzeLeadAsync(newLead);

    return newLead;
}

export const getAllLeads = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            orderBy: {
                created_at: 'desc',
            },
            include: {
                analysis: true,
            },
            skip,
            take: limit,
        }),
        prisma.lead.count(),
    ])

    return { leads, total };
}

export const getLeadStats = async () => {
    const [total, analyzed, highPriority, averageScore] = await Promise.all([
        prisma.lead.count(),
        prisma.leadAnalysis.count(),
        prisma.leadAnalysis.count({ where: { priority: 'high' } }),
        prisma.leadAnalysis.aggregate({ _avg: { score: true } }),
    ]);

    return {
        total,
        analyzed,
        highPriority,
        averageScore: Math.round(averageScore._avg.score ?? 0),
    };
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

    analyzeLeadAsync(lead);

    return lead;
}

export const exportLeadsToSheet = async () => {
    const leads = await prisma.lead.findMany({
        orderBy: { created_at: 'desc' },
        include: { analysis: true },
    });

    return exportAllLeadsToSheet(leads);
}