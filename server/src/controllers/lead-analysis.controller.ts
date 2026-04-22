import { Request, Response } from "express";
import { CreateLeadAnalysisInput } from "../types/lead-analysis.types";
import { createLeadAnalysis } from "../services/lead-analysis.service";

export const createLeadAnalysisController = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const analysisData = req.body as CreateLeadAnalysisInput;

    const newAnalysis = await createLeadAnalysis(id, analysisData)

    if (!newAnalysis) {
        return res.status(404).json({ message: 'Lead not found' })
    }

    return res.status(201).json({ message: 'Lead analysis created successfully', data: newAnalysis })
}