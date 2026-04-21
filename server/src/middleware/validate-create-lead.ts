import { Request, Response, NextFunction } from "express";

export const validateCreateLead = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { full_name, email } = req.body;

    if (!full_name || typeof full_name !== 'string' || !full_name.trim()) {
        return res.status(400).json({ message: 'full_name is required and must be a non-empty string' })
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ message: 'email is required and must be a non-empty string' })
    }

    next();
}