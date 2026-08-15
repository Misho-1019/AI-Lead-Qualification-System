import { Request, Response, NextFunction } from 'express';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateBulkIds = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'ids must be a non-empty array' });
    }

    if (!ids.every((id) => typeof id === 'string' && uuidRegex.test(id))) {
        return res.status(400).json({ message: 'ids must contain only valid lead ids' });
    }

    next();
};
