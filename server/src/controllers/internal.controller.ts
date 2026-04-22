import { Request, Response } from "express";
import { LeadAnalysisCallbackInput } from "../types/lead-analysis-callback.types";
import { saveLeadAnalysisFromCallback } from "../services/lead-analysis.service";

export const leadAnalysisCallbackController = async (req: Request, res: Response) => {
    const callbackData = req.body as LeadAnalysisCallbackInput;

    const savedAnalysis = await saveLeadAnalysisFromCallback(callbackData);

    if (!savedAnalysis) {
        return res.status(404).json({ message: 'Lead not found' })
    }

    return res.status(200).json({
        message: 'Lead analysis saved successfully',
        data: savedAnalysis
    });
}