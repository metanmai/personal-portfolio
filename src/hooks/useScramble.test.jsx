import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useScramble } from './useScramble.js';

afterEach(() => vi.restoreAllMocks());

describe('useScramble', () => {
    it('resolves to the exact final text', async () => {
        const { result } = renderHook(() => useScramble('HELLO WORLD', 100));
        await waitFor(() => expect(result.current).toBe('HELLO WORLD'));
    });

    it('renders the final text immediately when prefers-reduced-motion', () => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true });
        const { result } = renderHook(() => useScramble('FAST', 1000));
        expect(result.current).toBe('FAST');
    });

    it('preserves spaces while scrambling', () => {
        const text = 'HELLO WORLD';
        const { result } = renderHook(() => useScramble(text, 10000));
        expect(result.current.length).toBe(text.length);
        expect(result.current[5]).toBe(' ');
    });
});
