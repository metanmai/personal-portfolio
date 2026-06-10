import { describe, it, expect } from 'vitest';
import { THEMES, DEFAULT_THEME, applyTheme } from './theme.js';

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
});
