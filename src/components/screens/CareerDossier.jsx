import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { experience, skills, testimonials } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const SectionTitle = styled.h3`
    color: var(--dim);
    margin: 2.6rem 0 0.8rem;
    letter-spacing: 0.1em;

    /* Only zero the top margin for a heading that opens its container (the two
       column headings). The FIELD COMMENDATIONS heading sits below the grid and
       keeps its spacing so it isn't crammed against the resume line. */
    &:first-child {
        margin-top: 0;
    }
`;

const TopGrid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 2.5rem;
    align-items: start;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        gap: 1.2rem;
    }
`;

const Column = styled.div`
    min-width: 0;
`;

const Entry = styled.div`
    border-left: 2px solid var(--dim);
    padding-left: 1rem;
    margin-bottom: 1rem;
`;

const Period = styled.p`
    color: var(--dim);
`;

const ResumeLine = styled.p`
    color: var(--dim);
    margin-top: 1.4rem;
    font-size: 0.9em;
`;

const SkillList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const SkillItem = styled.li`
    padding: 0.2rem 0;

    &::before {
        content: '▸ ';
        color: var(--dim);
    }
`;

const TestimonialGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

const TestimonialCard = styled.div`
    border: 1px solid var(--dim);
    padding: 0.9rem 1rem;
`;

const TestimonialAttribution = styled.p`
    color: var(--dim);
    margin-top: 0.5rem;
    font-size: 0.9em;
`;

const CareerDossier = () => {
    usePageMeta('CAREER DOSSIER', 'Service record, loadout, and commendations.');

    return (
        <ScreenFrame title="CAREER DOSSIER">
            <TopGrid>
                <Column>
                    <SectionTitle>{'// SERVICE RECORD'}</SectionTitle>
                    {experience.map((job) => (
                        <Entry key={job.period}>
                            <Period>{job.period}</Period>
                            <p>{job.title} — {job.org}</p>
                            <p>{job.summary}</p>
                        </Entry>
                    ))}
                    <ResumeLine>
                        &gt; FULL RECORD: <a href="https://drive.google.com/file/d/1YEdFyUcd5Oo9BDnrRN9kJdFXfX8q7gqr/view?usp=sharing" target="_blank" rel="noreferrer">RESUME [PDF]</a>
                    </ResumeLine>
                </Column>
                <Column>
                    <SectionTitle>{'// CURRENT LOADOUT'}</SectionTitle>
                    <SkillList>
                        {skills.map((skill) => (
                            <SkillItem key={skill.name}>{skill.name}</SkillItem>
                        ))}
                    </SkillList>
                </Column>
            </TopGrid>

            <SectionTitle>{'// FIELD COMMENDATIONS'}</SectionTitle>
            <TestimonialGrid>
                {testimonials.map((entry) => (
                    <TestimonialCard key={entry.person}>
                        <p>&ldquo;{entry.text}&rdquo;</p>
                        <TestimonialAttribution>
                            — {entry.person}, {entry.role}, {entry.company}
                        </TestimonialAttribution>
                    </TestimonialCard>
                ))}
            </TestimonialGrid>
        </ScreenFrame>
    );
};

export default CareerDossier;
