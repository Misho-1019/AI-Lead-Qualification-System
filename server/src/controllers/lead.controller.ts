import { Request, Response } from "express";
import { createLead, getAllLeads, getLeadById, reanalyzeLead, updateLeadStatus } from "../services/lead.service";
import { CreateLeadInput, UpdateLeadStatusInput } from "../types/lead.types";

export const createLeadController = async (req: Request, res: Response) => {
    const leadData = req.body as CreateLeadInput;

    const newLead = await createLead(leadData);

    return res.status(201).json({
        message: 'Lead received',
        data: newLead,
    })
}

export const getAllLeadsController = async (req: Request, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

    const leads = await getAllLeads(page, limit);

    return res.status(200).json({
        message: 'Leads fetched successfully',
        data: leads,
        page,
        limit
    })
}

export const getLeadByIdController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const lead = await getLeadById(id);

    if (!lead) {
        return res.status(404).json({
            message: 'Lead not found',
        })
    }

    return res.status(200).json({
        message: 'Lead fetched successfully',
        data: lead,
    })
}

export const updateLeadStatusController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { status } = req.body as UpdateLeadStatusInput;

    const updatedLead = await updateLeadStatus(id, status);

    if (!updatedLead) {
        return res.status(404).json({
            message: 'Lead not found',
        })
    }

    return res.status(200).json({
        message: 'Lead status updated successfully',
        data: updatedLead,
    })
}

export const reanalyzeLeadController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    const lead = await reanalyzeLead(id);

    if (!lead) {
        return res.status(404).json({
            message: 'Lead not found'
        });
    }

    return res.status(200).json({ message: 'Lead reanalysis triggered successfully' })
}