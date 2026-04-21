import { Request, Response } from "express";
import { createLead, getAllLeads } from "../services/lead.service";
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