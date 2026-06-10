import styled from 'styled-components';
import { useSettings } from '../../settings.jsx';
import { THEME_ORDER, DEFAULT_THEME } from '../../theme.js';

const Button = styled.button`
    position: fixed;
    top: 10px;
    right: 14px;
    z-index: 60;
    font: inherit;
    background: color-mix(in srgb, var(--bg) 85%, var(--phosphor));
    border: 1px solid var(--dim);
    color: var(--dim);
    cursor: pointer;
    padding: 0.35rem 0.9rem;
    text-shadow: none;
    letter-spacing: 0.04em;
    transition: transform 60ms ease-out;

    &:hover,
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        outline: none;
    }

    &:active {
        transform: translateY(1px);
    }

    /* mobile: tiny tappable blob showing the current phosphor color */
    @media (max-width: 700px) {
        font-size: 0;
        width: 26px;
        height: 26px;
        padding: 0;
        border-radius: 50%;
        background: var(--phosphor);
        top: 12px;
        right: 12px;
    }
`;

const PhosphorSwitch = () => {
    const { settings, update } = useSettings();
    const current = THEME_ORDER.includes(settings.theme) ? settings.theme : DEFAULT_THEME;

    const cycle = () => {
        const idx = THEME_ORDER.indexOf(current);
        const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
        update({ theme: next });
    };

    return (
        <Button
            type="button"
            onClick={cycle}
            aria-label="cycle phosphor color"
        >
            [ PHOSPHOR: {current.toUpperCase()} ⟲ ]
        </Button>
    );
};

export default PhosphorSwitch;
