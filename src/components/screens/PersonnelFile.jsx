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

const TimelineEntry = styled.div`
    border-left: 2px solid var(--dim);
    padding-left: 1rem;
    margin-bottom: 1.1rem;
    display: grid;
    grid-template-columns: 5rem 1fr;
    gap: 0.4rem 1rem;
    align-items: baseline;

    @media (max-width: 540px) {
        grid-template-columns: 1fr;
        gap: 0.2rem;
    }
`;

const Year = styled.span`
    color: var(--dim);
    letter-spacing: 0.08em;
`;

const EntryTitle = styled.span`
    color: var(--phosphor);
`;

const Note = styled.p`
    grid-column: 2;
    color: var(--dim);
    font-size: 0.9em;
    margin-top: 0.1rem;

    @media (max-width: 540px) {
        grid-column: 1;
    }
`;

const PersonnelFile = () => {
    const { output } = useTypewriter(personal.bio, 90);
    usePageMeta('PERSONNEL FILE', 'Tanmai Nuthi — the journey so far.');

    return (
        <ScreenFrame title="PERSONNEL FILE">
            <SectionTitle>{'// IDENTIFICATION'}</SectionTitle>
            <p>NAME: {personal.name} · ROLE: {personal.role} · EST. {personal.established}</p>
            <Bio>{output}█</Bio>

            <SectionTitle>{'// THE JOURNEY'}</SectionTitle>
            {journey.map((entry) => (
                <TimelineEntry key={`${entry.year}-${entry.title}`}>
                    <Year>{entry.year}</Year>
                    <EntryTitle>{entry.title}</EntryTitle>
                    <Note>{entry.note}</Note>
                </TimelineEntry>
            ))}
        </ScreenFrame>
    );
};

export default PersonnelFile;
