import { describe, it, expect, vi } from 'vitest';
import { validateCreateLead } from './validate-create-lead';

const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
});

describe('validateCreateLead', () => {
    it('calls next for valid input', () => {
        const req = { body: { full_name: 'John Doe', email: 'john@example.com' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateCreateLead(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects a missing full_name', () => {
        const req = { body: { email: 'john@example.com' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateCreateLead(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects an empty/whitespace full_name', () => {
        const req = { body: { full_name: '   ', email: 'john@example.com' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateCreateLead(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects an invalid email format', () => {
        const req = { body: { full_name: 'John', email: 'not-an-email' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateCreateLead(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a missing email', () => {
        const req = { body: { full_name: 'John' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateCreateLead(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
