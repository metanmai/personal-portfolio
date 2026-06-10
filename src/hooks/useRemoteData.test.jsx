import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRemoteData } from './useRemoteData.js';

afterEach(() => vi.unstubAllGlobals());

describe('useRemoteData', () => {
    it('returns ready with parsed JSON on success', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ hello: 'world' })
        })));

        const { result } = renderHook(() => useRemoteData('/foo'));

        expect(result.current.status).toBe('loading');
        await waitFor(() => expect(result.current.status).toBe('ready'));
        expect(result.current.data).toEqual({ hello: 'world' });
    });

    it('marks failed on non-ok responses', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: false,
            json: () => Promise.resolve({})
        })));

        const { result } = renderHook(() => useRemoteData('/bad'));

        await waitFor(() => expect(result.current.status).toBe('failed'));
        expect(result.current.data).toBe(null);
    });

    it('marks failed when fetch throws', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('boom'))));

        const { result } = renderHook(() => useRemoteData('/explode'));

        await waitFor(() => expect(result.current.status).toBe('failed'));
        expect(result.current.data).toBe(null);
    });

    it('does not update state after unmount (abort cleanup)', async () => {
        let resolveFetch;
        vi.stubGlobal('fetch', vi.fn((_url, { signal } = {}) => new Promise((resolve, reject) => {
            resolveFetch = resolve;
            if (signal) {
                signal.addEventListener('abort', () => {
                    reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
                });
            }
        })));

        const { result, unmount } = renderHook(() => useRemoteData('/slow'));
        expect(result.current.status).toBe('loading');
        unmount();

        // Resolve after unmount — should not throw or warn.
        resolveFetch && resolveFetch({ ok: true, json: () => Promise.resolve({ late: true }) });
        await new Promise((r) => setTimeout(r, 5));
        expect(result.current.status).toBe('loading');
    });
});
