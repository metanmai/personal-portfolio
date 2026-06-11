// Single source of truth for the `prefers-reduced-motion` check. Throw-proof,
// so it can be called from any effect or handler without guarding matchMedia.
export const reducedMotion = () => {
    try {
        return typeof window !== 'undefined'
            && typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
};
