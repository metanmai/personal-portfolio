import { useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import PhosphorImage from '../PhosphorImage/PhosphorImage.jsx';
import { projects } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

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
    grid-template-columns: minmax(220px, 1fr) 2fr;
    gap: 1.2rem;
    padding: 1rem 0.4rem 1.6rem;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const Tech = styled.p`
    color: var(--dim);
    margin-top: 0.6rem;
`;

const ProjectArchives = () => {
    const [openId, setOpenId] = useState(null);
    usePageMeta('PROJECT ARCHIVES', 'Projects by Tanmai Nuthi.');

    return (
        <ScreenFrame title="PROJECT ARCHIVES">
            <p style={{ color: 'var(--dim)', marginBottom: '1rem' }}>
                {projects.length} RECORDS RECOVERED. SELECT A FILE TO DECRYPT.
            </p>
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
        </ScreenFrame>
    );
};

export default ProjectArchives;
