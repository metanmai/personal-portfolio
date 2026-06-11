import { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import HackMinigame from '../HackMinigame/HackMinigame.jsx';
import LockReveal from '../LockReveal.jsx';
import { personal, journey, hackGame } from '../../constants/index.js';
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
    grid-template-columns: minmax(0, 1fr) minmax(300px, 1.1fr);
    gap: 2.5rem;
    align-items: start;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
        gap: 1.2rem;
    }
`;

// Vertical list on desktop; on mobile it becomes a horizontal, scrollable
// strip of capture tabs so the log sits above the image+text (no scrolling
// back and forth to read a section and see its photo together).
const Timeline = styled.div`
    border-left: 2px solid var(--dim);
    padding-left: 1rem;
    display: flex;
    flex-direction: column;

    @media (max-width: 800px) {
        border-left: none;
        padding-left: 0;
        flex-direction: row;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
    }
`;

const EntryRow = styled.button`
    display: grid;
    grid-template-columns: 3rem 1fr auto;
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

    &:hover, &:focus-visible, &[aria-pressed='true'] {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }

    /* compact tab in the horizontal mobile strip */
    @media (max-width: 800px) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: auto;
        flex: 0 0 auto;
        min-width: 48px;
        border: 1px solid var(--dim);
        padding: 0.5rem 0.9rem;
    }
`;

const Marker = styled.span`
    color: var(--dim);
    letter-spacing: 0.08em;

    ${EntryRow}:hover &,
    ${EntryRow}:focus-visible &,
    ${EntryRow}[aria-pressed='true'] & {
        color: var(--bg);
    }
`;

const EntryTitle = styled.span`
    color: inherit;

    @media (max-width: 800px) {
        display: none;
    }
`;

const Indicator = styled.span`
    color: var(--dim);
    margin-left: 0.5rem;

    ${EntryRow}:hover &,
    ${EntryRow}:focus-visible &,
    ${EntryRow}[aria-pressed='true'] & {
        color: var(--bg);
    }

    @media (max-width: 800px) {
        display: none;
    }
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

    /* mobile: log strip leads, then a smaller centered capture card below it */
    @media (max-width: 800px) {
        max-width: 320px;
        width: 100%;
        margin: 0 auto;
    }
`;

const PortraitCaption = styled.div`
    color: var(--dim);
    font-size: 0.85em;
    letter-spacing: 0.08em;
    padding: 0.45rem 0.7rem;
    border-bottom: 1px solid var(--dim);
`;

// Fixed aspect + capped height reserves the image's space, so swapping captures
// never collapses the layout (which was clamping the page scroll to the top),
// and keeps the capture bounded within the view frame.
const PortraitFrame = styled.figure`
    position: relative;
    background-color: var(--phosphor);
    margin: 0 auto;
    width: 100%;
    max-width: 280px;
    aspect-ratio: 1 / 1;
    max-height: 38vh;
    overflow: hidden;
`;

const decrypt = keyframes`
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0% 0); }
`;

const PortraitImg = styled.img`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1);
    mix-blend-mode: multiply;
    /* re-keyed per capture so the swap "decrypts" top-to-bottom */
    animation: ${decrypt} 0.45s steps(10);

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const PortraitScanlines = styled.div`
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 4px);
    pointer-events: none;
`;

// Short per-capture write-up shown directly beneath the image, so a section's
// text and photo are always visible together.
const DescBox = styled.div`
    border-top: 1px solid var(--dim);
    padding: 0.7rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

const DescTitle = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.06em;
`;

const DescNote = styled.div`
    color: var(--dim);
    font-size: 0.85em;
    letter-spacing: 0.05em;
`;

const DescBody = styled.p`
    margin: 0;
    color: var(--phosphor);
    font-size: 0.95em;
    line-height: 1.5;
`;

const Intro = styled.p`
    color: var(--dim);
    margin-bottom: 1.5rem;
    line-height: 1.6;
`;

const RotationNotice = styled.p`
    color: var(--dim);
    opacity: 0.7;
    margin-bottom: 1.5rem;
    letter-spacing: 0.08em;
    font-size: 0.9em;
`;

const LockoutBlock = styled.div`
    border: 1px solid var(--dim);
    padding: 1.5rem;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
`;

const LockoutMsg = styled.p`
    color: var(--phosphor);
    letter-spacing: 0.1em;
`;

const RetryButton = styled.button`
    background: transparent;
    border: 1px solid var(--phosphor);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0.5rem 1.4rem;
    cursor: pointer;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }
`;

