import { describe, it, expect, vi } from 'vitest';
import { validateLeadAnalysis } from './validate-lead-analysis';

const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
});

const validBody = {
    score: 84,
    priority: 'high',
    summary: 'Strong intent.',
    qualification_reason: 'Matches ICP.',
    outreach_email_subject: 'Subject',
    outreach_email_body: 'Body',
    recommended_next_step: 'Book a demo.',
};

describe('validateLeadAnalysis', () => {
    it('accepts a valid body', () => {
        const req = { body: validBody } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysis(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects a score out of range', () => {
        const req = { body: { ...validBody, score: 150 } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysis(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a missing required field', () => {
        const { summary, ...rest } = validBody;
        const req = { body: rest } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateLeadAnalysis(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
