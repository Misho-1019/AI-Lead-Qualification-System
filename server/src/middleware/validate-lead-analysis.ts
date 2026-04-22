import { NextFunction, Request, Response } from "express";

export const validateLeadAnalysis = (req: Request, res: Response, next: NextFunction) => {
    const { score, priority, summary, qualification_reason, outreach_email_subject, outreach_email_body, recommend_next_step } = req.body;

    if (typeof score !== 'number' || score < 0 || score > 100) {
        return res.status(400).json({ message: 'score must be a number between 0 and 100' })
    }

    if (!priority || typeof priority !== 'string' || !priority.trim()) {
        return res.status(400).json({ message: 'priority is required and must be a non-empty string' })
    }

    if (!summary || typeof summary !== 'string' || !summary.trim()) {
        return res.status(400).json({ message: 'summary is required and must be a non-empty string' })
    }

    if (!qualification_reason || typeof qualification_reason !== 'string' || !qualification_reason.trim()) {
        return res.status(400).json({ message: 'qualification_reason is required and must be a non-empty string' })
    }

    if (!outreach_email_subject || typeof outreach_email_subject !== 'string' || !outreach_email_subject.trim()) {
        return res.status(400).json({ message: 'outreach_email_subject is required and must be a non-empty string' })
    }

    if (!outreach_email_body || typeof outreach_email_body !== 'string' || !outreach_email_body.trim()) {
        return res.status(400).json({ message: 'outreach_email_body is required and must be a non-empty string' })
    }

    if (!recommend_next_step || typeof recommend_next_step !== 'string' || !recommend_next_step.trim()) {
        return res.status(400).json({ message: 'recommended_next_step is required and must be a non-empty string' })
    }

    next();
}