// Split out so the bio typewriter starts when the record is revealed,
// not while the security gate is still up.
const PersonnelRecord = () => {
    const { output } = useTypewriter(personal.bio, 90);
    // The selected section drives both its description and the portrait.
    const [activeIdx, setActiveIdx] = useState(0);

    const active = journey[activeIdx] || journey[0];
    const captureSrc = active.image || personal.portrait;

    // If a timeline photo hasn't been added yet, fall back to the default
    // portrait rather than showing a broken image.
    const handleImgError = (e) => {
        if (e.currentTarget.src.indexOf(personal.portrait) === -1) {
            e.currentTarget.src = personal.portrait;
        }
    };

    return (
        <ScreenFrame title="PERSONNEL FILE">
            <SectionTitle>{'// IDENTIFICATION'}</SectionTitle>
            <p>DESIGNATION: TEST SUBJECT #TN-{personal.established} · RECORDED ALIAS: {personal.name} · CLASSIFICATION: {personal.role} · STATUS: AT LARGE</p>
            <Bio>{output}█</Bio>

            <JourneyGrid>
                {/* selector lives first so the mobile single-column order puts
                    the horizontal log strip above the capture card */}
                <div>
                    <SectionTitle>{'// OBSERVATION LOG'}</SectionTitle>
                    <Timeline role="group" aria-label="observation log captures">
                        {journey.map((entry, idx) => {
                            const isActive = idx === activeIdx;
                            return (
                                <EntryRow
                                    key={entry.title}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => setActiveIdx(idx)}
                                >
                                    <Marker>{String(idx + 1).padStart(2, '0')}</Marker>
                                    <EntryTitle>{entry.title}</EntryTitle>
                                    <Indicator aria-hidden="true">{isActive ? '[◉]' : '[ ]'}</Indicator>
                                </EntryRow>
                            );
                        })}
                    </Timeline>
                </div>
                <PortraitPanel>
                    <PortraitCaption>{`// CAPTURE ${activeIdx + 1} / ${journey.length}`}</PortraitCaption>
                    <PortraitFrame>
                        <PortraitImg
                            key={activeIdx}
                            src={captureSrc}
                            alt={active.title}
                            onError={handleImgError}
                            loading="lazy"
                        />
                        <PortraitScanlines />
                    </PortraitFrame>
                    <DescBox>
                        <DescTitle>{active.title}</DescTitle>
                        <DescNote>{active.note}</DescNote>
                        <DescBody>{active.body}</DescBody>
                    </DescBox>
                </PortraitPanel>
            </JourneyGrid>
        </ScreenFrame>
    );
};

const PersonnelFile = () => {
    usePageMeta('PERSONNEL FILE', 'Tanmai Niranjan — the journey so far.');
    // Unlock state is intentionally NOT persisted — the record re-locks on
    // every visit, dealing a fresh access code each time.
    const [unlocked, setUnlocked] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const [lockedOut, setLockedOut] = useState(false);
    const [gameKey, setGameKey] = useState(0);

    // On a successful bypass, play the lock-open animation first; the record
    // is only revealed once that animation reports back.
    const handleWin = useCallback(() => {
        setRevealing(true);
    }, []);

    const handleRevealDone = useCallback(() => {
        setUnlocked(true);
    }, []);

    const handleLockout = useCallback(() => {
        setLockedOut(true);
    }, []);

    const handleRetry = useCallback(() => {
        setLockedOut(false);
        setGameKey((k) => k + 1);
    }, []);

    if (unlocked) {
        return <PersonnelRecord />;
    }

    if (revealing) {
        return (
            <ScreenFrame title="SECURITY LAYER">
                <LockReveal onComplete={handleRevealDone} />
            </ScreenFrame>
        );
    }

    return (
        <ScreenFrame title="SECURITY LAYER">
            <Intro>
                {`PERSONNEL FILE FOR ${personal.designation} IS CLASSIFIED. BYPASS SECURITY TO VIEW THE RECORD. ${hackGame.attempts} ATTEMPTS BEFORE LOCKOUT.`}
            </Intro>
            <RotationNotice>
                {'SECURITY ROTATES CIPHERS AFTER EVERY SESSION. PREVIOUS BYPASSES VOID.'}
            </RotationNotice>
            {lockedOut ? (
                <LockoutBlock>
                    <LockoutMsg>{'> TERMINAL LOCKED — INTRUSION LOGGED.'}</LockoutMsg>
                    <RetryButton type="button" onClick={handleRetry}>[ RETRY ]</RetryButton>
                </LockoutBlock>
            ) : (
                <HackMinigame
                    key={gameKey}
                    onWin={handleWin}
                    onLockout={handleLockout}
                />
            )}
        </ScreenFrame>
    );
};

export default PersonnelFile;
