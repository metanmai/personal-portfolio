import { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import { reducedMotion } from '../utils/reducedMotion.js';

// Centered padlock that pops open when the personnel security gate is bypassed.
// Holds locked briefly, swings the shackle open, beats a short pause, then
// hands control back to the caller (which swaps in the unlocked record).

const flash = keyframes`
    0%   { opacity: 0; transform: scale(0.96); filter: brightness(0.6); }
    55%  { opacity: 1; transform: scale(1.04); filter: brightness(1.7); }
    100% { opacity: 1; transform: scale(1); filter: brightness(1.3); }
`;

const Stage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.6rem;
    min-height: 44vh;
    padding: 2.5rem 0;
`;

const Lock = styled.div`
    position: relative;
    width: 110px;
    height: 144px;
    /* depth so the shackle's rotateY reads as a real 3D swing, not a squish */
    perspective: 700px;
`;

// Two-phase open: a small rise (legs stay seated in the body, so the shackle
// never visibly detaches), then a full 180° spin about a vertical axis (rotateY)
// hinged on the left leg — like a padlock shackle pivoting all the way around.
const unlockSwing = keyframes`
    0%   { transform: translateY(0) rotateY(0deg); }
    30%  { transform: translateY(-6px) rotateY(0deg); }
    100% { transform: translateY(-6px) rotateY(180deg); }
`;

// The shackle is an open-bottomed arch whose legs slot down into the body.
// It sits BEHIND the (opaque) body, so the inserted portion is hidden.
const Shackle = styled.div`
    position: absolute;
    top: 6px;
    left: 50%;
    width: 56px;
    height: 66px;
    margin-left: -28px;
    border: 9px solid var(--phosphor);
    border-bottom: none;
    border-radius: 28px 28px 0 0;
    box-shadow: 0 0 10px var(--glow);
    /* vertical hinge line down the left leg */
    transform-origin: 9px center;
    z-index: 0;

    ${({ $open }) => $open && css`
        animation: ${unlockSwing} 0.9s cubic-bezier(0.45, 0.05, 0.3, 1) forwards;
    `}

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        ${({ $open }) => $open && css`
            transform: translateY(-6px) rotateY(180deg);
        `}
    }
`;

// Opaque fill so the shackle legs behind it are properly occluded (they used
// to ghost through a translucent body).
const Body = styled.div`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 100px;
    height: 86px;
    margin-left: -50px;
    border: 3px solid var(--phosphor);
    border-radius: 12px;
    background: var(--bg);
    box-shadow: 0 0 14px var(--glow), inset 0 0 18px color-mix(in srgb, var(--phosphor) 14%, transparent);
    z-index: 1;
`;

const Keyhole = styled.div`
    position: absolute;
    top: 30px;
    left: 50%;
    width: 14px;
    height: 14px;
    margin-left: -7px;
    border-radius: 50%;
    background: var(--bg);
    box-shadow: inset 0 0 0 2px var(--phosphor);

    &::after {
        content: '';
        position: absolute;
        top: 11px;
        left: 50%;
        width: 6px;
        height: 16px;
        margin-left: -3px;
        background: var(--bg);
        box-shadow: inset 0 0 0 2px var(--phosphor);
    }
`;

const Status = styled.p`
    color: var(--phosphor);
    letter-spacing: 0.18em;
    text-shadow: 0 0 10px var(--glow);
    margin: 0;
    min-height: 1.2em;

    ${({ $show }) => ($show
        ? css`animation: ${flash} 0.5s ease-out both;`
        : css`opacity: 0;`)}

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: ${({ $show }) => ($show ? 1 : 0)};
    }
`;

const LockReveal = ({ onComplete }) => {
    const [open, setOpen] = useState(false);
    const doneRef = useRef(false);

    useEffect(() => {
        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            onComplete();
        };

        if (reducedMotion()) {
            setOpen(true);
            const t = setTimeout(finish, 600);
            return () => clearTimeout(t);
        }

        const openAt = setTimeout(() => setOpen(true), 600); // brief locked hold
        const finishAt = setTimeout(finish, 2200); // open + pause, then reveal
        return () => {
            clearTimeout(openAt);
            clearTimeout(finishAt);
        };
    }, [onComplete]);

    return (
        <Stage role="status" aria-label="Bypassing security">
            <Lock>
                <Shackle $open={open} />
                <Body>
                    <Keyhole />
                </Body>
            </Lock>
            <Status $show={open}>{'> ACCESS GRANTED — DECRYPTING RECORD'}</Status>
        </Stage>
    );
};

LockReveal.propTypes = {
    onComplete: PropTypes.func.isRequired,
};

export default LockReveal;
