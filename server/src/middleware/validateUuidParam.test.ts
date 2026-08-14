import { describe, it, expect, vi } from 'vitest';
import { validateUuidParam } from './validateUuidParam';

const makeRes = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
});

const VALID_UUID = '11111111-1111-4111-8111-111111111111';

describe('validateUuidParam', () => {
    it('accepts a valid UUID v4', () => {
        const req = { params: { id: VALID_UUID } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateUuidParam(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('rejects a non-UUID string', () => {
        const req = { params: { id: 'abc' } } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateUuidParam(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a missing id', () => {
        const req = { params: {} } as any;
        const res = makeRes() as any;
        const next = vi.fn();

        validateUuidParam(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });
});
