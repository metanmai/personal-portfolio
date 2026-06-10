import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import HackMinigame from './HackMinigame.jsx';

// Each digit is generated via Math.floor(Math.random() * 10).
// random=0 -> 0, random=0.15 -> 1, etc. Use 0.05 buckets so we land
// safely inside each digit's slot.
const digitToRandom = (d) => d * 0.1 + 0.05;
const queueRandomDigits = (digits) => {
    const seq = digits.split('').map((d) => digitToRandom(Number(d)));
    let i = 0;
    return vi.spyOn(Math, 'random').mockImplementation(() => {
        const v = seq[i % seq.length];
        i += 1;
        return v;
    });
};

const setMathRandomSequence = (codes) => {
    // Flatten an array of codes into a single sequence so the spy
    // returns digits in order across multiple code generations.
    const all = codes.join('');
    return queueRandomDigits(all);
};

describe('HackMinigame (CODE INTERCEPT)', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('shows a 5-digit code during memorize then masks it after the countdown', () => {
        setMathRandomSequence(['73194']);
        render(<HackMinigame onWin={vi.fn()} />);

        // Big code visible.
        expect(screen.getByLabelText('intercepted-code')).toHaveTextContent('7 3 1 9 4');
        expect(screen.getByText(/MEMORIZE — BURNS IN 4 SECONDS/)).toBeInTheDocument();

        // Tick the countdown to zero.
        act(() => {
            vi.advanceTimersByTime(4000);
        });

        // Code is masked, entry prompt visible.
        expect(screen.getByLabelText('intercepted-code')).toHaveTextContent('█ █ █ █ █');
        expect(screen.getByText('ENTER ACCESS CODE:')).toBeInTheDocument();
        expect(screen.getByLabelText('access-code')).toBeInTheDocument();
    });

    it('calls onWin when the correct code is entered', () => {
        setMathRandomSequence(['12345']);
        const onWin = vi.fn();
        render(<HackMinigame onWin={onWin} />);

        act(() => { vi.advanceTimersByTime(4000); });

        const input = screen.getByLabelText('access-code');
        fireEvent.change(input, { target: { value: '12345' } });
        fireEvent.click(screen.getByRole('button', { name: /TRANSMIT/ }));

        expect(onWin).toHaveBeenCalledTimes(1);
        expect(screen.getByText('ACCESS GRANTED')).toBeInTheDocument();
    });

    it('on a wrong code, shows CODE MISMATCH, decrements attempts, and presents a fresh memorize phase', () => {
        setMathRandomSequence(['12345', '67890']);
        render(<HackMinigame onWin={vi.fn()} />);

        // Initial state: 3 attempts blocks filled.
        expect(screen.getByText(/ATTEMPTS REMAINING:.*▮ ▮ ▮/)).toBeInTheDocument();

        // Burn first code.
        act(() => { vi.advanceTimersByTime(4000); });

        // Wrong entry.
        const input = screen.getByLabelText('access-code');
        fireEvent.change(input, { target: { value: '99999' } });
        fireEvent.click(screen.getByRole('button', { name: /TRANSMIT/ }));

        // One attempt depleted; back to memorize with NEW code visible.
        expect(screen.getByText(/ATTEMPTS REMAINING:.*▮ ▮ ▯/)).toBeInTheDocument();
        expect(screen.getByText(/CODE MISMATCH — NEW CODE INTERCEPTED/)).toBeInTheDocument();
        expect(screen.getByText(/MEMORIZE — BURNS IN 4 SECONDS/)).toBeInTheDocument();
        expect(screen.getByLabelText('intercepted-code')).toHaveTextContent('6 7 8 9 0');
    });

    it('calls onLockout after three wrong codes', () => {
        setMathRandomSequence(['11111', '22222', '33333']);
        const onWin = vi.fn();
        const onLockout = vi.fn();
        render(<HackMinigame onWin={onWin} onLockout={onLockout} />);

        for (let i = 0; i < 3; i += 1) {
            act(() => { vi.advanceTimersByTime(4000); });
            const input = screen.getByLabelText('access-code');
            fireEvent.change(input, { target: { value: '00000' } });
            fireEvent.click(screen.getByRole('button', { name: /TRANSMIT/ }));
        }

        expect(onLockout).toHaveBeenCalledTimes(1);
        expect(onWin).not.toHaveBeenCalled();
    });
});
