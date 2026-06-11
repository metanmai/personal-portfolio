import { useEffect, useState } from 'react';

// App-wide cache so each feed is fetched once and shared everywhere. This lets
// us warm the surveillance feeds during the boot sequence (see
// prefetchRemoteData) so the page paints with data already in hand instead of
// flashing a loading state every time it is opened.
const cache = new Map(); // url -> { status, data }
const inflight = new Map(); // url -> Promise
const subscribers = new Map(); // url -> Set<setState>

const publish = (url, value) => {
    cache.set(url, value);
    const subs = subscribers.get(url);
    if (subs) subs.forEach((notify) => notify(value));
};

const runFetch = (url) => {
    if (inflight.has(url)) return inflight.get(url);
    if (!cache.has(url)) cache.set(url, { status: 'loading', data: null });

    const promise = (async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                publish(url, { status: 'failed', data: null });
                return;
            }
            const data = await response.json();
            publish(url, { status: 'ready', data });
        } catch {
            publish(url, { status: 'failed', data: null });
        } finally {
            inflight.delete(url);
        }
    })();

    inflight.set(url, promise);
    return promise;
};

// Kick a fetch off ahead of render (e.g. during boot) so the result is cached
// before any component asks for it. No-op if already fetched or in flight.
const prefetchRemoteData = (url) => {
    if (!url || cache.has(url) || inflight.has(url)) return;
    runFetch(url);
};

const useRemoteData = (url) => {
    const [state, setState] = useState(() => cache.get(url) || { status: 'loading', data: null });

    useEffect(() => {
        if (!url) return undefined;

        let subs = subscribers.get(url);
        if (!subs) {
            subs = new Set();
            subscribers.set(url, subs);
        }
        subs.add(setState);

        // Sync to whatever the cache holds now: a warmed url renders instantly,
        // an unseen url drops to loading until its fetch resolves.
        setState(cache.has(url) ? cache.get(url) : { status: 'loading', data: null });

        if (!cache.has(url) && !inflight.has(url)) {
            runFetch(url);
        }

        return () => {
            subs.delete(setState);
        };
    }, [url]);

    return state;
};

export { useRemoteData, prefetchRemoteData };
