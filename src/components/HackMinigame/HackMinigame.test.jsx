import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HackMinigame from './HackMinigame.jsx';
import { hackGame } from '../../constants/index.js';

describe('HackMinigame', () => {
    beforeEach(() => {
        // Deterministic secret = words[0] = 'GRANTED'
        vi.spyOn(Math, 'random').mockReturnValue(0);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders all 12 candidate words as buttons', () => {
        const onWin = vi.fn();
        render(<HackMinigame onWin={onWin} />);
        hackGame.words.forEach((w) => {
            expect(screen.getByRole('button', { name: w })).toBeInTheDocument();
        });
    });

    it('calls onWin when the secret word is clicked', async () => {
        const user = userEvent.setup();
        const onWin = vi.fn();
        render(<HackMinigame onWin={onWin} />);
        await user.click(screen.getByRole('button', { name: 'GRANTED' }));
        expect(onWin).toHaveBeenCalledTimes(1);
    });

    it('logs ENTRY DENIED with LIKENESS and decrements attempts on a wrong guess', async () => {
        const user = userEvent.setup();
        const onWin = vi.fn();
        render(<HackMinigame onWin={onWin} />);
        // Before any guess, all attempts blocks are filled.
        expect(screen.getByText(/ATTEMPTS REMAINING:.*▮ ▮ ▮ ▮/)).toBeInTheDocument();
        // JOURNEY vs GRANTED → likeness = 0
        await user.click(screen.getByRole('button', { name: 'JOURNEY' }));
        expect(screen.getByText('> JOURNEY')).toBeInTheDocument();
        expect(screen.getByText('> ENTRY DENIED')).toBeInTheDocument();
        expect(screen.getByText(/^> LIKENESS=\d+$/)).toBeInTheDocument();
        // One block depleted
        expect(screen.getByText(/ATTEMPTS REMAINING:.*▮ ▮ ▮ ▯/)).toBeInTheDocument();
        expect(onWin).not.toHaveBeenCalled();
    });

    it('calls onLockout after 4 wrong guesses', async () => {
        const user = userEvent.setup();
        const onWin = vi.fn();
        const onLockout = vi.fn();
        render(<HackMinigame onWin={onWin} onLockout={onLockout} />);
        const wrongWords = hackGame.words.filter((w) => w !== 'GRANTED').slice(0, 4);
        for (const w of wrongWords) {
            await user.click(screen.getByRole('button', { name: w }));
        }
        expect(onLockout).toHaveBeenCalledTimes(1);
        expect(onWin).not.toHaveBeenCalled();
    });
});
