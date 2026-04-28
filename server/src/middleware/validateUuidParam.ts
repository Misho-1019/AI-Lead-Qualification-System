import { Request, Response, NextFunction } from 'express';

export const validateUuidParam = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!id || !uuidRegex.test(id)) {
        return res.status(400).json({ message: 'Invalid lead id'})
    }

    next();
}