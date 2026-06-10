import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

// Rotating ASCII Earth — pure DOM, no canvas/webgl.
// Hand-crafted equirectangular land/sea bitmap (72 cols × 36 rows),
// orthographic projection of the visible hemisphere with limb darkening.

const COLS = 44;
const ROWS = 20;
const CX = (COLS - 1) / 2;
const CY = (ROWS - 1) / 2;
// Terminal cells are roughly twice as tall as they are wide → x scaled 2x.
const RX = (COLS - 2) / 2;
const RY = (ROWS - 2) / 2;

const DEG = Math.PI / 180;

// Equirectangular world map. '#' = land, '.' = sea.
// 72 columns (5° per col, lon -180..175), 36 rows (5° per row, lat 90..-85).
// Hand-tuned so the rough continental silhouettes (Americas, Eurasia,
// Africa, Australia, Antarctica) read correctly when sampled.
const WORLD = [
    '........................................................................',
    '........................................................................',
    '.....................############.......................................',
    '..........#######################.............#########################.',
    '....#############################......####.############################',
    '...##############.....####...........###################################',
    '...##############.....####...........##################################.',
    '...##############.....####........####################################..',
    '..........################........################################......',
    '...........##############.........########...#..#################.......',
    '...........############...........#..........#..##################......',
    '............##########............#.........######################......',
    '.............####.................#########......################.......',
    '..............###................##########......#############..........',
    '...............##...............###########...######....##..............',
    '................###..............##########...######....##..............',
    '.................................#############.....#....##..............',
    '....................##............############.........###..............',
    '....................#######..........#########.........##########.......',
    '....................##########........#######...........#########.......',
    '....................##########........#######............########.......',
    '.....................#########.........########..............#####......',
    '......................#######..........########............########.....',
    '......................######...........#####.##............########.....',
    '......................#####............####................########.....',
    '......................####..............###................########.....',
    '.....................####.......................................###.....',
    '.....................###................................................',
    '.....................##.................................................',
    '.....................###................................................',
    '........................................................................',
    '........................................................................',
    '########################################################################',
    '########################################################################',
    '########################################################################',
    '########################################################################',
];

const MAP_W = WORLD[0].length;
const MAP_H = WORLD.length;

// Sample the bitmap at (lon, lat) in degrees. Wraps longitude, clamps lat.
const sampleLand = (lon, lat) => {
    let lo = lon;
    while (lo < -180) lo += 360;
    while (lo >= 180) lo -= 360;
    const u = (lo + 180) / 360;
    const v = (90 - lat) / 180;
    let mx = Math.floor(u * MAP_W);
    let my = Math.floor(v * MAP_H);
    if (mx < 0) mx = 0;
    if (mx >= MAP_W) mx = MAP_W - 1;
    if (my < 0) my = 0;
    if (my >= MAP_H) my = MAP_H - 1;
    return WORLD[my].charCodeAt(mx) === 35; // '#'
};

// Limb ramp by depth (z near 1 = bright, z near 0 = dim edge).
const LAND_RAMP = ' .:=+*#%@';
const SEA_RAMP = '  ...::·:';
const landChar = (z) => {
    // Use sqrt(z) so the bright zone is a bit larger than linear z.
    const t = Math.sqrt(Math.max(0, Math.min(1, z)));
    const idx = Math.min(LAND_RAMP.length - 1, Math.floor(t * LAND_RAMP.length));
    return LAND_RAMP[idx];
};
const seaChar = (z) => {
    const t = Math.sqrt(Math.max(0, Math.min(1, z)));
    const idx = Math.min(SEA_RAMP.length - 1, Math.floor(t * SEA_RAMP.length));
    return SEA_RAMP[idx];
};

const reducedMotion = () => {
    try {
        return typeof window !== 'undefined'
            && window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
};

// Per-cell static geometry: nx, ny, nz on the unit sphere (rotation-independent
// in latitude and view-Y), plus a base-longitude offset for the unrotated cell.
// Only lon shifts with rotation each tick, so we precompute everything else.
const buildCells = () => {
    const cells = [];
    for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
            const nx = (col - CX) / RX;
            const ny = (row - CY) / RY;
            const r2 = nx * nx + ny * ny;
            if (r2 > 1) {
                cells.push(null);
                continue;
            }
            const nz = Math.sqrt(1 - r2);
            // Inverse orthographic: surface point (nx, ny, nz) on unit sphere.
            // lat = asin(-ny)  (ny positive = south because row grows downward)
            const lat = Math.asin(-ny) / DEG;
            // base lon: atan2(nx, nz)  — rotation will be added later.
            const baseLon = Math.atan2(nx, nz) / DEG;
            cells.push({ z: nz, lat, baseLon, edge: r2 > 0.93 });
        }
    }
    return cells;
};

const buildFrame = (rotDeg, cells) => {
    const out = new Array(ROWS);
    for (let row = 0; row < ROWS; row += 1) {
        const line = new Array(COLS);
        for (let col = 0; col < COLS; col += 1) {
            const cell = cells[row * COLS + col];
            if (!cell) {
                line[col] = ' ';
                continue;
            }
            const lon = cell.baseLon + rotDeg;
            const land = sampleLand(lon, cell.lat);
            let ch;
            if (land) {
                ch = landChar(cell.z);
            } else {
                ch = seaChar(cell.z);
            }
            // Crisp silhouette: ensure the disc edge always has at least a dot
            // so the sphere outline stays visible even over ocean.
            if (cell.edge && ch === ' ') {
                ch = '.';
            }
            line[col] = ch;
        }
        out[row] = line.join('');
    }
    return out.join('\n');
};

const Pre = styled.pre`
    margin: 0;
    color: var(--phosphor);
    text-shadow: 0 0 7px var(--glow);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: clamp(8px, 1.4vmin, 13px);
    line-height: 1.05;
    white-space: pre;
    user-select: none;
`;

const AsciiGlobe = () => {
    const cells = useMemo(buildCells, []);
    const [rot, setRot] = useState(0);

    useEffect(() => {
        if (reducedMotion()) return undefined;
        const id = setInterval(() => {
            setRot((r) => (r + 5) % 360);
        }, 90);
        return () => clearInterval(id);
    }, []);

    return <Pre aria-hidden="true">{buildFrame(rot, cells)}</Pre>;
};

export default AsciiGlobe;
