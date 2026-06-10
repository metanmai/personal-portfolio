import { useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { personal, journey } from '../../constants/index.js';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const SectionTitle = styled.h3`
    color: var(--dim);
    margin: 1.8rem 0 0.8rem;
    letter-spacing: 0.1em;
`;

const Bio = styled.p`
    max-width: 70ch;
    min-height: 3em;
`;

const JourneyGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(220px, 1fr);
    gap: 2.5rem;
    align-items: start;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        gap: 1.6rem;
    }
`;

const Timeline = styled.div`
    border-left: 2px solid var(--dim);
    padding-left: 1rem;
`;

const EntryRow = styled.button`
    display: grid;
    grid-template-columns: 5rem 1fr auto;
    gap: 0.4rem 1rem;
    align-items: baseline;
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
    padding: 0.55rem 0.4rem;

    &:hover, &:focus-visible, &[aria-expanded='true'] {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }

    @media (max-width: 540px) {
        grid-template-columns: 1fr auto;
        gap: 0.2rem 0.6rem;
    }
`;

const Year = styled.span`
    color: var(--dim);
    letter-spacing: 0.08em;

    ${EntryRow}:hover &,
    ${EntryRow}:focus-visible &,
    ${EntryRow}[aria-expanded='true'] & {
        color: var(--bg);
    }
`;

const EntryTitle = styled.span`
    color: inherit;
`;

const Indicator = styled.span`
    color: var(--dim);
    margin-left: 0.5rem;

    ${EntryRow}:hover &,
    ${EntryRow}:focus-visible &,
    ${EntryRow}[aria-expanded='true'] & {
        color: var(--bg);
    }
`;

const EntryBlock = styled.div`
    border-bottom: 1px dashed var(--dim);
    padding: 0 0.4rem 0.4rem;
`;

const Note = styled.p`
    color: var(--dim);
    font-size: 0.9em;
    margin: 0.1rem 0 0;
    padding: 0 0.4rem 0.55rem;

    ${EntryBlock}:has(${EntryRow}[aria-expanded='true']) > & {
        /* keep note dim even when row is hovered/open */
    }
`;

const Body = styled.p`
    max-width: 70ch;
    padding: 0.6rem 0.4rem 0.9rem;
    color: var(--phosphor);
`;

const PortraitPanel = styled.aside`
    border: 1px solid var(--dim);
    background: var(--bg);
    display: flex;
    flex-direction: column;

    @media (min-width: 801px) {
        position: sticky;
        top: 2rem;
    }
`;

const PortraitCaption = styled.div`
    color: var(--dim);
    font-size: 0.85em;
    letter-spacing: 0.08em;
    padding: 0.45rem 0.7rem;
    border-bottom: 1px solid var(--dim);
`;

const PortraitFrame = styled.figure`
    position: relative;
    background-color: var(--phosphor);
    margin: 0;
`;

const PortraitImg = styled.img`
    display: block;
    width: 100%;
    height: auto;
    filter: grayscale(1) contrast(1.1);
    mix-blend-mode: multiply;
`;

const PortraitScanlines = styled.div`
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 4px);
    pointer-events: none;
`;

const PersonnelFile = () => {
    const { output } = useTypewriter(personal.bio, 90);
    const [openKey, setOpenKey] = useState(null);
    usePageMeta('PERSONNEL FILE', 'Tanmai Nuthi — the journey so far.');

    return (
        <ScreenFrame title="PERSONNEL FILE">
            <SectionTitle>{'// IDENTIFICATION'}</SectionTitle>
            <p>NAME: {personal.name} · ROLE: {personal.role} · EST. {personal.established}</p>
            <Bio>{output}█</Bio>

            <SectionTitle>{'// THE JOURNEY'}</SectionTitle>
            <JourneyGrid>
                <Timeline>
                    {journey.map((entry, idx) => {
                        const key = `${entry.year}-${entry.title}`;
                        const bodyId = `journey-body-${idx}`;
                        const isOpen = openKey === key;
                        return (
                            <EntryBlock key={key}>
                                <EntryRow
                                    type="button"
                                    aria-expanded={isOpen}
                                    aria-controls={bodyId}
                                    onClick={() => setOpenKey(isOpen ? null : key)}
                                >
                                    <Year>{entry.year}</Year>
                                    <EntryTitle>{entry.title}</EntryTitle>
                                    <Indicator aria-hidden="true">{isOpen ? '[−]' : '[+]'}</Indicator>
                                </EntryRow>
                                <Note>{entry.note}</Note>
                                {isOpen && (
                                    <Body id={bodyId}>{entry.body}</Body>
                                )}
                            </EntryBlock>
                        );
                    })}
                </Timeline>
                <PortraitPanel>
                    <PortraitCaption>{'// OPERATOR PORTRAIT — FILE PHOTO'}</PortraitCaption>
                    <PortraitFrame>
                        <PortraitImg src={personal.portrait} alt="" aria-hidden="true" loading="lazy" />
                        <PortraitScanlines />
                    </PortraitFrame>
                </PortraitPanel>
            </JourneyGrid>
        </ScreenFrame>
    );
};

export default PersonnelFile;
