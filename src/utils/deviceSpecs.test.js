import { describe, it, expect, vi } from 'vitest';
import {
    padLine,
    getDeviceSpecLines,
    getRegion,
    getBrowserName,
} from './deviceSpecs.js';

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

describe('getRegion', () => {
    it('returns an uppercase string without throwing', () => {
        let region;
        expect(() => {
            region = getRegion();
        }).not.toThrow();
        expect(typeof region).toBe('string');
        expect(region.length).toBeGreaterThan(0);
        expect(region).toBe(region.toUpperCase());
    });
});

describe('getBrowserName', () => {
    it('returns a non-empty string and uses the UA fallback when userAgentData is absent', () => {
        // happy-dom does not expose userAgentData. Spy on userAgent to a known
        // Firefox UA and assert the fallback chain selects FIREFOX.
        const spy = vi
            .spyOn(navigator, 'userAgent', 'get')
            .mockReturnValue(
                'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
            );
        let name;
        expect(() => {
            name = getBrowserName();
        }).not.toThrow();
        expect(typeof name).toBe('string');
        expect(name).toBe('FIREFOX');
        spy.mockRestore();
    });
});
