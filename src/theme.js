export const THEMES = {
    green:  { phosphor: '#41ff7e', dim: '#2aa85c', bg: '#061206', glow: 'rgba(65, 255, 126, 0.55)' },
    amber:  { phosphor: '#ffb000', dim: '#a07a1a', bg: '#160f01', glow: 'rgba(255, 176, 0, 0.55)' },
    ice:    { phosphor: '#4df3ff', dim: '#2a93a8', bg: '#021418', glow: 'rgba(77, 243, 255, 0.5)' },
    white:  { phosphor: '#e8e8e8', dim: '#9a9a9a', bg: '#0d0d0d', glow: 'rgba(232, 232, 232, 0.4)' },
    alert:  { phosphor: '#ff5252', dim: '#a83a3a', bg: '#1a0505', glow: 'rgba(255, 82, 82, 0.5)' },
};

export const THEME_ORDER = ['green', 'amber', 'ice', 'white', 'alert'];

export const DEFAULT_THEME = 'green';

export function applyTheme(name) {
    const theme = THEMES[name] ?? THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    root.style.setProperty('--phosphor', theme.phosphor);
    root.style.setProperty('--dim', theme.dim);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--glow', theme.glow);
    root.dataset.theme = THEMES[name] ? name : DEFAULT_THEME;
}
