import { describe, it, expect } from 'vitest';
import { padLine, getDeviceSpecLines } from './deviceSpecs.js';

describe('padLine', () => {
    it('formats a short label with dots to a 28-char left segment then space + value', () => {
        // 'CPU ' (4) + 24 dots = 28, then ' ' + value
        expect(padLine('CPU', '10 CORES')).toBe('CPU ........................ 10 CORES');
    });

    it('falls back to a single dot when label is longer than 26 chars', () => {
        const longLabel = 'A'.repeat(27);
        const result = padLine(longLabel, 'OK');
        expect(result).toBe(`${longLabel} . OK`);
    });
});

describe('getDeviceSpecLines', () => {
    it('returns an array of strings without throwing under happy-dom', () => {
        let lines;
        expect(() => {
            lines = getDeviceSpecLines();
        }).not.toThrow();
        expect(Array.isArray(lines)).toBe(true);
        expect(lines.length).toBeGreaterThan(0);
        lines.forEach((line) => {
            expect(typeof line).toBe('string');
            expect(line).toContain('....');
        });
    });
});
