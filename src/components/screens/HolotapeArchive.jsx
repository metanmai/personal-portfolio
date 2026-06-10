import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { holotapes } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useTypewriter } from '../../hooks/useTypewriter.js';

const Intro = styled.p`
    color: var(--dim);
    margin-bottom: 1rem;
`;

const TapeRow = styled.button`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    min-height: 44px;
    background: none;
    border: none;
    border-bottom: 1px dashed var(--dim);
    font: inherit;
    color: var(--phosphor);
    text-shadow: inherit;
    text-align: left;
    cursor: pointer;
    padding: 0.5rem 0.4rem;

    &:hover, &:focus-visible, &[aria-expanded='true'] {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }
`;

const TapeLabel = styled.span`
    display: inline-flex;
    gap: 0.6rem;
    flex-wrap: wrap;
`;

const Meta = styled.span`
    color: var(--dim);

    ${TapeRow}:hover &,
    ${TapeRow}:focus-visible &,
    ${TapeRow}[aria-expanded='true'] & {
        color: inherit;
    }
`;

const Transcript = styled.div`
    border-left: 1px solid var(--dim);
    padding: 0.8rem 0 0.8rem 1rem;
    margin: 0.4rem 0 1.2rem 0.4rem;
    white-space: pre-wrap;
`;

const Marker = styled.p`
    color: var(--dim);
    margin: 0;
`;

const BodyText = styled.p`
    margin: 0.6rem 0;
`;

const Playback = ({ body }) => {
    const { output, done } = useTypewriter(body, 240);
    return (
        <Transcript>
            <Marker>&gt; PLAYBACK INITIATED...</Marker>
            <BodyText>{output}</BodyText>
            {done && <Marker>&gt; END OF TAPE.</Marker>}
        </Transcript>
    );
};

Playback.propTypes = {
    body: PropTypes.string.isRequired,
};

const HolotapeArchive = () => {
    const [openId, setOpenId] = useState(null);
    usePageMeta('HOLOTAPE ARCHIVE', 'Logs and notes.');

    return (
        <ScreenFrame title="HOLOTAPE ARCHIVE">
            <Intro>
                {holotapes.length} TAPES RECOVERED. SELECT TO PLAY BACK.
            </Intro>
            {holotapes.map((tape) => {
                const isOpen = openId === tape.id;
                return (
                    <div key={tape.id}>
                        <TapeRow
                            aria-expanded={isOpen}
                            onClick={() => setOpenId(isOpen ? null : tape.id)}
                        >
                            <TapeLabel>
                                <span>▣</span>
                                <Meta>{tape.id}</Meta>
                                <Meta>·</Meta>
                                <Meta>{tape.date}</Meta>
                                <span>— {tape.title}</span>
                            </TapeLabel>
                            <span>{isOpen ? '[CLOSE]' : '[OPEN]'}</span>
                        </TapeRow>
                        {isOpen && <Playback body={tape.body} />}
                    </div>
                );
            })}
        </ScreenFrame>
    );
};

export default HolotapeArchive;
