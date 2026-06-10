import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from './settings.jsx';

const Probe = () => {
    const { settings, update } = useSettings();
    return (
        <div>
            <span data-testid="theme">{settings.theme}</span>
            <span data-testid="sound">{String(settings.sound)}</span>
            <button onClick={() => update({ theme: 'amber' })}>go amber</button>
            <button onClick={() => update({ sound: true })}>enable sound</button>
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

    it('defaults sound to false', () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('sound')).toHaveTextContent('false');
    });

    it('updates and persists sound to localStorage', async () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        await userEvent.click(screen.getByText('enable sound'));
        expect(screen.getByTestId('sound')).toHaveTextContent('true');
        expect(JSON.parse(localStorage.getItem('termlink-settings')).sound).toBe(true);
    });
});
