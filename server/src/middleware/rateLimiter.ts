import { rateLimit } from 'express-rate-limit';

export const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});

export const internalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests, please try again later.' },
});
