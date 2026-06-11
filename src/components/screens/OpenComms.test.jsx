import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import OpenComms from './OpenComms.jsx';

const fillAndSubmit = async () => {
    await userEvent.type(screen.getByLabelText(/CALLSIGN/i), 'Vault Dweller');
    await userEvent.type(screen.getByLabelText(/RETURN FREQUENCY/i), 'dweller@vault.com');
    await userEvent.type(screen.getByLabelText(/SUBJECT/i), 'Hello');
    await userEvent.type(screen.getByLabelText(/MESSAGE/i), 'GECK located.');
    await userEvent.click(screen.getByRole('button', { name: /TRANSMIT/i }));
};

describe('OpenComms', () => {
    beforeEach(() => vi.restoreAllMocks());

    it('posts the form and shows success output', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
        render(<MemoryRouter><OpenComms /></MemoryRouter>);
        await fillAndSubmit();
        expect(fetch).toHaveBeenCalledWith('/', expect.objectContaining({
            method: 'POST',
        }));
        expect(await screen.findByText(/TRANSMISSION SENT/)).toBeInTheDocument();
    });

    it('shows relay failure output when the request fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        render(<MemoryRouter><OpenComms /></MemoryRouter>);
        await fillAndSubmit();
        expect(await screen.findByText(/RELAY FAILURE/)).toBeInTheDocument();
    });

    it('rejects submission with empty callsign without calling fetch', async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: true });
        vi.stubGlobal('fetch', fetchMock);
        render(<MemoryRouter><OpenComms /></MemoryRouter>);
        await userEvent.type(screen.getByLabelText(/RETURN FREQUENCY/i), 'dweller@vault.com');
        await userEvent.type(screen.getByLabelText(/SUBJECT/i), 'Hello');
        await userEvent.type(screen.getByLabelText(/MESSAGE/i), 'GECK located.');
        await userEvent.click(screen.getByRole('button', { name: /TRANSMIT/i }));
        expect(await screen.findByText(/TRANSMISSION REJECTED/)).toBeInTheDocument();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
