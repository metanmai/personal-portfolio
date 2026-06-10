import { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import PhosphorSwitch from './PhosphorSwitch.jsx';

const powerOn = keyframes`
    0% { opacity: 0; }
    10% { opacity: 0.8; }
    20% { opacity: 0.2; }
    40% { opacity: 0.9; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
`;

const ambient = keyframes`
    0%, 100% { opacity: 1; }
    97.4% { opacity: 1; }
    97.5% { opacity: 0.93; }
    97.9% { opacity: 1; }
    98.3% { opacity: 0.96; }
    98.4% { opacity: 1; }
`;

const sweep = keyframes`
    from { top: -120px; }
    to { top: 110%; }
`;

/* Type 1 — horizontal jitter + skew + clip-path slices (the original weak-signal stutter) */
const glitch1 = keyframes`
    0%   { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: inset(0 0 0 0); }
    15%  { transform: translate(-3px, 1px) skewX(2deg); filter: saturate(3) hue-rotate(20deg); clip-path: inset(8% 0 62% 0); }
    30%  { transform: translate(2px, -2px) skewX(-1deg); filter: saturate(3) hue-rotate(-15deg); clip-path: inset(40% 0 18% 0); }
    50%  { transform: translate(-2px, 2px) skewX(1deg); filter: saturate(2) hue-rotate(10deg); clip-path: inset(70% 0 6% 0); }
    70%  { transform: translate(3px, -1px) skewX(-2deg); filter: saturate(3) hue-rotate(-20deg); clip-path: inset(20% 0 50% 0); }
    85%  { transform: translate(-1px, 1px) skewX(0.5deg); filter: saturate(2) hue-rotate(8deg); clip-path: inset(0 0 0 0); }
    100% { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: inset(0 0 0 0); }
`;

/* Type 2 — vertical hold loss: picture rolls up/down with brightness/contrast spikes */
const glitch2 = keyframes`
    0%   { transform: translate(0, 0); filter: none; }
    20%  { transform: translate(0, -6px); filter: brightness(1.4) contrast(1.3); }
    40%  { transform: translate(0, 5px); filter: brightness(0.7) contrast(1.5); }
    60%  { transform: translate(0, -4px); filter: brightness(1.3) contrast(0.9); }
    80%  { transform: translate(0, 3px); filter: brightness(1.1) contrast(1.2); }
    100% { transform: translate(0, 0); filter: none; }
`;

/* Type 3 — zig-zag: diagonal stepped jumps + small rotate/skewY, like the beam losing sync */
const glitch3 = keyframes`
    0%   { transform: translate(0, 0) rotate(0deg) skewY(0deg); filter: none; }
    20%  { transform: translate(4px, 3px) rotate(0.6deg) skewY(1deg); filter: saturate(1.8); }
    40%  { transform: translate(-5px, -3px) rotate(-0.7deg) skewY(-1.2deg); filter: saturate(2); }
    60%  { transform: translate(4px, -3px) rotate(0.5deg) skewY(0.8deg); filter: saturate(1.6); }
    80%  { transform: translate(-3px, 3px) rotate(-0.4deg) skewY(-0.6deg); filter: saturate(1.8); }
    100% { transform: translate(0, 0) rotate(0deg) skewY(0deg); filter: none; }
`;

/* Type 4 — horizontal tear/shear: strong skewX with opposite clip-path displacements + hue flash */
const glitch4 = keyframes`
    0%   { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: inset(0 0 0 0); }
    20%  { transform: translate(8px, 0) skewX(8deg); filter: hue-rotate(40deg) saturate(3); clip-path: inset(30% 0 55% 0); }
    40%  { transform: translate(-9px, 0) skewX(-9deg); filter: hue-rotate(-35deg) saturate(2.5); clip-path: inset(55% 0 30% 0); }
    60%  { transform: translate(7px, 0) skewX(6deg); filter: hue-rotate(25deg) saturate(3); clip-path: inset(15% 0 70% 0); }
    80%  { transform: translate(-4px, 0) skewX(-3deg); filter: hue-rotate(-10deg) saturate(2); clip-path: inset(0 0 0 0); }
    100% { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: inset(0 0 0 0); }
`;

/* one source of truth: keyframe + duration paired so JS timeout can't drift from CSS */
const GLITCH_VARIANTS = [
    { id: '1', keyframes: glitch1, duration: 180, steps: 6 },
    { id: '2', keyframes: glitch2, duration: 220, steps: 5 },
    { id: '3', keyframes: glitch3, duration: 260, steps: 6 },
    { id: '4', keyframes: glitch4, duration: 200, steps: 5 },
];

const Shell = styled.div`
    min-height: 100dvh;
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: clamp(19px, 2.6vmin, 26px);
    text-shadow: 0 0 7px var(--glow);
    position: relative;
    padding: clamp(14px, 4vw, 56px);
    /* keep content clear of the notch / browser chrome under viewport-fit=cover */
    padding-top: calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-top, 0px));
    padding-left: calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-left, 0px));
    padding-right: calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-right, 0px));
    animation: ${powerOn} 0.35s ease-out, ${ambient} 11s steps(1) 3s infinite;

    ${GLITCH_VARIANTS.map(
        (v) => css`
            &[data-glitch='${v.id}'] {
                animation: ${v.keyframes} ${v.duration}ms steps(${v.steps}, end) 1;
            }
        `,
    )}

    @media (prefers-reduced-motion: reduce) {
        animation: none;

        ${GLITCH_VARIANTS.map(
            (v) => css`
                &[data-glitch='${v.id}'] {
                    animation: none;
                }
            `,
        )}
    }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
`;

const Scanlines = styled(Overlay)`
    background: repeating-linear-gradient(
        0deg,
        transparent 0 3px,
        rgba(0, 0, 0, 0.25) 3px 5px
    );
`;

const Vignette = styled(Overlay)`
    background: radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.55) 100%);
`;

const Sweep = styled(Overlay)`
    inset: auto 0;
    height: 110px;
    background: linear-gradient(to bottom, transparent, var(--glow), transparent);
    opacity: 0.07;
    animation: ${sweep} 8s linear infinite;

    @media (prefers-reduced-motion: reduce) {
        display: none;
    }
`;

const Terminal = ({ children }) => {
    const [glitchType, setGlitchType] = useState(null);

    useEffect(() => {
        // disable entirely under reduced-motion — don't even schedule
        if (
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return undefined;
        }

        let timeoutId;
        let stopTimeoutId;
        let cancelled = false;

        const schedule = () => {
            // 1-2 glitches per ~20s → next trigger in 7-19s (avg ~13s)
            const delay = 7000 + Math.random() * 12000;
            timeoutId = setTimeout(() => {
                if (cancelled) return;
                const variant =
                    GLITCH_VARIANTS[Math.floor(Math.random() * GLITCH_VARIANTS.length)];
                setGlitchType(variant.id);
                stopTimeoutId = setTimeout(() => {
                    if (cancelled) return;
                    setGlitchType(null);
                    schedule();
                }, variant.duration);
            }, delay);
        };

        schedule();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
            clearTimeout(stopTimeoutId);
        };
    }, []);

    return (
        <Shell data-glitch={glitchType || undefined}>
            <PhosphorSwitch />
            {children}
            <Scanlines data-testid="scanlines" />
            <Vignette />
            <Sweep />
        </Shell>
    );
};

Terminal.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Terminal;
