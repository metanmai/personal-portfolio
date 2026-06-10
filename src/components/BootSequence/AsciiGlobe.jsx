import { useEffect, useState } from 'react';
import styled from 'styled-components';

// A small ASCII rotating wireframe sphere — pure DOM, no canvas/webgl.
// Grid ~38 cols × ~17 rows. Orthographic projection, only z>0 plotted.

const COLS = 38;
const ROWS = 17;
const CX = (COLS - 1) / 2;
const CY = (ROWS - 1) / 2;
// terminal cells are roughly twice as tall as they are wide → x scaled 2x
const RX = (COLS - 2) / 2;
const RY = (ROWS - 2) / 2;

const DEG = Math.PI / 180;

const reducedMotion = () => {
    try {
        return typeof window !== 'undefined'
            && window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
};

const buildFrame = (rotDeg) => {
    const grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ' '));

    // Disc outline (full circle silhouette) — drawn first so points override it.
    for (let a = 0; a < 360; a += 4) {
        const rad = a * DEG;
        const x = Math.cos(rad);
        const y = Math.sin(rad);
        const col = Math.round(CX + x * RX);
        const row = Math.round(CY + y * RY);
        if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
            grid[row][col] = ':';
        }
    }

    // Lat/long grid points — only z > 0 (visible hemisphere).
    for (let lat = -80; lat <= 80; lat += 20) {
        const latRad = lat * DEG;
        const sinLat = Math.sin(latRad);
        const cosLat = Math.cos(latRad);
        for (let lon = 0; lon < 360; lon += 20) {
            const lonRad = (lon + rotDeg) * DEG;
            const x = cosLat * Math.sin(lonRad);
            const y = sinLat;
            const z = cosLat * Math.cos(lonRad);
            if (z <= 0) continue;
            const col = Math.round(CX + x * RX);
            const row = Math.round(CY + y * RY);
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS) continue;
            grid[row][col] = lat === 0 ? 'o' : '·';
        }
    }

    return grid.map((r) => r.join('')).join('\n');
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
    const [rot, setRot] = useState(0);

    useEffect(() => {
        if (reducedMotion()) return undefined;
        const id = setInterval(() => {
            setRot((r) => (r + 12) % 360);
        }, 110);
        return () => clearInterval(id);
    }, []);

    return <Pre aria-hidden="true">{buildFrame(rot)}</Pre>;
};

export default AsciiGlobe;
