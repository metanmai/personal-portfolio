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
        await userEvent.click(screen.getByRole('button', { name: /OFF/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).scanlines).toBe('off');
    });
});
