import { useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import PhosphorImage from '../PhosphorImage/PhosphorImage.jsx';
import { experience, projects, skills, testimonials } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const SectionTitle = styled.h3`
    color: var(--dim);
    margin: 2rem 0 0.8rem;
    letter-spacing: 0.1em;

    &:first-of-type {
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

const SkillRow = styled.p`
    display: flex;
    gap: 1rem;
    max-width: 360px;
    justify-content: space-between;
    font-size: 0.9em;
`;

const FileRow = styled.button`
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

const Detail = styled.div`
    display: grid;
    grid-template-columns: minmax(320px, 1.2fr) 1fr;
    gap: 1.6rem;
    padding: 1rem 0.4rem 1.6rem;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const Tech = styled.p`
    color: var(--dim);
    margin-top: 0.6rem;
`;

const RecordsCount = styled.p`
    color: var(--dim);
    margin-bottom: 1rem;
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

const renderBar = (level) => {
    const filled = Math.round(level / 10);
    return '▮'.repeat(filled) + '░'.repeat(10 - filled);
};

const CareerDossier = () => {
    const [openId, setOpenId] = useState(null);
    usePageMeta('CAREER DOSSIER', 'Work, projects, and commendations.');

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
                        &gt; FULL RECORD: <a href="/resume.pdf" target="_blank" rel="noreferrer">RESUME [PDF]</a>
                    </ResumeLine>
                </Column>
                <Column>
                    <SectionTitle>{'// CURRENT LOADOUT'}</SectionTitle>
                    {skills.map((skill) => (
                        <SkillRow key={skill.name}>
                            <span>{skill.name}</span>
                            <span aria-label={`${skill.level} percent`}>{renderBar(skill.level)} {skill.level}</span>
                        </SkillRow>
                    ))}
                </Column>
            </TopGrid>

            <SectionTitle>{'// PROJECT ARCHIVES'}</SectionTitle>
            <RecordsCount>
                {projects.length} RECORDS RECOVERED. SELECT A FILE TO DECRYPT.
            </RecordsCount>
            {projects.map((project) => (
                <div key={project.id}>
                    <FileRow
                        aria-expanded={openId === project.id}
                        onClick={() => setOpenId(openId === project.id ? null : project.id)}
                    >
                        <span>&gt; FILE_{String(project.id).padStart(3, '0')}: {project.name}</span>
                        <span>{openId === project.id ? '[CLOSE]' : '[OPEN]'}</span>
                    </FileRow>
                    {openId === project.id && (
                        <Detail>
                            <PhosphorImage src={project.thumbnail} alt={`${project.name} screenshot`} />
                            <div>
                                <p>{project.description}</p>
                                <Tech>STACK: {project.tech.join(' · ')}</Tech>
                                <p style={{ marginTop: '0.6rem' }}>
                                    &gt; <a href={project.link} target="_blank" rel="noreferrer">ACCESS SOURCE [GITHUB]</a>
                                </p>
                            </div>
                        </Detail>
                    )}
                </div>
            ))}

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
