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

// Mock localStorage for tests
const localStorageMock = {
    getItem: (key) => localStorage[key] ?? null,
    setItem: (key, value) => {
        localStorage[key] = value.toString();
    },
    removeItem: (key) => {
        delete localStorage[key];
    },
    clear: () => {
        Object.keys(localStorage).forEach((key) => {
            delete localStorage[key];
        });
    },
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

// Initialize localStorage as an object
Object.defineProperty(window, 'localStorage', {
    value: {
        _data: {},
        getItem(key) {
            return this._data[key] ?? null;
        },
        setItem(key, value) {
            this._data[key] = value.toString();
        },
        removeItem(key) {
            delete this._data[key];
        },
        clear() {
            this._data = {};
        },
    },
    writable: true,
});
