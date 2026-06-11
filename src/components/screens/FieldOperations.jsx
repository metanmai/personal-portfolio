import styled, { keyframes } from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { projects } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Intro = styled.p`
    color: var(--dim);
    margin-bottom: 1.6rem;
    line-height: 1.6;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.6rem;

    @media (max-width: 560px) {
        grid-template-columns: 1fr;
    }
`;

const decrypt = keyframes`
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0% 0); }
`;

const Card = styled.article`
    border: 1px solid var(--dim);
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:hover, &:focus-within {
        border-color: var(--phosphor);
        box-shadow: 0 0 14px var(--glow);
    }
`;

const ThumbFrame = styled.figure`
    position: relative;
    margin: 0;
    background: var(--phosphor);
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-bottom: 1px solid var(--dim);
`;

const Thumb = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1);
    mix-blend-mode: multiply;
    animation: ${decrypt} 0.5s steps(12);

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Scanlines = styled.div`
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 4px);
    pointer-events: none;
`;

const Body = styled.div`
    padding: 0.9rem 1rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    flex: 1;
`;

const FileTag = styled.span`
    color: var(--dim);
    letter-spacing: 0.12em;
    font-size: 0.8em;
`;

const Codename = styled.h3`
    color: var(--phosphor);
    letter-spacing: 0.06em;
    margin: 0;
`;

const Brief = styled.p`
    margin: 0;
    color: var(--phosphor);
    font-size: 0.95em;
    line-height: 1.5;
    flex: 1;
`;

const Tags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
`;

const Tag = styled.span`
    border: 1px solid var(--dim);
    color: var(--dim);
    padding: 0.1rem 0.45rem;
    font-size: 0.8em;
    letter-spacing: 0.05em;
    white-space: nowrap;
`;

const SourceLink = styled.a`
    color: var(--dim);
    text-decoration: none;
    letter-spacing: 0.06em;
    margin-top: 0.2rem;
    align-self: flex-start;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }
`;

// If a thumbnail is missing, hide the broken image and let the phosphor frame
// stand in rather than showing a torn-image glyph.
const handleImgError = (e) => {
    e.currentTarget.style.display = 'none';
};

const FieldOperations = () => {
    usePageMeta('FIELD OPERATIONS', 'Deployed artifacts and field projects.');

    return (
        <ScreenFrame title="FIELD OPERATIONS">
            <Intro>
                {`${projects.length} OPERATIONS ON RECORD. ARTIFACTS RECOVERED FROM THE FIELD — INSPECT A SOURCE TO DECRYPT.`}
            </Intro>
            <Grid>
                {projects.map((project, idx) => (
                    <Card key={project.id}>
                        <ThumbFrame>
                            <Thumb
                                src={project.thumbnail}
                                alt={`${project.name} capture`}
                                loading="lazy"
                                onError={handleImgError}
                            />
                            <Scanlines />
                        </ThumbFrame>
                        <Body>
                            <FileTag>{`OP-${String(idx + 1).padStart(3, '0')}`}</FileTag>
                            <Codename>{project.name}</Codename>
                            <Brief>{project.description}</Brief>
                            <Tags>
                                {project.tech.map((t) => (
                                    <Tag key={t}>{String(t).toUpperCase()}</Tag>
                                ))}
                            </Tags>
                            <SourceLink href={project.link} target="_blank" rel="noreferrer">
                                &gt; INSPECT SOURCE [GITHUB]
                            </SourceLink>
                        </Body>
                    </Card>
                ))}
            </Grid>
        </ScreenFrame>
    );
};

export default FieldOperations;
