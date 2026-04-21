import { Request, Response } from "express";
import { createLead } from "../services/lead.service";

export const createLeadController = (req: Request, res: Response) => {
    const leadData = req.body;

    const newLead = createLead(leadData);

    return res.status(201).json({
        message: 'Lead received',
        data: newLead,
    })
}