import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

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

    if (!providedApiKey) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const expectedBuffer = Buffer.from(expectedApiKey);
    const providedBuffer = Buffer.from(providedApiKey);

    if (
        expectedBuffer.length !== providedBuffer.length ||
        !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
};
