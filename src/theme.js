export const THEMES = {
    green:  { phosphor: '#41ff7e', dim: '#2aa85c', bg: '#061206', glow: 'rgba(65, 255, 126, 0.55)' },
    amber:  { phosphor: '#ffb000', dim: '#a07a1a', bg: '#160f01', glow: 'rgba(255, 176, 0, 0.55)' },
    ice:    { phosphor: '#4df3ff', dim: '#2a93a8', bg: '#021418', glow: 'rgba(77, 243, 255, 0.5)' },
    white:  { phosphor: '#e8e8e8', dim: '#9a9a9a', bg: '#0d0d0d', glow: 'rgba(232, 232, 232, 0.4)' },
    alert:  { phosphor: '#ff5252', dim: '#a83a3a', bg: '#1a0505', glow: 'rgba(255, 82, 82, 0.5)' },
};

export const THEME_ORDER = ['green', 'amber', 'ice', 'white', 'alert'];

export const DEFAULT_THEME = 'green';

// Retro pixel cursors, tinted per theme. shape-rendering="crispEdges" turns
// off anti-aliasing so edges rasterize as hard pixel steps; the black
// understroke keeps the cursor visible on phosphor-filled (hovered) surfaces.
const arrowCursorSvg = (fill) => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" shape-rendering="crispEdges">'
    + `<path d="M2 1 L2 19 L7 14.6 L10 21.4 L13.4 19.8 L10.6 13 L17 13 Z" fill="${fill}" stroke="#000" stroke-width="2"/>`
    + '</svg>';

// Pointing-glove pixel art ('.' empty, 'X' black outline, '#' phosphor fill),
// drawn at 2px per cell. Hotspot sits on the index fingertip.
const GLOVE_GRID = [
    '....XX......',
    '...X##X.....',
    '...X##X.....',
    '...X##X.....',
    '...X##XXX...',
    '...X##X##XX.',
    '...X##X##X#X',
    'XX.X##X##X#X',
    'X#XX#######X',
    'X##X#######X',
    '.X#########X',
    '.X#########X',
    '..X########X',
    '...X######X.',
    '....XXXXXX..',
];

const gloveCursorSvg = (fill) => {
    const px = 2;
    let rects = '';
    GLOVE_GRID.forEach((row, y) => {
        // merge horizontal runs of the same cell into single rects
        let x = 0;
        while (x < row.length) {
            const c = row[x];
            if (c === '.') {
                x += 1;
                continue;
            }
            let end = x;
            while (end + 1 < row.length && row[end + 1] === c) end += 1;
            const color = c === 'X' ? '#000' : fill;
            rects += `<rect x="${x * px}" y="${y * px}" width="${(end - x + 1) * px}" height="${px}" fill="${color}"/>`;
            x = end + 1;
        }
    });
    const w = GLOVE_GRID[0].length * px;
    const h = GLOVE_GRID.length * px;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${rects}</svg>`;
};

const cursorValue = (svg, x, y, fallback) => `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, ${fallback}`;

export function applyTheme(name) {
    const theme = THEMES[name] ?? THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    root.style.setProperty('--phosphor', theme.phosphor);
    root.style.setProperty('--dim', theme.dim);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--glow', theme.glow);
    root.style.setProperty('--cursor-default', cursorValue(arrowCursorSvg(theme.phosphor), 2, 1, 'default'));
    root.style.setProperty('--cursor-pointer', cursorValue(gloveCursorSvg(theme.phosphor), 9, 0, 'pointer'));
    root.dataset.theme = THEMES[name] ? name : DEFAULT_THEME;
}
