import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import CommandPrompt from './CommandPrompt.jsx';
import { SettingsProvider } from '../../settings.jsx';

const LocationProbe = () => (
    <div data-testid="loc">{useLocation().pathname}</div>
);

const Stub = ({ name }) => <div>STUB:{name}</div>;
Stub.propTypes = { name: PropTypes.string.isRequired };

const renderPrompt = (initial = '/') =>
    render(
        <SettingsProvider>
            <MemoryRouter initialEntries={[initial]}>
                <LocationProbe />
                <Routes>
                    <Route path="/" element={<Stub name="home" />} />
                    <Route path="/personnel" element={<Stub name="personnel" />} />
                    <Route path="/career" element={<Stub name="career" />} />
                    <Route path="/recreation" element={<Stub name="recreation" />} />
                    <Route path="/comms" element={<Stub name="comms" />} />
                    <Route path="/holotapes" element={<Stub name="holotapes" />} />
                    <Route path="/monitor" element={<Stub name="monitor" />} />
                    <Route path="/vault" element={<Stub name="vault" />} />
                </Routes>
                <CommandPrompt />
            </MemoryRouter>
        </SettingsProvider>
    );

describe('CommandPrompt', () => {
    it('opens with Ctrl+K and closes with Esc without changing route', async () => {
        const user = userEvent.setup();
        renderPrompt('/career');

        // not open yet
        expect(screen.queryByTestId('cmd-input')).not.toBeInTheDocument();

        await user.keyboard('{Control>}k{/Control}');
        expect(screen.getByTestId('cmd-input')).toBeInTheDocument();

        await user.keyboard('{Escape}');
        expect(screen.queryByTestId('cmd-input')).not.toBeInTheDocument();
        // route untouched
        expect(screen.getByTestId('loc')).toHaveTextContent('/career');
    });

    it('help lists whoami and whoami echoes GUEST', async () => {
        const user = userEvent.setup();
        renderPrompt('/');

        await user.keyboard('{Control>}k{/Control}');
        const input = screen.getByTestId('cmd-input');

        await user.type(input, 'help{Enter}');
        const output = screen.getByTestId('cmd-output');
        expect(within(output).getByText(/WHOAMI/)).toBeInTheDocument();

        await user.type(input, 'whoami{Enter}');
        expect(within(output).getByText(/OPERATOR: GUEST/)).toBeInTheDocument();
    });

    it('open career navigates to /career', async () => {
        const user = userEvent.setup();
        renderPrompt('/');

        await user.keyboard('{Control>}k{/Control}');
        await user.type(screen.getByTestId('cmd-input'), 'open career{Enter}');

        expect(screen.getByTestId('loc')).toHaveTextContent('/career');
    });

    it('clicking [X] close button closes the prompt', async () => {
        const user = userEvent.setup();
        renderPrompt('/');

        await user.keyboard('{Control>}k{/Control}');
        expect(screen.getByTestId('cmd-input')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: /close prompt/i }));
        expect(screen.queryByTestId('cmd-input')).not.toBeInTheDocument();
    });

    it('sudo prints PERMISSION DENIED and helpp suggests HELP', async () => {
        const user = userEvent.setup();
        renderPrompt('/');

        await user.keyboard('{Control>}k{/Control}');
        const input = screen.getByTestId('cmd-input');

        await user.type(input, 'sudo make-me-a-sandwich{Enter}');
        const output = screen.getByTestId('cmd-output');
        expect(within(output).getByText(/PERMISSION DENIED: NICE TRY\./)).toBeInTheDocument();

        await user.type(input, 'helpp{Enter}');
        expect(within(output).getByText(/DID YOU MEAN: HELP\?/)).toBeInTheDocument();
    });
});
