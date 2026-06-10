import '@testing-library/jest-dom';

// jsdom has no matchMedia; components query prefers-reduced-motion
window.matchMedia = window.matchMedia || ((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
}));
