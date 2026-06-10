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
Object.defineProperty(window, 'localStorage', {
    value: {
        _data: {},
        getItem(key) {
            return this._data[key] ?? null;
        },
        setItem(key, value) {
            this._data[key] = String(value);
        },
        removeItem(key) {
            delete this._data[key];
        },
        clear() {
            this._data = {};
        },
        key(index) {
            return Object.keys(this._data)[index] ?? null;
        },
        get length() {
            return Object.keys(this._data).length;
        },
    },
    writable: true,
});
