import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { useSettings } from '../../settings.jsx';

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

const Shell = styled.div`
    min-height: 100dvh;
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: calc(clamp(19px, 2.6vmin, 26px) * var(--font-scale, 1));
    text-shadow: 0 0 7px var(--glow);
    position: relative;
    padding: clamp(14px, 4vw, 56px);
    animation: ${powerOn} 0.35s ease-out, ${ambient} 11s steps(1) 3s infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
`;

const Scanlines = styled(Overlay)`
    ${({ $intensity }) =>
        $intensity === 'off'
            ? css`display: none;`
            : css`
                background: repeating-linear-gradient(
                    0deg,
                    transparent 0 3px,
                    rgba(0, 0, 0, ${$intensity === 'low' ? 0.12 : 0.25}) 3px 5px
                );
            `}
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
    const { settings } = useSettings();

    return (
        <Shell>
            {children}
            <Scanlines $intensity={settings.scanlines} data-testid="scanlines" />
            <Vignette />
            {settings.sweep !== false && settings.scanlines !== 'off' && <Sweep />}
        </Shell>
    );
};

Terminal.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Terminal;
