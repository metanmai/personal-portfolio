import { describe, it, expect, vi, afterEach } from 'vitest';
import { generatePuzzle } from './loginPuzzle.js';

afterEach(() => {
    vi.restoreAllMocks();
});

// Helper: feed Math.random a queue of values, one per call. Any extra calls
// just keep returning the LAST value (so the puzzle generator never gets NaN).
const stubRandom = (...values) => {
    const queue = [...values];
    let last = queue[queue.length - 1] ?? 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
        if (queue.length === 0) return last;
        last = queue.shift();
        return last;
    });
};

describe('generatePuzzle - arithmetic family', () => {
    it('produces an addition prompt with the correct string answer', () => {
        // 1st random: family pick. Arithmetic must land below the binary cutoff
        // and above the sequence range — 0.0 is safely in the arithmetic band.
        // Then op pick (0 = +), then A and B.
        stubRandom(
            0.0,    // family: arithmetic
            0.0,    // op: + (first of three)
            0.5,    // A
            0.2,    // B
        );
        const { prompt, answer } = generatePuzzle();
        expect(prompt).toMatch(/^SOLVE: \d+ \+ \d+$/);
        const [a, b] = prompt.match(/\d+/g).map(Number);
        expect(answer).toBe(String(a + b));
        expect(prompt).toBe(prompt.toUpperCase());
    });

    it('produces a subtraction prompt with A >= B (never negative)', () => {
        stubRandom(
            0.0,    // family: arithmetic
            0.4,    // op: - (middle of three)
            0.9,    // A (large)
            0.1,    // B (small)
        );
        const { prompt, answer } = generatePuzzle();
        expect(prompt).toMatch(/^SOLVE: \d+ [−-] \d+$/);
        const nums = prompt.match(/\d+/g).map(Number);
        expect(nums[0]).toBeGreaterThanOrEqual(nums[1]);
        expect(Number(answer)).toBeGreaterThanOrEqual(0);
        expect(answer).toBe(String(nums[0] - nums[1]));
    });

    it('produces a multiplication prompt within 2-9 with correct product', () => {
        stubRandom(
            0.0,    // family: arithmetic
            0.9,    // op: × (last of three)
            0.5,    // A
            0.5,    // B
        );
        const { prompt, answer } = generatePuzzle();
        expect(prompt).toMatch(/^SOLVE: \d+ [×x*] \d+$/);
        const [a, b] = prompt.match(/\d+/g).map(Number);
        expect(a).toBeGreaterThanOrEqual(2);
        expect(a).toBeLessThanOrEqual(9);
        expect(b).toBeGreaterThanOrEqual(2);
        expect(b).toBeLessThanOrEqual(9);
        expect(answer).toBe(String(a * b));
    });
});

describe('generatePuzzle - sequence family', () => {
    it('produces an arithmetic sequence with the next term as answer', () => {
        // Family pick in sequence band (mid range), then sub-type (arithmetic),
        // then start and step.
        stubRandom(
            0.45,   // family: sequence
            0.0,    // sub-type: arithmetic step
            0.2,    // start
            0.3,    // step
        );
        const { prompt, answer } = generatePuzzle();
        expect(prompt).toMatch(/^NEXT IN SEQUENCE: \d+, \d+, \d+, \d+, \?$/);
        const nums = prompt.match(/\d+/g).map(Number);
        const step = nums[1] - nums[0];
        expect(nums[2] - nums[1]).toBe(step);
        expect(nums[3] - nums[2]).toBe(step);
        expect(answer).toBe(String(nums[3] + step));
    });

    it('produces a doubling sequence whose next term is the previous doubled', () => {
        stubRandom(
            0.45,   // family: sequence
            0.9,    // sub-type: doubling
            0.0,    // start picker -> 2
        );
        const { prompt, answer } = generatePuzzle();
        expect(prompt).toMatch(/^NEXT IN SEQUENCE: \d+, \d+, \d+, \d+, \?$/);
        const nums = prompt.match(/\d+/g).map(Number);
        expect(nums[1]).toBe(nums[0] * 2);
        expect(nums[2]).toBe(nums[1] * 2);
        expect(nums[3]).toBe(nums[2] * 2);
        expect(answer).toBe(String(nums[3] * 2));
    });
});

describe('generatePuzzle - binary family', () => {
    it('produces a binary prompt and the correct decimal answer', () => {
        // Binary band is the top ~20%. 0.95 lands solidly there.
        stubRandom(
            0.95,   // family: binary
            0.5,    // bit width selector
            // Several bits — 0.6 etc all push to 1
            0.6, 0.6, 0.6, 0.6,
        );
        const { prompt, answer } = generatePuzzle();
        expect(prompt).toMatch(/^BINARY [01]{3,4} IN DECIMAL = \?$/);
        const bits = prompt.match(/[01]{3,4}/)[0];
        expect(answer).toBe(String(parseInt(bits, 2)));
    });
});

describe('generatePuzzle - fuzz / shape', () => {
    it('returns a well-shaped puzzle across 50 unseeded calls', () => {
        for (let i = 0; i < 50; i += 1) {
            const { prompt, answer } = generatePuzzle();
            expect(typeof prompt).toBe('string');
            expect(prompt.length).toBeGreaterThan(0);
            expect(prompt).toBe(prompt.toUpperCase());
            expect(typeof answer).toBe('string');
            expect(answer).toMatch(/^\d+$/);
        }
    });
});
