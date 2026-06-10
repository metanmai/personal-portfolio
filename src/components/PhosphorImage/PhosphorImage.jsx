import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const decrypt = keyframes`
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0% 0); }
`;

const Wrap = styled.figure`
    position: relative;
    background-color: var(--phosphor);
    max-width: 720px;
`;

const Img = styled.img`
    display: block;
    width: 100%;
    filter: grayscale(1) contrast(1.1);
    mix-blend-mode: multiply;
    animation: ${decrypt} 0.5s steps(10);

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Lines = styled.div`
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 4px);
    pointer-events: none;
`;

const RawButton = styled.button`
    position: absolute;
    bottom: 8px;
    right: 8px;
    font: inherit;
    font-size: 0.8em;
    background: var(--bg);
    color: var(--phosphor);
    border: 1px solid var(--dim);
    padding: 0.2rem 0.6rem;
    cursor: pointer;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
    }
`;

const Lightbox = styled.div`
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    cursor: pointer;

    img {
        max-width: 92vw;
        max-height: 82vh;
    }
`;

const PhosphorImage = ({ src, alt }) => {
    const [raw, setRaw] = useState(false);

    useEffect(() => {
        if (!raw) return undefined;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                setRaw(false);
            }
        };
        // capture phase so the app-level Esc handler doesn't also fire
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [raw]);

    return (
        <Wrap>
            <Img src={src} alt={alt} loading="lazy" />
            <Lines />
            <RawButton onClick={() => setRaw(true)}>[VIEW RAW]</RawButton>
            {raw && (
                <Lightbox onClick={() => setRaw(false)} role="dialog" aria-label={`${alt} — original image`}>
                    <p>OUTPUT TO EXTERNAL DISPLAY — CLICK OR [ESC] TO CLOSE</p>
                    <img src={src} alt={alt} />
                </Lightbox>
            )}
        </Wrap>
    );
};

PhosphorImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

export default PhosphorImage;
