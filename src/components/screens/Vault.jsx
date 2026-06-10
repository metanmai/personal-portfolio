import { useState, useCallback } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import HackMinigame from '../HackMinigame/HackMinigame.jsx';
import { hackGame, vaultEntries } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const SESSION_KEY = 'termlink-vault-unlocked';

const Intro = styled.p`
    color: var(--dim);
    margin-bottom: 1.5rem;
    line-height: 1.6;
`;

const Header = styled.p`
    color: var(--dim);
    margin-bottom: 1.5rem;
    letter-spacing: 0.1em;
`;

const EntriesList = styled.ol`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    counter-reset: vault-entry;
`;

const Entry = styled.li`
    border: 1px solid var(--dim);
    padding: 1.2rem 1.4rem;
    counter-increment: vault-entry;
    line-height: 1.6;

    &::before {
        content: 'ENTRY ' counter(vault-entry, decimal-leading-zero) ' / CLASSIFIED';
        display: block;
        color: var(--dim);
        font-size: 0.85em;
        letter-spacing: 0.15em;
        margin-bottom: 0.6rem;
    }
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

const readUnlocked = () => {
    try {
        return typeof sessionStorage !== 'undefined'
            && sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
        return false;
    }
};

const Vault = () => {
    usePageMeta('VAULT', 'Classified entries — eyes only.');
    const [unlocked, setUnlocked] = useState(readUnlocked);
    const [lockedOut, setLockedOut] = useState(false);
    const [gameKey, setGameKey] = useState(0);

    const handleWin = useCallback(() => {
        try {
            sessionStorage.setItem(SESSION_KEY, 'true');
        } catch {
            // sessionStorage can throw in privacy modes — proceed anyway.
        }
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
        return (
            <ScreenFrame title="THE VAULT">
                <Header>{'>> SECURITY BYPASSED — EYES ONLY <<'}</Header>
                <EntriesList>
                    {vaultEntries.map((entry, i) => (
                        <Entry key={i}>{entry}</Entry>
                    ))}
                </EntriesList>
            </ScreenFrame>
        );
    }

    return (
        <ScreenFrame title="SECURITY LAYER">
            <Intro>
                {`UNAUTHORIZED ACCESS DETECTED. BYPASS SECURITY TO PROCEED. ${hackGame.attempts} ATTEMPTS BEFORE LOCKOUT.`}
            </Intro>
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

export default Vault;
