import styled from 'styled-components';
import { useSettings } from '../../settings.jsx';
import { THEME_ORDER, DEFAULT_THEME } from '../../theme.js';

const Button = styled.button`
    position: fixed;
    top: 10px;
    right: 14px;
    z-index: 60;
    font: inherit;
    background: none;
    border: none;
    color: var(--dim);
    cursor: pointer;
    padding: 0.1rem 0.4rem;
    text-shadow: none;

    &:hover,
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        outline: none;
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
            [PHOSPHOR: {current.toUpperCase()}]
        </Button>
    );
};

export default PhosphorSwitch;
