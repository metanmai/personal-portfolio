import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { useSettings } from '../../settings.jsx';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Group = styled.div`
    margin-bottom: 1.8rem;
`;

const GroupTitle = styled.h3`
    color: var(--dim);
    margin-bottom: 0.6rem;
    letter-spacing: 0.1em;
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
            <p style={{ color: 'var(--dim)' }}>
                {'// AUDIO EMITTER: INSTALLED IN A FUTURE FIRMWARE UPDATE (PHASE 2)'}
            </p>
        </ScreenFrame>
    );
};

export default Calibration;
