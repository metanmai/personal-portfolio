import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { personal, experience, skills } from '../../constants/index.js';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const SectionTitle = styled.h3`
    color: var(--dim);
    margin: 1.6rem 0 0.6rem;
    letter-spacing: 0.1em;
`;

const Bio = styled.p`
    max-width: 70ch;
    min-height: 3em;
`;

const Entry = styled.div`
    border-left: 2px solid var(--dim);
    padding-left: 1rem;
    margin-bottom: 1rem;
`;

const Period = styled.p`
    color: var(--dim);
`;

const SkillRow = styled.p`
    display: flex;
    gap: 1rem;
    max-width: 420px;
    justify-content: space-between;
`;

const renderBar = (level) => {
    const filled = Math.round(level / 10);
    return '▮'.repeat(filled) + '░'.repeat(10 - filled);
};

const PersonnelFile = () => {
    const { output } = useTypewriter(personal.bio, 90);
    usePageMeta('PERSONNEL FILE', 'About Tanmai Nuthi: experience and skills.');

    return (
        <ScreenFrame title="PERSONNEL FILE">
            <SectionTitle>{'// IDENTIFICATION'}</SectionTitle>
            <p>NAME: {personal.name} · ROLE: {personal.role} · EST. {personal.established}</p>
            <Bio>{output}█</Bio>

            <SectionTitle>{'// SERVICE RECORD'}</SectionTitle>
            {experience.map((job) => (
                <Entry key={job.period}>
                    <Period>{job.period}</Period>
                    <p>{job.title} — {job.org}</p>
                    <p>{job.summary}</p>
                </Entry>
            ))}

            <SectionTitle>{'// FIELD PROFICIENCIES'}</SectionTitle>
            {skills.map((skill) => (
                <SkillRow key={skill.name}>
                    <span>{skill.name}</span>
                    <span aria-label={`${skill.level} percent`}>{renderBar(skill.level)} {skill.level}</span>
                </SkillRow>
            ))}
        </ScreenFrame>
    );
};

export default PersonnelFile;
