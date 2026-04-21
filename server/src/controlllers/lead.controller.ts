import { Request, Response } from "express";
import { createLead } from "../services/lead.service";
import { CreateLeadInput } from "../types/lead.types";

export const createLeadController = (req: Request, res: Response) => {
    const leadData = req.body as CreateLeadInput;

    const newLead = createLead(leadData);

    return res.status(201).json({
        message: 'Lead received',
        data: newLead,
    })
}