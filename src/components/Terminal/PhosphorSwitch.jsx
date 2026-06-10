import styled from 'styled-components';
import { useSettings } from '../../settings.jsx';
import { THEME_ORDER, DEFAULT_THEME } from '../../theme.js';
import { playConfirmBlip } from '../../hooks/useSound.js';

// In normal flow (not fixed) so the cluster lines up with the content column
// and can never sit on top of screen titles or the [ESC] back link.
const Cluster = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.9rem;
`;

const ChromeButton = styled.button`
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
`;

/* mobile: tiny tappable blob showing the current phosphor color */
const PhosphorButton = styled(ChromeButton)`
    @media (max-width: 700px) {
        font-size: 0;
        width: 26px;
        height: 26px;
        padding: 0;
        border-radius: 50%;
        background: var(--phosphor);
    }
`;

/* mobile: matching blob, icon only */
const SoundButton = styled(ChromeButton)`
    @media (max-width: 700px) {
        width: 26px;
        height: 26px;
        padding: 0;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: ${({ $on }) => ($on ? 'var(--phosphor)' : 'var(--dim)')};
    }
`;

const SoundLabel = styled.span`
    @media (max-width: 700px) {
        display: none;
    }
`;

const SoundGlyph = styled.span`
    @media (min-width: 701px) {
        display: none;
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

    const toggleSound = () => {
        const next = !settings.sound;
        update({ sound: next });
        // confirmation beep only when enabling — fires immediately so the
        // user hears feedback the instant they turn sound on
        if (next) {
            try { playConfirmBlip(); } catch { /* ignore */ }
        }
    };

    return (
        <Cluster>
            <PhosphorButton
                type="button"
                onClick={cycle}
                aria-label="cycle phosphor color"
            >
                [ PHOSPHOR: {current.toUpperCase()} ⟲ ]
            </PhosphorButton>
            <SoundButton
                type="button"
                onClick={toggleSound}
                aria-label="toggle sound"
                $on={settings.sound}
            >
                <SoundLabel>[ ♪ {settings.sound ? 'ON' : 'OFF'} ]</SoundLabel>
                <SoundGlyph aria-hidden="true">♪</SoundGlyph>
            </SoundButton>
        </Cluster>
    );
};

export default PhosphorSwitch;
