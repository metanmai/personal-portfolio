import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainMenu from './MainMenu.jsx';
import { menuItems } from '../../constants/index.js';

const LocationProbe = () => <div data-testid="loc">{useLocation().pathname}</div>;

const renderMenu = () =>
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="*" element={<LocationProbe />} />
            </Routes>
        </MemoryRouter>
    );

describe('MainMenu', () => {
    it('renders every menu item', () => {
        renderMenu();
        menuItems.forEach(({ label }) => {
            expect(screen.getByText(new RegExp(label))).toBeInTheDocument();
        });
    });

    it('navigates when a number key is pressed', async () => {
        renderMenu();
        await userEvent.keyboard('2');
        expect(screen.getByTestId('loc')).toHaveTextContent(menuItems[1].path);
    });

    it('navigates with arrow keys + Enter', async () => {
        renderMenu();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
        expect(screen.getByTestId('loc')).toHaveTextContent(menuItems[2].path);
    });

    it('navigates on click', async () => {
        renderMenu();
        await userEvent.click(screen.getByText(new RegExp(menuItems[3].label)));
        expect(screen.getByTestId('loc')).toHaveTextContent(menuItems[3].path);
    });
});
