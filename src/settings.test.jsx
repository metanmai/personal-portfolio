import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from './settings.jsx';

const Probe = () => {
    const { settings, update } = useSettings();
    return (
        <div>
            <span data-testid="theme">{settings.theme}</span>
            <button onClick={() => update({ theme: 'green' })}>go green</button>
        </div>
    );
};

describe('SettingsProvider', () => {
    beforeEach(() => localStorage.clear());

    it('defaults to amber theme', () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('amber');
    });

    it('updates and persists to localStorage', async () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        await userEvent.click(screen.getByText('go green'));
        expect(screen.getByTestId('theme')).toHaveTextContent('green');
        expect(JSON.parse(localStorage.getItem('termlink-settings')).theme).toBe('green');
    });

    it('hydrates from localStorage', () => {
        localStorage.setItem('termlink-settings', JSON.stringify({ theme: 'green' }));
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('green');
    });
});
