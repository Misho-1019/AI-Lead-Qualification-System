import { Request, Response, NextFunction } from 'express';

export const verifyInternalApiKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const expectedApiKey = process.env.INTERNAL_API_KEY;
    const providedApiKey = req.header('x-internal-api-key');

    if (!expectedApiKey) {
        console.error('INTERNAL_API_KEY is not set');
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!providedApiKey || providedApiKey !== expectedApiKey) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
};