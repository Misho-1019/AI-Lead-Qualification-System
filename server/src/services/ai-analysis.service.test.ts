import { describe, it, expect } from 'vitest';
import { validateAnalysisPayload } from './ai-analysis.service';

const valid = {
    score: 84,
    priority: 'high',
    summary: 'Strong intent detected.',
    qualification_reason: 'Matches ICP.',
    outreach_email_subject: 'Subject line',
    outreach_email_body: 'Hi there,\n\nBody text.',
    recommended_next_step: 'Book a demo.',
};

describe('validateAnalysisPayload', () => {
    it('accepts a valid payload', () => {
        expect(validateAnalysisPayload(valid)).toEqual(valid);
    });

    it('rejects a score below 0', () => {
        expect(() => validateAnalysisPayload({ ...valid, score: -1 })).toThrow();
    });

    it('rejects a score above 100', () => {
        expect(() => validateAnalysisPayload({ ...valid, score: 101 })).toThrow();
    });

    it('rejects a non-number score', () => {
        expect(() => validateAnalysisPayload({ ...valid, score: '84' })).toThrow();
    });

    it('rejects a missing field', () => {
        const { summary, ...rest } = valid;
        expect(() => validateAnalysisPayload(rest)).toThrow();
    });

    it('rejects an empty string field', () => {
        expect(() => validateAnalysisPayload({ ...valid, summary: '   ' })).toThrow();
    });

    it('rejects non-object input', () => {
        expect(() => validateAnalysisPayload(null)).toThrow();
        expect(() => validateAnalysisPayload('nope')).toThrow();
    });
});
