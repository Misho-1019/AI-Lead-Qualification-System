import { Request, Response, NextFunction } from "express";

const allowedStatuses = ['new', 'contacted', 'qualified', 'rejected'];

export const validateUpdateLeadStatus = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { status } = req.body;

    if (!status || typeof status !== 'string') {
        return res.status(400).json({
            message: 'Status is required and must be a string',
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Allowed values are: ${allowedStatuses.join(', ')}`,
        });
    }

    next();
}