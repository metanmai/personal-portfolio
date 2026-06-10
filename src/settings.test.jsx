import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from './settings.jsx';

const Probe = () => {
    const { settings, update } = useSettings();
    return (
        <div>
            <span data-testid="theme">{settings.theme}</span>
            <button onClick={() => update({ theme: 'amber' })}>go amber</button>
        </div>
    );
};

describe('SettingsProvider', () => {
    beforeEach(() => localStorage.clear());

    it('defaults to green theme', () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('green');
    });

    it('updates and persists to localStorage', async () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        await userEvent.click(screen.getByText('go amber'));
        expect(screen.getByTestId('theme')).toHaveTextContent('amber');
        expect(JSON.parse(localStorage.getItem('termlink-settings')).theme).toBe('amber');
    });

    it('hydrates from localStorage', () => {
        localStorage.setItem('termlink-settings', JSON.stringify({ theme: 'amber' }));
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('amber');
    });
});
