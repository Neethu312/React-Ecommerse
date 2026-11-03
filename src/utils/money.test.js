import { it, expect, describe } from 'vitest';
import { formatMoney } from './money';

describe('formatMoney', () => {
    it('formats 1999 cents as 19.99', () => {
        expect(formatMoney(1999)).toBe('19.99');
    });

    it('works with 0', () => {
        expect(formatMoney(0)).toBe('0.00');
    });

    it('rounds up to the nearest cent', () => {
        expect(formatMoney(2000.5)).toBe('20.01');
    });

    it('rounds down to the nearest cent', () => {
        expect(formatMoney(2000.4)).toBe('20.00');
    });
});

