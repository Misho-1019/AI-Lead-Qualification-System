import { Request, Response, NextFunction } from 'express';

export const validateLeadAnalysisCallback = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const {
        lead_id,
        score,
        priority,
        summary,
        qualification_reason,
        outreach_email_subject,
        outreach_email_body,
        recommended_next_step,
    } = req.body;

    if (
        typeof lead_id !== 'string' ||
        typeof score !== 'number' ||
        typeof priority !== 'string' ||
        typeof summary !== 'string' ||
        typeof qualification_reason !== 'string' ||
        typeof outreach_email_subject !== 'string' ||
        typeof outreach_email_body !== 'string' ||
        typeof recommended_next_step !== 'string'
    ) {
        return res.status(400).json({
            message: 'Invalid callback payload',
        });
    }

    next();
};