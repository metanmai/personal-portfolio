import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import HackMinigame from './HackMinigame.jsx';

// Deterministic puzzle injected via the test seam: password VAULT, four duds,
// one "replenish" bracket (b0) and one "dud" bracket (b1).
const makePuzzle = () => ({
    password: 'VAULT',
    words: [
        { id: 'w0', text: 'VAULT' },
        { id: 'w1', text: 'CODES' },
        { id: 'w2', text: 'LOCKS' },
        { id: 'w3', text: 'BYTES' },
        { id: 'w4', text: 'CORES' },
    ],
    columns: [
        [
            { addr: '0x8000', segs: [{ type: 'junk', text: '##' }, { type: 'word', id: 'w0', text: 'VAULT' }] },
            { addr: '0x800C', segs: [{ type: 'word', id: 'w1', text: 'CODES' }] },
            { addr: '0x8018', segs: [{ type: 'word', id: 'w2', text: 'LOCKS' }] },
            { addr: '0x8024', segs: [{ type: 'bracket', id: 'b0', text: '<#>', effect: 'replenish' }] },
        ],
        [
            { addr: '0x8030', segs: [{ type: 'word', id: 'w3', text: 'BYTES' }] },
            { addr: '0x803C', segs: [{ type: 'word', id: 'w4', text: 'CORES' }] },
            { addr: '0x8048', segs: [{ type: 'bracket', id: 'b1', text: '(#)', effect: 'dud' }] },
        ],
    ],
});

describe('HackMinigame (ICE BREACH)', () => {
    it('renders the protocol rules and a full attempts bar', () => {
        render(<HackMinigame onWin={vi.fn()} initialPuzzle={makePuzzle()} />);
        expect(screen.getByText(/ICE BREACH PROTOCOL/)).toBeInTheDocument();
        // 4 attempts, all filled
        expect(screen.getByText(/ATTEMPTS:\s*▮ ▮ ▮ ▮/)).toBeInTheDocument();
    });

    it('calls onWin when the password is selected', () => {
        const onWin = vi.fn();
        render(<HackMinigame onWin={onWin} initialPuzzle={makePuzzle()} />);

        fireEvent.click(screen.getByRole('button', { name: 'VAULT' }));

        expect(onWin).toHaveBeenCalledTimes(1);
        expect(screen.getByText('ACCESS GRANTED')).toBeInTheDocument();
    });

    it('reports likeness and decrements attempts on a wrong guess', () => {
        const onWin = vi.fn();
        render(<HackMinigame onWin={onWin} initialPuzzle={makePuzzle()} />);

        fireEvent.click(screen.getByRole('button', { name: 'CODES' }));

        expect(onWin).not.toHaveBeenCalled();
        const logEl = screen.getByLabelText('breach log');
        // CODES vs VAULT share no positions -> 0/5
        expect(within(logEl).getByText(/ENTRY DENIED · LIKENESS 0\/5/)).toBeInTheDocument();
        expect(screen.getByText(/ATTEMPTS:\s*▮ ▮ ▮ ▯/)).toBeInTheDocument();
    });

    it('replenish bracket restores attempts', () => {
        render(<HackMinigame onWin={vi.fn()} initialPuzzle={makePuzzle()} />);

        fireEvent.click(screen.getByRole('button', { name: 'CODES' })); // -> 3 left
        expect(screen.getByText(/ATTEMPTS:\s*▮ ▮ ▮ ▯/)).toBeInTheDocument();

        const brackets = screen.getAllByRole('button', { name: 'bonus bracket' });
        fireEvent.click(brackets[0]); // b0 = replenish

        const logEl = screen.getByLabelText('breach log');
        expect(within(logEl).getByText(/ALLOWANCE REPLENISHED/)).toBeInTheDocument();
        expect(screen.getByText(/ATTEMPTS:\s*▮ ▮ ▮ ▮/)).toBeInTheDocument();
    });

    it('dud bracket removes a dud', () => {
        render(<HackMinigame onWin={vi.fn()} initialPuzzle={makePuzzle()} />);
        const brackets = screen.getAllByRole('button', { name: 'bonus bracket' });
        fireEvent.click(brackets[1]); // b1 = dud
        const logEl = screen.getByLabelText('breach log');
        expect(within(logEl).getByText(/DUD REMOVED/)).toBeInTheDocument();
    });

    it('locks out after exhausting attempts on wrong guesses', () => {
        const onWin = vi.fn();
        const onLockout = vi.fn();
        render(<HackMinigame onWin={onWin} onLockout={onLockout} initialPuzzle={makePuzzle()} />);

        ['CODES', 'LOCKS', 'BYTES', 'CORES'].forEach((w) => {
            fireEvent.click(screen.getByRole('button', { name: w }));
        });

        expect(onLockout).toHaveBeenCalledTimes(1);
        expect(onWin).not.toHaveBeenCalled();
        expect(screen.getByText('TERMINAL LOCKED')).toBeInTheDocument();
    });
});
