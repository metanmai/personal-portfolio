// Real device-spec detection for the boot sequence.
// Everything wraps risky browser-API calls so the function never throws.

const LEFT_SEGMENT_WIDTH = 28;

export const padLine = (label, value) => {
    const upperLabel = String(label).toUpperCase();
    const upperValue = String(value).toUpperCase();
    // Long-label safety: if label can't fit a "LABEL " + dots structure, just use a single dot.
    if (upperLabel.length > 26) {
        return `${upperLabel} . ${upperValue}`;
    }
    const dotCount = LEFT_SEGMENT_WIDTH - upperLabel.length - 1;
    const dots = '.'.repeat(dotCount);
    return `${upperLabel} ${dots} ${upperValue}`;
};

export const getRegion = () => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!tz || typeof tz !== 'string') return 'UNKNOWN';
        return tz.toUpperCase();
    } catch {
        return 'UNKNOWN';
    }
};

export const getBrowserName = () => {
    try {
        if (typeof navigator === 'undefined') return 'UNKNOWN AGENT';
        // Prefer userAgentData.brands — pick the last meaningful brand
        // (skip the spec's "Not?A_Brand" / "Not A;Brand" / "Not.A/Brand" greasers).
        const brands = navigator.userAgentData?.brands;
        if (Array.isArray(brands) && brands.length > 0) {
            const meaningful = brands.filter(
                (b) => b && typeof b.brand === 'string' && !/not.?a.?brand/i.test(b.brand),
            );
            if (meaningful.length > 0) {
                const last = meaningful[meaningful.length - 1].brand;
                if (last) return String(last).toUpperCase();
            }
        }

        // Fallback: UA-string sniff. Order matters — Edge UA includes "Chrome",
        // Chrome UA includes "Safari", so check the most specific brands first.
        const ua = String(navigator.userAgent || '');
        if (/Edg\//i.test(ua)) return 'EDGE';
        if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'OPERA';
        if (/Firefox\//i.test(ua)) return 'FIREFOX';
        if (/Chrome\//i.test(ua)) return 'CHROME';
        if (/Safari\//i.test(ua)) return 'SAFARI';
        return 'UNKNOWN AGENT';
    } catch {
        return 'UNKNOWN AGENT';
    }
};

const safe = (fn, fallback) => {
    try {
        const v = fn();
        if (v === undefined || v === null || v === '') return fallback;
        return v;
    } catch {
        return fallback;
    }
};

const detectGpu = () => {
    try {
        if (typeof document === 'undefined') return 'CLASSIFIED';
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'CLASSIFIED';
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (!ext) return 'CLASSIFIED';
        const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        if (!renderer) return 'CLASSIFIED';
        // raw strings can be huge, e.g. "ANGLE (Google, Vulkan 1.3.0 (SwiftShader...))"
        const name = String(renderer);
        return name.length > 48 ? `${name.slice(0, 48)}…` : name;
    } catch {
        return 'CLASSIFIED';
    }
};

export const getDeviceSpecLines = () => {
    const lines = [];

    const cpu = safe(() => {
        const n = navigator.hardwareConcurrency;
        return typeof n === 'number' && n > 0 ? `${n} CORES DETECTED` : null;
    }, 'UNKNOWN');
    lines.push(padLine('CPU', cpu));

    const mem = safe(() => {
        const n = navigator.deviceMemory;
        return typeof n === 'number' && n > 0 ? `${n} GB MODULES OK` : null;
    }, 'UNDISCLOSED');
    lines.push(padLine('MEMORY', mem));

    const display = safe(() => {
        const w = screen.width;
        const h = screen.height;
        const dpr = window.devicePixelRatio || 1;
        if (!w || !h) return null;
        return `${w}X${h} @ ${dpr}X`;
    }, 'UNKNOWN');
    lines.push(padLine('DISPLAY', display));

    const gpu = safe(() => detectGpu(), 'CLASSIFIED');
    lines.push(padLine('GPU', gpu));

    const platform = safe(
        () => navigator.userAgentData?.platform || navigator.platform || null,
        'UNKNOWN',
    );
    lines.push(padLine('PLATFORM', platform));

    const uplink = safe(
        () => navigator.connection?.effectiveType?.toUpperCase() || null,
        'STABLE',
    );
    lines.push(padLine('UPLINK', uplink));

    const lang = safe(() => navigator.language || null, 'UNKNOWN');
    lines.push(padLine('LANGUAGE', lang));

    return lines;
};
