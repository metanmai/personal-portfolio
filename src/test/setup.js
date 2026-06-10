import '@testing-library/jest-dom';

if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}
