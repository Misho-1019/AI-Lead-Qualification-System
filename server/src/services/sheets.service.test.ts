import { describe, it, expect } from 'vitest';
import { HEADERS, buildRow } from './sheets.service';

describe('buildRow', () => {
    it('maps a full lead + analysis to 17 columns', () => {
        const row = buildRow({
            created_at: new Date('2026-01-02T03:04:05.000Z'),
            full_name: 'Sarah Mitchell',
            email: 'sarah@lumina.io',
            company: 'Lumina SaaS',
            role: 'CTO',
            industry: 'SaaS',
            company_size: '150-200',
            budget_range: '$50k - 75k',
            source: 'LinkedIn',
            pain_point: 'Scaling',
            status: 'qualified',
            analysis: {
                score: 84,
                priority: 'high',
                summary: 'Strong intent.',
                recommended_next_step: 'Book a demo.',
                outreach_email_subject: 'Subject',
                outreach_email_body: 'Body',
            },
        });

        expect(row).toHaveLength(17);
        expect(row[0]).toBe('2026-01-02T03:04:05.000Z');
        expect(row[1]).toBe('Sarah Mitchell');
        expect(row[2]).toBe('sarah@lumina.io');
        expect(row[11]).toBe('84');
        expect(row[12]).toBe('high');
    });

    it('maps null/undefined optional fields to empty strings', () => {
        const row = buildRow({
            full_name: 'Jane',
            email: 'jane@x.com',
            company: null,
            role: undefined,
            status: 'new',
            analysis: null,
        });

        expect(row).toHaveLength(17);
        expect(row[3]).toBe('');
        expect(row[4]).toBe('');
        expect(row[11]).toBe('');
        expect(row[12]).toBe('');
    });

    it('formats a string created_at as-is', () => {
        const row = buildRow({ full_name: 'A', email: 'a@b.c', created_at: '2026-01-01' });
        expect(row[0]).toBe('2026-01-01');
    });

    it('exposes 17 headers', () => {
        expect(HEADERS).toHaveLength(17);
        expect(HEADERS[0]).toBe('Created At');
    });
});
