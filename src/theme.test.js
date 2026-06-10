import { describe, it, expect } from 'vitest';
import { THEMES, THEME_ORDER, DEFAULT_THEME, applyTheme } from './theme.js';

describe('applyTheme', () => {
    it('sets CSS custom properties for the amber theme', () => {
        applyTheme('amber');
        const root = document.documentElement;
        expect(root.style.getPropertyValue('--phosphor')).toBe(THEMES.amber.phosphor);
        expect(root.style.getPropertyValue('--dim')).toBe(THEMES.amber.dim);
        expect(root.style.getPropertyValue('--bg')).toBe(THEMES.amber.bg);
        expect(root.style.getPropertyValue('--glow')).toBe(THEMES.amber.glow);
        expect(root.dataset.theme).toBe('amber');
    });

    it('falls back to the default theme for unknown names', () => {
        applyTheme('plasma');
        expect(document.documentElement.style.getPropertyValue('--phosphor'))
            .toBe(THEMES[DEFAULT_THEME].phosphor);
    });

    it('defaults to green', () => {
        expect(DEFAULT_THEME).toBe('green');
    });

    it('THEME_ORDER entries all exist in THEMES', () => {
        expect(THEME_ORDER.length).toBeGreaterThan(0);
        THEME_ORDER.forEach((name) => {
            expect(THEMES[name]).toBeDefined();
        });
    });
});
