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

/* weak-signal stutter: brief stepped jitter + slice jumps, ~180ms */
const glitch = keyframes`
    0%   { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: inset(0 0 0 0); }
    15%  { transform: translate(-3px, 1px) skewX(2deg); filter: saturate(3) hue-rotate(20deg); clip-path: inset(8% 0 62% 0); }
    30%  { transform: translate(2px, -2px) skewX(-1deg); filter: saturate(3) hue-rotate(-15deg); clip-path: inset(40% 0 18% 0); }
    50%  { transform: translate(-2px, 2px) skewX(1deg); filter: saturate(2) hue-rotate(10deg); clip-path: inset(70% 0 6% 0); }
    70%  { transform: translate(3px, -1px) skewX(-2deg); filter: saturate(3) hue-rotate(-20deg); clip-path: inset(20% 0 50% 0); }
    85%  { transform: translate(-1px, 1px) skewX(0.5deg); filter: saturate(2) hue-rotate(8deg); clip-path: inset(0 0 0 0); }
    100% { transform: translate(0, 0) skewX(0deg); filter: none; clip-path: inset(0 0 0 0); }
`;

const Shell = styled.div`
    min-height: 100dvh;
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: clamp(19px, 2.6vmin, 26px);
    text-shadow: 0 0 7px var(--glow);
    position: relative;
    padding: clamp(14px, 4vw, 56px);
    animation: ${powerOn} 0.35s ease-out, ${ambient} 11s steps(1) 3s infinite;

    &[data-glitch='true'] {
        ${css`animation: ${glitch} 180ms steps(6, end) 1;`}
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;

        &[data-glitch='true'] {
            animation: none;
        }
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
    const [glitching, setGlitching] = useState(false);

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
            const delay = 30000 + Math.random() * 60000; // avg ~1/min
            timeoutId = setTimeout(() => {
                if (cancelled) return;
                setGlitching(true);
                stopTimeoutId = setTimeout(() => {
                    if (cancelled) return;
                    setGlitching(false);
                    schedule();
                }, 180);
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
        <Shell data-glitch={glitching ? 'true' : undefined}>
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
