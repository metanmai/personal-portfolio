export const THEMES = {
    amber: {
        phosphor: '#ffb000',
        dim: '#8a6200',
        bg: '#160f01',
        glow: 'rgba(255, 176, 0, 0.55)',
    },
    green: {
        phosphor: '#41ff7e',
        dim: '#1d8a44',
        bg: '#061206',
        glow: 'rgba(65, 255, 126, 0.55)',
    },
};

export const DEFAULT_THEME = 'amber';

export function applyTheme(name) {
    const theme = THEMES[name] ?? THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    root.style.setProperty('--phosphor', theme.phosphor);
    root.style.setProperty('--dim', theme.dim);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--glow', theme.glow);
    root.dataset.theme = THEMES[name] ? name : DEFAULT_THEME;
}
