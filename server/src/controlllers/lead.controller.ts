import { Request, Response } from "express";
import { createLead, getAllLeads, getLeadById } from "../services/lead.service";
import { CreateLeadInput } from "../types/lead.types";

export const createLeadController = async (req: Request, res: Response) => {
    const leadData = req.body as CreateLeadInput;

    const newLead = await createLead(leadData);

    return res.status(201).json({
        message: 'Lead received',
        data: newLead,
    })
}

export const getAllLeadsController = async (_req: Request, res: Response) => {
    const leads = await getAllLeads();

    return res.status(200).json({
        message: 'Leads fetched successfully',
        data: leads,
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