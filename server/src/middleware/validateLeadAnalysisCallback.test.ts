import { describe, it, expect, vi } from 'vitest';
import { validateLeadAnalysisCallback } from './validateLeadAnalysisCallback';

const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
});

const validBody = {
    lead_id: '11111111-1111-4111-8111-111111111111',
    score: 78,
    priority: 'high',
    summary: 'Summary.',
    qualification_reason: 'Reason.',
    outreach_email_subject: 'Subject',
    outreach_email_body: 'Body',
    recommended_next_step: 'Next step.',
};

describe('validateLeadAnalysisCallback', () => {
    it('accepts a valid body', () => {
        const req = { body: validBody } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysisCallback(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects a wrong type (score as string)', () => {
        const req = { body: { ...validBody, score: '78' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysisCallback(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a score out of range', () => {
        const req = { body: { ...validBody, score: 120 } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysisCallback(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a missing lead_id', () => {
        const { lead_id, ...rest } = validBody;
        const req = { body: rest } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysisCallback(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
