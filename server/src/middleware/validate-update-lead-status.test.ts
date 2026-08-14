import { describe, it, expect, vi } from 'vitest';
import { validateUpdateLeadStatus } from './validate-update-lead-status';

const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
});

describe('validateUpdateLeadStatus', () => {
    it.each(['new', 'contacted', 'qualified', 'rejected'])('accepts status %s', (status) => {
        const req = { body: { status } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateUpdateLeadStatus(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects an invalid status', () => {
        const req = { body: { status: 'archived' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateUpdateLeadStatus(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a missing/non-string status', () => {
        const req = { body: {} } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateUpdateLeadStatus(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
