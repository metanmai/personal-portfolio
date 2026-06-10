import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTypewriter } from './useTypewriter.js';

afterEach(() => vi.restoreAllMocks());

describe('useTypewriter', () => {
    it('types text progressively and reports done', async () => {
        const { result } = renderHook(() => useTypewriter('ABCDE', 1000));
        await waitFor(() => expect(result.current.done).toBe(true));
        expect(result.current.output).toBe('ABCDE');
    });

    it('skip() reveals the full text immediately', () => {
        const { result } = renderHook(() => useTypewriter('LONG TEXT HERE', 1));
        expect(result.current.done).toBe(false);
        act(() => result.current.skip());
        expect(result.current.output).toBe('LONG TEXT HERE');
        expect(result.current.done).toBe(true);
    });

    it('renders instantly when prefers-reduced-motion', () => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true });
        const { result } = renderHook(() => useTypewriter('FAST', 1));
        expect(result.current.output).toBe('FAST');
    });
});
