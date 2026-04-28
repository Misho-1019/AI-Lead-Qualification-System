import { Request, Response, NextFunction } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' })
    }

    next();
}