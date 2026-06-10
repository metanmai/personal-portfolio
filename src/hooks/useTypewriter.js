import { useEffect, useRef, useState } from 'react';

const useTypewriter = (text, charsPerSecond = 60) => {
    const [count, setCount] = useState(0);
    const startRef = useRef(null);

    useEffect(() => {
        setCount(0);
        startRef.current = null;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(text.length);
            return undefined;
        }

        let frame;
        const tick = (now) => {
            if (startRef.current === null) startRef.current = now;
            const elapsed = (now - startRef.current) / 1000;
            const next = Math.min(text.length, Math.floor(elapsed * charsPerSecond));
            setCount(next);
            if (next < text.length) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [text, charsPerSecond]);

    return {
        output: text.slice(0, count),
        done: count >= text.length,
        skip: () => setCount(text.length),
    };
};

export { useTypewriter };
