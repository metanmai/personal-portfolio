import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsProvider } from '../../settings.jsx';
import Calibration from './Calibration.jsx';

const renderScreen = () =>
    render(
        <MemoryRouter>
            <SettingsProvider>
                <Calibration />
            </SettingsProvider>
        </MemoryRouter>
    );

describe('Calibration', () => {
    beforeEach(() => localStorage.clear());

    it('switches phosphor theme', async () => {
        renderScreen();
        await userEvent.click(screen.getByRole('button', { name: /GREEN/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).theme).toBe('green');
        expect(document.documentElement.dataset.theme).toBe('green');
    });

    it('switches scanline intensity', async () => {
        renderScreen();
        const scanlineOff = screen.getAllByRole('button', { name: /OFF/ })[0];
        await userEvent.click(scanlineOff);
        expect(JSON.parse(localStorage.getItem('termlink-settings')).scanlines).toBe('off');
    });

    it('selects X-LARGE text size', async () => {
        renderScreen();
        await userEvent.click(screen.getByRole('button', { name: /X-LARGE/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).fontScale).toBe(1.3);
    });

    it('switches boot to QUICK', async () => {
        renderScreen();
        await userEvent.click(screen.getByRole('button', { name: /^QUICK$/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).boot).toBe('quick');
    });

    it('restores defaults', async () => {
        renderScreen();
        await userEvent.click(screen.getByRole('button', { name: /GREEN/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).theme).toBe('green');
        await userEvent.click(screen.getByRole('button', { name: /RESTORE DEFAULTS/ }));
        const stored = JSON.parse(localStorage.getItem('termlink-settings'));
        expect(stored).toEqual({
            theme: 'amber',
            scanlines: 'full',
            fontScale: 1,
            sweep: true,
            boot: 'full',
        });
    });
});
