import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { useSettings, DEFAULT_SETTINGS } from '../../settings.jsx';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Group = styled.div`
    margin-bottom: 1.8rem;
`;

const GroupTitle = styled.h3`
    color: var(--dim);
    margin-bottom: 0.6rem;
    letter-spacing: 0.1em;
`;

const Caption = styled.p`
    color: var(--dim);
    margin-top: 0.4rem;
    font-size: 0.85em;
`;

const OptionButton = styled.button`
    background: transparent;
    border: 1px solid var(--dim);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    min-height: 44px;
    padding: 0.4rem 1.2rem;
    margin-right: 0.8rem;
    margin-bottom: 0.5rem;
    cursor: pointer;

    &[data-active='true'], &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }
`;

const Calibration = () => {
    const { settings, update } = useSettings();
    usePageMeta('TERMINAL CALIBRATION', 'Adjust phosphor and CRT settings.');

    return (
        <ScreenFrame title="TERMINAL CALIBRATION">
            <Group>
                <GroupTitle>{'// PHOSPHOR TYPE'}</GroupTitle>
                <OptionButton data-active={settings.theme === 'amber'} onClick={() => update({ theme: 'amber' })}>
                    AMBER (P3)
                </OptionButton>
                <OptionButton data-active={settings.theme === 'green'} onClick={() => update({ theme: 'green' })}>
                    GREEN (P1)
                </OptionButton>
            </Group>
            <Group>
                <GroupTitle>{'// SCANLINE EMITTER'}</GroupTitle>
                {['off', 'low', 'full'].map((level) => (
                    <OptionButton
                        key={level}
                        data-active={settings.scanlines === level}
                        onClick={() => update({ scanlines: level })}
                    >
                        {level.toUpperCase()}
                    </OptionButton>
                ))}
            </Group>
            <Group>
                <GroupTitle>{'// TEXT SIZE'}</GroupTitle>
                {[
                    { label: 'NORMAL', value: 1 },
                    { label: 'LARGE', value: 1.15 },
                    { label: 'X-LARGE', value: 1.3 },
                ].map((opt) => (
                    <OptionButton
                        key={opt.label}
                        data-active={settings.fontScale === opt.value}
                        onClick={() => update({ fontScale: opt.value })}
                    >
                        {opt.label}
                    </OptionButton>
                ))}
            </Group>
            <Group>
                <GroupTitle>{'// CRT SWEEP'}</GroupTitle>
                <OptionButton data-active={settings.sweep === true} onClick={() => update({ sweep: true })}>
                    ON
                </OptionButton>
                <OptionButton data-active={settings.sweep === false} onClick={() => update({ sweep: false })}>
                    OFF
                </OptionButton>
            </Group>
            <Group>
                <GroupTitle>{'// BOOT SEQUENCE'}</GroupTitle>
                <OptionButton data-active={settings.boot === 'full'} onClick={() => update({ boot: 'full' })}>
                    FULL
                </OptionButton>
                <OptionButton data-active={settings.boot === 'quick'} onClick={() => update({ boot: 'quick' })}>
                    QUICK
                </OptionButton>
                <Caption>{'// QUICK SKIPS POST ON FUTURE VISITS'}</Caption>
            </Group>
            <Group>
                <GroupTitle>{'// FACTORY RESET'}</GroupTitle>
                <OptionButton onClick={() => update({ ...DEFAULT_SETTINGS })}>
                    RESTORE DEFAULTS
                </OptionButton>
            </Group>
            <p style={{ color: 'var(--dim)' }}>
                {'// AUDIO EMITTER: INSTALLED IN A FUTURE FIRMWARE UPDATE (PHASE 2)'}
            </p>
        </ScreenFrame>
    );
};

export default Calibration;
