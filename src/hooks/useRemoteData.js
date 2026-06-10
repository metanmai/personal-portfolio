import { useEffect, useState } from 'react';

const useRemoteData = (url) => {
    const [state, setState] = useState({ status: 'loading', data: null });

    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;

        setState({ status: 'loading', data: null });

        (async () => {
            try {
                const response = await fetch(url, { signal: controller.signal });
                if (cancelled) return;
                if (!response.ok) {
                    setState({ status: 'failed', data: null });
                    return;
                }
                const data = await response.json();
                if (cancelled) return;
                setState({ status: 'ready', data });
            } catch (error) {
                if (cancelled || (error && error.name === 'AbortError')) return;
                setState({ status: 'failed', data: null });
            }
        })();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [url]);

    return state;
};

export { useRemoteData };
